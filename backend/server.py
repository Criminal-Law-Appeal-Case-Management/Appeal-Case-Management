from fastapi import FastAPI, APIRouter, HTTPException, Response, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import base64
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Justitia AI - Criminal Appeal Case Management")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Case(BaseModel):
    model_config = ConfigDict(extra="ignore")
    case_id: str = Field(default_factory=lambda: f"case_{uuid.uuid4().hex[:12]}")
    user_id: str
    title: str
    defendant_name: str
    case_number: Optional[str] = None
    court: Optional[str] = None
    judge: Optional[str] = None
    status: str = "active"
    summary: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseCreate(BaseModel):
    title: str
    defendant_name: str
    case_number: Optional[str] = None
    court: Optional[str] = None
    judge: Optional[str] = None
    summary: Optional[str] = None

class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    document_id: str = Field(default_factory=lambda: f"doc_{uuid.uuid4().hex[:12]}")
    case_id: str
    user_id: str
    filename: str
    file_type: str
    category: str  # brief, case_note, public_advertising, evidence, court_document, other
    description: Optional[str] = None
    content_text: Optional[str] = None  # Extracted text for analysis
    file_data: Optional[str] = None  # Base64 encoded file data
    event_date: Optional[datetime] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TimelineEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: f"evt_{uuid.uuid4().hex[:12]}")
    case_id: str
    user_id: str
    title: str
    description: str
    event_date: datetime
    event_type: str  # arrest, court_hearing, evidence_discovery, appeal_filed, verdict, other
    document_ids: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TimelineEventCreate(BaseModel):
    title: str
    description: str
    event_date: datetime
    event_type: str
    document_ids: List[str] = []

class GroundOfMerit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ground_id: str = Field(default_factory=lambda: f"gnd_{uuid.uuid4().hex[:12]}")
    case_id: str
    user_id: str
    title: str
    ground_type: str  # procedural_error, fresh_evidence, miscarriage_of_justice, sentencing_error, judicial_error, ineffective_counsel, other
    description: str
    strength: str = "moderate"  # strong, moderate, weak
    status: str = "identified"  # identified, investigating, confirmed, rejected
    supporting_evidence: List[str] = []
    law_sections: List[dict] = []  # {jurisdiction, section, title, relevance, full_text}
    similar_cases: List[dict] = []  # {case_name, citation, relevance, outcome}
    analysis: Optional[str] = None
    deep_analysis: Optional[dict] = None  # Detailed analysis content
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GroundOfMeritCreate(BaseModel):
    title: str
    ground_type: str = "other"
    description: str
    strength: str = "moderate"
    supporting_evidence: List[str] = []

class GroundOfMeritUpdate(BaseModel):
    title: Optional[str] = None
    ground_type: Optional[str] = None
    description: Optional[str] = None
    strength: Optional[str] = None
    status: Optional[str] = None
    supporting_evidence: Optional[List[str]] = None

class ReportRequest(BaseModel):
    report_type: str = "quick_summary"

class Report(BaseModel):
    model_config = ConfigDict(extra="ignore")
    report_id: str = Field(default_factory=lambda: f"rpt_{uuid.uuid4().hex[:12]}")
    case_id: str
    user_id: str
    report_type: str  # quick_summary, full_detailed, extensive_log
    title: str
    content: dict  # JSON structure with report sections
    grounds_of_merit: List[dict] = []
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Note(BaseModel):
    model_config = ConfigDict(extra="ignore")
    note_id: str = Field(default_factory=lambda: f"note_{uuid.uuid4().hex[:12]}")
    case_id: str
    user_id: str
    author_name: str
    author_email: str
    category: str = "general"  # general, legal_opinion, evidence_note, strategy, question, action_item
    title: str
    content: str
    is_pinned: bool = False
    document_id: Optional[str] = None  # Link to specific document
    report_id: Optional[str] = None  # Link to specific report
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NoteCreate(BaseModel):
    category: str = "general"
    title: str
    content: str
    is_pinned: bool = False
    document_id: Optional[str] = None
    report_id: Optional[str] = None

class NoteUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    is_pinned: Optional[bool] = None

# ============ AUTH HELPERS ============

async def get_current_user(request: Request) -> User:
    """Get current user from session token (cookie or header)"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get user data
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    
    if auth_response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    
    user_data = auth_response.json()
    
    # Create or update user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": user_data["name"],
                "picture": user_data.get("picture"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        await db.users.insert_one({
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Create session
    session_token = user_data.get("session_token", f"sess_{uuid.uuid4().hex}")
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user_doc

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user info"""
    user = await get_current_user(request)
    return user.model_dump()

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/", samesite="none", secure=True)
    return {"message": "Logged out"}

# ============ CASE ENDPOINTS ============

@api_router.get("/cases", response_model=List[dict])
async def get_cases(request: Request):
    """Get all cases for current user"""
    user = await get_current_user(request)
    cases = await db.cases.find({"user_id": user.user_id}, {"_id": 0}).sort("updated_at", -1).to_list(100)
    
    # Add document and event counts
    for case in cases:
        doc_count = await db.documents.count_documents({"case_id": case["case_id"]})
        event_count = await db.timeline_events.count_documents({"case_id": case["case_id"]})
        case["document_count"] = doc_count
        case["event_count"] = event_count
    
    return cases

@api_router.post("/cases", response_model=dict)
async def create_case(case_data: CaseCreate, request: Request):
    """Create a new case"""
    user = await get_current_user(request)
    
    case = Case(
        user_id=user.user_id,
        **case_data.model_dump()
    )
    
    case_dict = case.model_dump()
    case_dict["created_at"] = case_dict["created_at"].isoformat()
    case_dict["updated_at"] = case_dict["updated_at"].isoformat()
    
    await db.cases.insert_one(case_dict)
    
    # Return the case without MongoDB's _id field
    created_case = await db.cases.find_one({"case_id": case.case_id}, {"_id": 0})
    return created_case

@api_router.get("/cases/{case_id}", response_model=dict)
async def get_case(case_id: str, request: Request):
    """Get a specific case"""
    user = await get_current_user(request)
    
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Add counts
    case["document_count"] = await db.documents.count_documents({"case_id": case_id})
    case["event_count"] = await db.timeline_events.count_documents({"case_id": case_id})
    
    return case

@api_router.put("/cases/{case_id}", response_model=dict)
async def update_case(case_id: str, case_data: CaseCreate, request: Request):
    """Update a case"""
    user = await get_current_user(request)
    
    result = await db.cases.update_one(
        {"case_id": case_id, "user_id": user.user_id},
        {"$set": {
            **case_data.model_dump(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return await db.cases.find_one({"case_id": case_id}, {"_id": 0})

@api_router.delete("/cases/{case_id}")
async def delete_case(case_id: str, request: Request):
    """Delete a case and all related data"""
    user = await get_current_user(request)
    
    # Delete related data
    await db.documents.delete_many({"case_id": case_id, "user_id": user.user_id})
    await db.timeline_events.delete_many({"case_id": case_id, "user_id": user.user_id})
    await db.reports.delete_many({"case_id": case_id, "user_id": user.user_id})
    
    result = await db.cases.delete_one({"case_id": case_id, "user_id": user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return {"message": "Case deleted"}

# ============ DOCUMENT ENDPOINTS ============

@api_router.get("/cases/{case_id}/documents", response_model=List[dict])
async def get_documents(case_id: str, request: Request):
    """Get all documents for a case"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0, "file_data": 0}  # Exclude file data for listing
    ).sort("uploaded_at", -1).to_list(500)
    
    return documents

@api_router.post("/cases/{case_id}/documents", response_model=dict)
async def upload_document(
    case_id: str,
    request: Request,
    file: UploadFile = File(...),
    category: str = Form(...),
    description: str = Form(None),
    event_date: str = Form(None)
):
    """Upload a document to a case"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Read file content
    file_content = await file.read()
    file_base64 = base64.b64encode(file_content).decode('utf-8')
    
    # Extract text content based on file type
    content_text = ""
    file_type = file.content_type or "application/octet-stream"
    filename_lower = file.filename.lower() if file.filename else ""
    
    try:
        if "text" in file_type or filename_lower.endswith('.txt'):
            content_text = file_content.decode('utf-8', errors='ignore')
        
        elif "pdf" in file_type or filename_lower.endswith('.pdf'):
            # Extract text from PDF
            try:
                import io
                from PyPDF2 import PdfReader
                pdf_reader = PdfReader(io.BytesIO(file_content))
                text_parts = []
                for page in pdf_reader.pages[:20]:  # Limit to first 20 pages
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                content_text = "\n".join(text_parts)
            except Exception as e:
                logger.warning(f"PDF extraction failed: {e}")
                content_text = ""
        
        elif filename_lower.endswith('.docx') or "word" in file_type:
            # Extract text from DOCX
            try:
                import io
                from docx import Document as DocxDocument
                doc = DocxDocument(io.BytesIO(file_content))
                text_parts = []
                for para in doc.paragraphs:
                    if para.text.strip():
                        text_parts.append(para.text)
                content_text = "\n".join(text_parts)
            except Exception as e:
                logger.warning(f"DOCX extraction failed: {e}")
                content_text = ""
    except Exception as e:
        logger.warning(f"Text extraction error: {e}")
        content_text = ""
    
    # Parse event date
    parsed_event_date = None
    if event_date:
        try:
            parsed_event_date = datetime.fromisoformat(event_date.replace('Z', '+00:00')).isoformat()
        except:
            pass
    
    doc = Document(
        case_id=case_id,
        user_id=user.user_id,
        filename=file.filename,
        file_type=file_type,
        category=category,
        description=description,
        content_text=content_text,
        file_data=file_base64
    )
    
    doc_dict = doc.model_dump()
    doc_dict["uploaded_at"] = doc_dict["uploaded_at"].isoformat()
    if parsed_event_date:
        doc_dict["event_date"] = parsed_event_date
    
    await db.documents.insert_one(doc_dict)
    
    # Update case updated_at
    await db.cases.update_one(
        {"case_id": case_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Return the document without MongoDB's _id field and file_data
    created_doc = await db.documents.find_one({"document_id": doc.document_id}, {"_id": 0, "file_data": 0})
    return created_doc

@api_router.get("/cases/{case_id}/documents/{document_id}", response_model=dict)
async def get_document(case_id: str, document_id: str, request: Request):
    """Get a specific document"""
    user = await get_current_user(request)
    
    doc = await db.documents.find_one(
        {"document_id": document_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return doc

@api_router.delete("/cases/{case_id}/documents/{document_id}")
async def delete_document(case_id: str, document_id: str, request: Request):
    """Delete a document"""
    user = await get_current_user(request)
    
    result = await db.documents.delete_one({
        "document_id": document_id,
        "case_id": case_id,
        "user_id": user.user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"message": "Document deleted"}

@api_router.post("/cases/{case_id}/documents/{document_id}/extract-text", response_model=dict)
async def extract_document_text(case_id: str, document_id: str, request: Request):
    """Re-extract text from a document (useful if initial extraction failed)"""
    user = await get_current_user(request)
    
    doc = await db.documents.find_one(
        {"document_id": document_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc.get('file_data'):
        raise HTTPException(status_code=400, detail="No file data available")
    
    # Decode file content
    file_content = base64.b64decode(doc['file_data'])
    filename_lower = doc.get('filename', '').lower()
    file_type = doc.get('file_type', '')
    
    content_text = ""
    
    try:
        if "text" in file_type or filename_lower.endswith('.txt'):
            content_text = file_content.decode('utf-8', errors='ignore')
        
        elif "pdf" in file_type or filename_lower.endswith('.pdf'):
            try:
                import io
                from PyPDF2 import PdfReader
                pdf_reader = PdfReader(io.BytesIO(file_content))
                text_parts = []
                for page in pdf_reader.pages[:30]:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                content_text = "\n".join(text_parts)
            except Exception as e:
                logger.warning(f"PDF extraction failed: {e}")
        
        elif filename_lower.endswith('.docx') or "word" in file_type:
            try:
                import io
                from docx import Document as DocxDocument
                docx_doc = DocxDocument(io.BytesIO(file_content))
                text_parts = []
                for para in docx_doc.paragraphs:
                    if para.text.strip():
                        text_parts.append(para.text)
                content_text = "\n".join(text_parts)
            except Exception as e:
                logger.warning(f"DOCX extraction failed: {e}")
    except Exception as e:
        logger.error(f"Text extraction error: {e}")
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")
    
    # Update document with extracted text
    await db.documents.update_one(
        {"document_id": document_id},
        {"$set": {
            "content_text": content_text,
            "text_extracted_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {
        "document_id": document_id,
        "filename": doc.get('filename'),
        "content_length": len(content_text),
        "content_preview": content_text[:500] + "..." if len(content_text) > 500 else content_text,
        "success": bool(content_text)
    }

@api_router.post("/cases/{case_id}/extract-all-text", response_model=dict)
async def extract_all_documents_text(case_id: str, request: Request):
    """Extract text from all documents in a case"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(500)
    
    results = []
    for doc in documents:
        if not doc.get('file_data'):
            results.append({"document_id": doc['document_id'], "success": False, "error": "No file data"})
            continue
        
        file_content = base64.b64decode(doc['file_data'])
        filename_lower = doc.get('filename', '').lower()
        file_type = doc.get('file_type', '')
        
        content_text = ""
        error = None
        
        try:
            if "text" in file_type or filename_lower.endswith('.txt'):
                content_text = file_content.decode('utf-8', errors='ignore')
            
            elif "pdf" in file_type or filename_lower.endswith('.pdf'):
                try:
                    import io
                    from PyPDF2 import PdfReader
                    pdf_reader = PdfReader(io.BytesIO(file_content))
                    text_parts = []
                    for page in pdf_reader.pages[:30]:
                        page_text = page.extract_text()
                        if page_text:
                            text_parts.append(page_text)
                    content_text = "\n".join(text_parts)
                except Exception as e:
                    error = str(e)
            
            elif filename_lower.endswith('.docx') or "word" in file_type:
                try:
                    import io
                    from docx import Document as DocxDocument
                    docx_doc = DocxDocument(io.BytesIO(file_content))
                    text_parts = []
                    for para in docx_doc.paragraphs:
                        if para.text.strip():
                            text_parts.append(para.text)
                    content_text = "\n".join(text_parts)
                except Exception as e:
                    error = str(e)
        except Exception as e:
            error = str(e)
        
        # Update document
        if content_text:
            await db.documents.update_one(
                {"document_id": doc['document_id']},
                {"$set": {
                    "content_text": content_text,
                    "text_extracted_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        results.append({
            "document_id": doc['document_id'],
            "filename": doc.get('filename'),
            "success": bool(content_text),
            "content_length": len(content_text) if content_text else 0,
            "error": error
        })
    
    successful = sum(1 for r in results if r['success'])
    return {
        "total_documents": len(documents),
        "successful_extractions": successful,
        "results": results
    }

# ============ TIMELINE ENDPOINTS ============

@api_router.get("/cases/{case_id}/timeline", response_model=List[dict])
async def get_timeline(case_id: str, request: Request):
    """Get timeline events for a case"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    events = await db.timeline_events.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort("event_date", 1).to_list(500)
    
    return events

@api_router.post("/cases/{case_id}/timeline", response_model=dict)
async def create_timeline_event(case_id: str, event_data: TimelineEventCreate, request: Request):
    """Create a timeline event"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    event = TimelineEvent(
        case_id=case_id,
        user_id=user.user_id,
        **event_data.model_dump()
    )
    
    event_dict = event.model_dump()
    event_dict["event_date"] = event_dict["event_date"].isoformat()
    event_dict["created_at"] = event_dict["created_at"].isoformat()
    
    await db.timeline_events.insert_one(event_dict)
    
    # Update case
    await db.cases.update_one(
        {"case_id": case_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Return the event without MongoDB's _id field
    created_event = await db.timeline_events.find_one({"event_id": event.event_id}, {"_id": 0})
    return created_event

@api_router.put("/cases/{case_id}/timeline/{event_id}", response_model=dict)
async def update_timeline_event(case_id: str, event_id: str, event_data: TimelineEventCreate, request: Request):
    """Update a timeline event"""
    user = await get_current_user(request)
    
    update_data = event_data.model_dump()
    update_data["event_date"] = update_data["event_date"].isoformat()
    
    result = await db.timeline_events.update_one(
        {"event_id": event_id, "case_id": case_id, "user_id": user.user_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return await db.timeline_events.find_one({"event_id": event_id}, {"_id": 0})

@api_router.delete("/cases/{case_id}/timeline/{event_id}")
async def delete_timeline_event(case_id: str, event_id: str, request: Request):
    """Delete a timeline event"""
    user = await get_current_user(request)
    
    result = await db.timeline_events.delete_one({
        "event_id": event_id,
        "case_id": case_id,
        "user_id": user.user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted"}

# ============ NOTES & COMMENTS ENDPOINTS ============

@api_router.get("/cases/{case_id}/notes", response_model=List[dict])
async def get_notes(case_id: str, request: Request):
    """Get all notes for a case"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    notes = await db.notes.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort([("is_pinned", -1), ("created_at", -1)]).to_list(500)
    
    return notes

@api_router.post("/cases/{case_id}/notes", response_model=dict)
async def create_note(case_id: str, note_data: NoteCreate, request: Request):
    """Create a new note"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    note = Note(
        case_id=case_id,
        user_id=user.user_id,
        author_name=user.name,
        author_email=user.email,
        **note_data.model_dump()
    )
    
    note_dict = note.model_dump()
    note_dict["created_at"] = note_dict["created_at"].isoformat()
    note_dict["updated_at"] = note_dict["updated_at"].isoformat()
    
    await db.notes.insert_one(note_dict)
    
    # Update case
    await db.cases.update_one(
        {"case_id": case_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    created_note = await db.notes.find_one({"note_id": note.note_id}, {"_id": 0})
    return created_note

@api_router.get("/cases/{case_id}/notes/{note_id}", response_model=dict)
async def get_note(case_id: str, note_id: str, request: Request):
    """Get a specific note"""
    user = await get_current_user(request)
    
    note = await db.notes.find_one(
        {"note_id": note_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return note

@api_router.put("/cases/{case_id}/notes/{note_id}", response_model=dict)
async def update_note(case_id: str, note_id: str, note_data: NoteUpdate, request: Request):
    """Update a note"""
    user = await get_current_user(request)
    
    update_fields = {k: v for k, v in note_data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.notes.update_one(
        {"note_id": note_id, "case_id": case_id, "user_id": user.user_id},
        {"$set": update_fields}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return await db.notes.find_one({"note_id": note_id}, {"_id": 0})

@api_router.delete("/cases/{case_id}/notes/{note_id}")
async def delete_note(case_id: str, note_id: str, request: Request):
    """Delete a note"""
    user = await get_current_user(request)
    
    result = await db.notes.delete_one({
        "note_id": note_id,
        "case_id": case_id,
        "user_id": user.user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return {"message": "Note deleted"}

@api_router.patch("/cases/{case_id}/notes/{note_id}/pin")
async def toggle_pin_note(case_id: str, note_id: str, request: Request):
    """Toggle pin status of a note"""
    user = await get_current_user(request)
    
    note = await db.notes.find_one(
        {"note_id": note_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    new_pin_status = not note.get("is_pinned", False)
    
    await db.notes.update_one(
        {"note_id": note_id},
        {"$set": {"is_pinned": new_pin_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return await db.notes.find_one({"note_id": note_id}, {"_id": 0})

# ============ GROUNDS OF MERIT ENDPOINTS ============

GROUND_TYPES = [
    "procedural_error",
    "fresh_evidence", 
    "miscarriage_of_justice",
    "sentencing_error",
    "judicial_error",
    "ineffective_counsel",
    "prosecution_misconduct",
    "jury_irregularity",
    "constitutional_violation",
    "other"
]

@api_router.get("/cases/{case_id}/grounds", response_model=List[dict])
async def get_grounds_of_merit(case_id: str, request: Request):
    """Get all grounds of merit for a case"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    grounds = await db.grounds_of_merit.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort([("strength", 1), ("created_at", -1)]).to_list(100)
    
    return grounds

@api_router.post("/cases/{case_id}/grounds", response_model=dict)
async def create_ground_of_merit(case_id: str, ground_data: GroundOfMeritCreate, request: Request):
    """Create a new ground of merit"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    ground = GroundOfMerit(
        case_id=case_id,
        user_id=user.user_id,
        **ground_data.model_dump()
    )
    
    ground_dict = ground.model_dump()
    ground_dict["created_at"] = ground_dict["created_at"].isoformat()
    ground_dict["updated_at"] = ground_dict["updated_at"].isoformat()
    
    await db.grounds_of_merit.insert_one(ground_dict)
    
    # Update case
    await db.cases.update_one(
        {"case_id": case_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    created_ground = await db.grounds_of_merit.find_one({"ground_id": ground.ground_id}, {"_id": 0})
    return created_ground

@api_router.get("/cases/{case_id}/grounds/{ground_id}", response_model=dict)
async def get_ground_of_merit(case_id: str, ground_id: str, request: Request):
    """Get a specific ground of merit"""
    user = await get_current_user(request)
    
    ground = await db.grounds_of_merit.find_one(
        {"ground_id": ground_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not ground:
        raise HTTPException(status_code=404, detail="Ground of merit not found")
    
    return ground

@api_router.put("/cases/{case_id}/grounds/{ground_id}", response_model=dict)
async def update_ground_of_merit(case_id: str, ground_id: str, ground_data: GroundOfMeritUpdate, request: Request):
    """Update a ground of merit"""
    user = await get_current_user(request)
    
    update_fields = {k: v for k, v in ground_data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.grounds_of_merit.update_one(
        {"ground_id": ground_id, "case_id": case_id, "user_id": user.user_id},
        {"$set": update_fields}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ground of merit not found")
    
    return await db.grounds_of_merit.find_one({"ground_id": ground_id}, {"_id": 0})

@api_router.delete("/cases/{case_id}/grounds/{ground_id}")
async def delete_ground_of_merit(case_id: str, ground_id: str, request: Request):
    """Delete a ground of merit"""
    user = await get_current_user(request)
    
    result = await db.grounds_of_merit.delete_one({
        "ground_id": ground_id,
        "case_id": case_id,
        "user_id": user.user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ground of merit not found")
    
    return {"message": "Ground of merit deleted"}

@api_router.post("/cases/{case_id}/grounds/{ground_id}/investigate", response_model=dict)
async def investigate_ground_of_merit(case_id: str, ground_id: str, request: Request):
    """Deep AI investigation of a specific ground of merit"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    user = await get_current_user(request)
    
    # Get the ground
    ground = await db.grounds_of_merit.find_one(
        {"ground_id": ground_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not ground:
        raise HTTPException(status_code=404, detail="Ground of merit not found")
    
    # Get case data
    case = await db.cases.find_one({"case_id": case_id}, {"_id": 0})
    
    # Build concise context
    context = f"""
CASE: {case.get('title', 'Unknown')} | DEFENDANT: {case.get('defendant_name', 'Unknown')}
COURT: {case.get('court', 'N/A')} | CASE NO: {case.get('case_number', 'N/A')}

GROUND OF MERIT:
Title: {ground.get('title')}
Type: {ground.get('ground_type')}
Description: {ground.get('description')}
Strength: {ground.get('strength')}
"""

    system_prompt = """You are an Australian criminal appeal barrister expert in NSW and Federal murder law. Be concise but thorough."""

    user_prompt = f"""Analyze this criminal appeal ground of merit:

{context}

Provide a focused analysis covering:
1. VIABILITY ASSESSMENT - Is this ground likely to succeed? Rate: Strong/Moderate/Weak
2. RELEVANT LAW SECTIONS - List 3-5 specific sections (e.g., s.18 Crimes Act 1900 NSW, s.6 Criminal Appeal Act 1912 NSW)
3. SIMILAR CASES - Name 2-3 relevant Australian cases with brief relevance
4. EVIDENCE NEEDED - What evidence strengthens this ground
5. RECOMMENDATION - Brief strategic advice

Be specific with section numbers and case citations. Keep response under 800 words."""

    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"ground_{ground_id}_{uuid.uuid4().hex[:8]}",
            system_message=system_prompt
        ).with_model("openai", "gpt-5.2")
        
        response = await chat.send_message(UserMessage(text=user_prompt))
    except Exception as e:
        logger.error(f"AI analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    
    # Parse response to extract structured data
    law_sections = []
    similar_cases = []
    
    # Simple extraction - look for section patterns
    import re
    section_patterns = re.findall(r'[sS]\.?\s*(\d+[A-Za-z]?)\s+([A-Za-z\s]+(?:Act|Code))\s*(?:\d{4})?', response)
    for section_num, act_name in section_patterns[:10]:
        law_sections.append({
            "section": section_num,
            "act": act_name.strip(),
            "jurisdiction": "NSW" if "NSW" in act_name or "1900" in response else "Federal"
        })
    
    # Extract case citations
    case_patterns = re.findall(r'([A-Z][a-z]+(?:\s+v\s+)[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', response)
    for case_name in list(set(case_patterns))[:5]:
        similar_cases.append({
            "case_name": case_name,
            "year": "",
            "citation": ""
        })
    
    # Update the ground with investigation results
    deep_analysis = {
        "full_analysis": response,
        "investigated_at": datetime.now(timezone.utc).isoformat(),
        "law_sections_identified": len(law_sections),
        "similar_cases_found": len(similar_cases)
    }
    
    await db.grounds_of_merit.update_one(
        {"ground_id": ground_id},
        {"$set": {
            "status": "investigating",
            "analysis": response[:2000] + "..." if len(response) > 2000 else response,
            "deep_analysis": deep_analysis,
            "law_sections": law_sections if law_sections else ground.get("law_sections", []),
            "similar_cases": similar_cases if similar_cases else ground.get("similar_cases", []),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return await db.grounds_of_merit.find_one({"ground_id": ground_id}, {"_id": 0})

@api_router.post("/cases/{case_id}/grounds/auto-identify", response_model=dict)
async def auto_identify_grounds(case_id: str, request: Request):
    """AI automatically identifies potential grounds of merit from case materials"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get all case materials - include content_text for analysis
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0, "file_data": 0}
    ).to_list(500)
    
    timeline = await db.timeline_events.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort("event_date", 1).to_list(500)
    
    notes = await db.notes.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(500)
    
    # Build comprehensive context with full document content
    context = f"""
CRIMINAL APPEAL CASE ANALYSIS

CASE DETAILS:
- Title: {case.get('title', 'Unknown')}
- Defendant: {case.get('defendant_name', 'Unknown')}
- Case Number: {case.get('case_number', 'N/A')}
- Court: {case.get('court', 'N/A')}
- Judge: {case.get('judge', 'N/A')}
- Summary: {case.get('summary', 'No summary provided')}

"""
    
    # Include substantial document content for AI to analyze
    if documents:
        context += f"=== CASE DOCUMENTS ({len(documents)} files) ===\n\n"
        for doc in documents:
            context += f"--- DOCUMENT: {doc.get('filename')} ---\n"
            context += f"Category: {doc.get('category', 'other')}\n"
            if doc.get('description'):
                context += f"Description: {doc.get('description')}\n"
            
            # Include up to 3000 chars of content per document
            content = doc.get('content_text', '')
            if content:
                context += f"CONTENT:\n{content[:3000]}\n"
                if len(content) > 3000:
                    context += f"[... {len(content) - 3000} more characters ...]\n"
            else:
                context += "CONTENT: [No text content extracted - may be image/scan]\n"
            context += "\n"
    else:
        context += "NO DOCUMENTS UPLOADED YET - Analysis based on case summary only.\n\n"

    if timeline:
        context += f"=== TIMELINE OF EVENTS ({len(timeline)} events) ===\n"
        for event in timeline:
            context += f"- {event.get('event_date', 'Unknown date')} [{event.get('event_type', 'event')}]: {event.get('title')}\n"
            if event.get('description'):
                context += f"  Details: {event.get('description')}\n"
        context += "\n"

    if notes:
        context += f"=== LEGAL NOTES & OBSERVATIONS ({len(notes)} notes) ===\n"
        for note in notes:
            context += f"- [{note.get('category', 'general')}] {note.get('title')}:\n"
            context += f"  {note.get('content', '')[:500]}\n"
        context += "\n"

    system_prompt = """You are an expert Australian criminal appeal barrister specializing in murder and manslaughter cases. 

Your task is to THOROUGHLY analyze the provided case materials and identify ALL potential grounds of merit for a criminal appeal.

IMPORTANT: Carefully read and analyze ALL document content provided. Look for:
- Procedural irregularities at trial
- Evidence that was wrongly admitted or excluded
- Judicial errors in directions to jury
- Issues with legal representation
- Fresh evidence that could change the outcome
- Sentencing errors
- Prosecutorial misconduct
- Jury issues

Be thorough and identify every possible ground, even weak ones. The legal team will assess viability.

If no documents have been uploaded, suggest what documents would be needed to identify grounds."""

    user_prompt = f"""Analyze this criminal appeal case and identify ALL potential grounds of merit:

{context}

For EACH ground identified, provide in this EXACT JSON format:
{{
  "grounds": [
    {{
      "title": "Clear, concise title for the ground",
      "ground_type": "One of: procedural_error, fresh_evidence, miscarriage_of_justice, sentencing_error, judicial_error, ineffective_counsel, prosecution_misconduct, jury_irregularity, constitutional_violation, other",
      "description": "Detailed description of the ground and why it may be viable",
      "strength": "strong, moderate, or weak",
      "key_evidence": ["List of evidence supporting this ground"],
      "relevant_law": ["List of relevant law sections e.g., 's.18 Crimes Act 1900 (NSW)'"]
    }}
  ],
  "summary": "Brief overall assessment of appeal prospects"
}}

Identify at least 3-5 potential grounds if the materials support them. Consider:
1. Trial procedural errors
2. Evidentiary issues (admissibility, exclusion)
3. Judicial directions to jury
4. Prosecution conduct
5. Defense representation quality
6. Sentencing proportionality
7. Fresh evidence possibilities
8. Constitutional issues
9. Miscarriage of justice indicators"""

    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"auto_identify_{case_id}_{uuid.uuid4().hex[:8]}",
        system_message=system_prompt
    ).with_model("openai", "gpt-5.2")
    
    response = await chat.send_message(UserMessage(text=user_prompt))
    
    # Try to parse JSON from response
    identified_grounds = []
    try:
        import re
        json_match = re.search(r'\{[\s\S]*"grounds"[\s\S]*\}', response)
        if json_match:
            parsed = json.loads(json_match.group())
            grounds_data = parsed.get("grounds", [])
            
            for g in grounds_data:
                ground = GroundOfMerit(
                    case_id=case_id,
                    user_id=user.user_id,
                    title=g.get("title", "Identified Ground"),
                    ground_type=g.get("ground_type", "other"),
                    description=g.get("description", ""),
                    strength=g.get("strength", "moderate"),
                    supporting_evidence=g.get("key_evidence", []),
                    status="identified"
                )
                
                ground_dict = ground.model_dump()
                ground_dict["created_at"] = ground_dict["created_at"].isoformat()
                ground_dict["updated_at"] = ground_dict["updated_at"].isoformat()
                
                await db.grounds_of_merit.insert_one(ground_dict)
                # Fetch the inserted ground without _id
                created_ground = await db.grounds_of_merit.find_one({"ground_id": ground.ground_id}, {"_id": 0})
                identified_grounds.append(created_ground)
    except Exception as e:
        logger.error(f"Failed to parse AI response: {e}")
        # Create a single ground with the raw analysis
        ground = GroundOfMerit(
            case_id=case_id,
            user_id=user.user_id,
            title="AI Analysis Results",
            ground_type="other",
            description="See analysis for identified grounds",
            strength="moderate",
            analysis=response,
            status="identified"
        )
        ground_dict = ground.model_dump()
        ground_dict["created_at"] = ground_dict["created_at"].isoformat()
        ground_dict["updated_at"] = ground_dict["updated_at"].isoformat()
        await db.grounds_of_merit.insert_one(ground_dict)
        # Fetch the inserted ground without _id
        created_ground = await db.grounds_of_merit.find_one({"ground_id": ground.ground_id}, {"_id": 0})
        identified_grounds.append(created_ground)
    
    # Update case
    await db.cases.update_one(
        {"case_id": case_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {
        "identified_count": len(identified_grounds),
        "grounds": identified_grounds,
        "raw_analysis": response
    }

# ============ AI ANALYSIS & REPORTS ============

async def analyze_case_with_ai(case_id: str, user_id: str, report_type: str) -> dict:
    """Use OpenAI GPT-5.2 to analyze case and generate report"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    # Get case data
    case = await db.cases.find_one({"case_id": case_id, "user_id": user_id}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get documents
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0, "file_data": 0}
    ).to_list(500)
    
    # Get timeline
    timeline = await db.timeline_events.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort("event_date", 1).to_list(500)
    
    # Prepare context for AI
    case_context = f"""
CASE INFORMATION:
Title: {case.get('title', 'N/A')}
Defendant: {case.get('defendant_name', 'N/A')}
Case Number: {case.get('case_number', 'N/A')}
Court: {case.get('court', 'N/A')}
Judge: {case.get('judge', 'N/A')}
Summary: {case.get('summary', 'N/A')}

DOCUMENTS ({len(documents)} total):
"""
    for doc in documents:
        case_context += f"\n- [{doc.get('category', 'other')}] {doc.get('filename', 'Unnamed')}: {doc.get('description', 'No description')}"
        if doc.get('content_text'):
            case_context += f"\n  Content excerpt: {doc.get('content_text', '')[:500]}..."

    case_context += f"\n\nTIMELINE OF EVENTS ({len(timeline)} events):\n"
    for event in timeline:
        case_context += f"\n- [{event.get('event_date', 'Unknown date')}] {event.get('event_type', 'event')}: {event.get('title', 'Untitled')}\n  {event.get('description', '')}"

    # Define prompts based on report type
    if report_type == "quick_summary":
        system_prompt = """You are an expert criminal appeal legal analyst specializing in NSW State and Australian Federal murder law. 
Provide a concise summary of the case highlighting key points for an appeal."""
        user_prompt = f"""Analyze this criminal appeal case and provide a QUICK SUMMARY (2-3 paragraphs) including:
1. Brief case overview
2. Key evidence points
3. Primary grounds for appeal consideration

{case_context}"""

    elif report_type == "full_detailed":
        system_prompt = """You are an expert criminal appeal legal analyst specializing in NSW State and Australian Federal murder law.
You have extensive knowledge of:
- Crimes Act 1900 (NSW)
- Criminal Appeal Act 1912 (NSW)
- Criminal Code Act 1995 (Cth)
- Evidence Act 1995 (NSW & Cth)
- Sentencing Act 1995 (NSW)
Provide detailed legal analysis with specific law references."""
        user_prompt = f"""Analyze this criminal appeal case and provide a FULL DETAILED REPORT including:

1. CASE OVERVIEW: Comprehensive summary of the case facts
2. EVIDENCE ANALYSIS: Detailed analysis of each piece of evidence and its relevance
3. GROUNDS OF MERIT: Identify all potential grounds for appeal with:
   - Ground name and description
   - Supporting evidence
   - Relevant law sections (NSW State and Australian Federal) with exact references
   - How this ground serves justice
4. LEGAL FRAMEWORK: Relevant sections of NSW and Australian Federal criminal law relating to murder appeals
5. STRATEGIC RECOMMENDATIONS: Recommended approach for the appeal

Format your response as a structured legal brief suitable for presentation to a barrister.

{case_context}"""

    else:  # extensive_log
        system_prompt = """You are an expert criminal appeal legal analyst specializing in NSW State and Australian Federal murder law.
Provide exhaustive documentation and analysis of every aspect of the case."""
        user_prompt = f"""Analyze this criminal appeal case and provide an EXTENSIVE LOG REPORT covering:

1. COMPLETE CASE CHRONOLOGY: Every event in detailed sequence
2. DOCUMENT-BY-DOCUMENT ANALYSIS: Analysis of each document's significance
3. COMPREHENSIVE EVIDENCE REVIEW: All evidence with chain of custody considerations
4. EXHAUSTIVE GROUNDS OF MERIT: All possible grounds including:
   - Primary grounds (strong merit)
   - Secondary grounds (moderate merit)
   - Peripheral grounds (worth consideration)
   For each ground:
   - Detailed description
   - All supporting evidence
   - All relevant law sections (NSW Crimes Act, Criminal Appeal Act, Federal Criminal Code)
   - Case law precedents if applicable
   - Probability of success
5. PROCEDURAL REVIEW: Any procedural irregularities
6. WITNESS/TESTIMONY ANALYSIS: Review of any witness statements
7. SENTENCING CONSIDERATIONS: Analysis of sentencing aspects
8. COMPLETE LEGAL FRAMEWORK: All relevant legislation with section numbers
9. DETAILED RECOMMENDATIONS: Step-by-step strategic approach

{case_context}"""

    # Call OpenAI via Emergent
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"report_{case_id}_{uuid.uuid4().hex[:8]}",
        system_message=system_prompt
    ).with_model("openai", "gpt-5.2")
    
    response = await chat.send_message(UserMessage(text=user_prompt))
    
    # Parse response to extract grounds of merit
    grounds_of_merit = []
    if "GROUNDS OF MERIT" in response or "Ground" in response:
        # Simple extraction - in production would use more sophisticated parsing
        grounds_of_merit = [{
            "title": "AI-Identified Ground",
            "description": "See full report for details",
            "strength": "To be assessed by legal professional"
        }]
    
    return {
        "analysis": response,
        "grounds_of_merit": grounds_of_merit,
        "case_data": case,
        "document_count": len(documents),
        "event_count": len(timeline)
    }

@api_router.post("/cases/{case_id}/reports/generate", response_model=dict)
async def generate_report(case_id: str, request: Request):
    """Generate an AI-powered report for a case"""
    user = await get_current_user(request)
    body = await request.json()
    report_type = body.get("report_type", "quick_summary")
    
    if report_type not in ["quick_summary", "full_detailed", "extensive_log"]:
        raise HTTPException(status_code=400, detail="Invalid report type")
    
    # Generate AI analysis
    analysis_result = await analyze_case_with_ai(case_id, user.user_id, report_type)
    
    # Create report
    report_titles = {
        "quick_summary": "Quick Case Summary",
        "full_detailed": "Full Detailed Legal Analysis",
        "extensive_log": "Extensive Case Log & Analysis"
    }
    
    report = Report(
        case_id=case_id,
        user_id=user.user_id,
        report_type=report_type,
        title=report_titles[report_type],
        content={
            "analysis": analysis_result["analysis"],
            "case_title": analysis_result["case_data"].get("title", ""),
            "defendant": analysis_result["case_data"].get("defendant_name", ""),
            "document_count": analysis_result["document_count"],
            "event_count": analysis_result["event_count"]
        },
        grounds_of_merit=analysis_result["grounds_of_merit"]
    )
    
    report_dict = report.model_dump()
    report_dict["generated_at"] = report_dict["generated_at"].isoformat()
    
    await db.reports.insert_one(report_dict)
    
    # Return the report without MongoDB's _id field
    created_report = await db.reports.find_one({"report_id": report.report_id}, {"_id": 0})
    return created_report

@api_router.get("/cases/{case_id}/reports", response_model=List[dict])
async def get_reports(case_id: str, request: Request):
    """Get all reports for a case"""
    user = await get_current_user(request)
    
    reports = await db.reports.find(
        {"case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    ).sort("generated_at", -1).to_list(100)
    
    return reports

@api_router.get("/cases/{case_id}/reports/{report_id}", response_model=dict)
async def get_report(case_id: str, report_id: str, request: Request):
    """Get a specific report"""
    user = await get_current_user(request)
    
    report = await db.reports.find_one(
        {"report_id": report_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

@api_router.delete("/cases/{case_id}/reports/{report_id}")
async def delete_report(case_id: str, report_id: str, request: Request):
    """Delete a report"""
    user = await get_current_user(request)
    
    result = await db.reports.delete_one({
        "report_id": report_id,
        "case_id": case_id,
        "user_id": user.user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {"message": "Report deleted"}

# ============ HEALTH CHECK ============

@api_router.get("/")
async def root():
    return {"message": "Justitia AI API", "status": "operational"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
