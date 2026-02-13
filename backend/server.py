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
        except ValueError:
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

class DocumentSearchRequest(BaseModel):
    query: str
    case_sensitive: bool = False

class SearchMatch(BaseModel):
    document_id: str
    filename: str
    category: str
    matches: List[dict]  # List of {context, position}
    match_count: int

@api_router.post("/cases/{case_id}/documents/search", response_model=dict)
async def search_documents(case_id: str, search_request: DocumentSearchRequest, request: Request):
    """Search for text across all documents in a case"""
    import re
    
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    query = search_request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Search query is required")
    
    if len(query) < 2:
        raise HTTPException(status_code=400, detail="Search query must be at least 2 characters")
    
    # Get all documents with content
    documents = await db.documents.find(
        {"case_id": case_id, "content_text": {"$exists": True, "$ne": ""}},
        {"_id": 0, "file_data": 0}
    ).to_list(500)
    
    results = []
    total_matches = 0
    
    # Search flags
    flags = 0 if search_request.case_sensitive else re.IGNORECASE
    
    for doc in documents:
        content = doc.get("content_text", "")
        if not content:
            continue
        
        matches = []
        
        # Find all occurrences with context
        try:
            pattern = re.compile(re.escape(query), flags)
            for match in pattern.finditer(content):
                start_pos = match.start()
                end_pos = match.end()
                
                # Get context (100 chars before and after)
                context_start = max(0, start_pos - 100)
                context_end = min(len(content), end_pos + 100)
                
                context = content[context_start:context_end]
                
                # Add ellipsis if truncated
                if context_start > 0:
                    context = "..." + context
                if context_end < len(content):
                    context = context + "..."
                
                matches.append({
                    "context": context,
                    "position": start_pos,
                    "matched_text": match.group()
                })
                
                # Limit matches per document to prevent huge responses
                if len(matches) >= 10:
                    break
        except re.error:
            continue
        
        if matches:
            total_matches += len(matches)
            results.append({
                "document_id": doc.get("document_id"),
                "filename": doc.get("filename"),
                "category": doc.get("category"),
                "matches": matches,
                "match_count": len(matches)
            })
    
    # Sort by match count (most matches first)
    results.sort(key=lambda x: x["match_count"], reverse=True)
    
    return {
        "query": query,
        "total_matches": total_matches,
        "documents_with_matches": len(results),
        "total_documents_searched": len(documents),
        "results": results
    }

# ============ OCR FUNCTIONS ============

def extract_text_with_ocr(file_content: bytes, filename: str, file_type: str) -> tuple:
    """Extract text from images and scanned PDFs using OCR"""
    import io
    import pytesseract
    from PIL import Image
    
    filename_lower = filename.lower()
    extracted_text = ""
    ocr_used = False
    
    try:
        # Handle image files directly
        if any(filename_lower.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif', '.webp']):
            image = Image.open(io.BytesIO(file_content))
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            extracted_text = pytesseract.image_to_string(image)
            ocr_used = True
            logger.info(f"OCR extracted {len(extracted_text)} chars from image {filename}")
        
        # Handle PDFs - try regular extraction first, then OCR if needed
        elif "pdf" in file_type or filename_lower.endswith('.pdf'):
            # First try regular PDF text extraction
            try:
                from PyPDF2 import PdfReader
                pdf_reader = PdfReader(io.BytesIO(file_content))
                text_parts = []
                for page in pdf_reader.pages[:30]:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                extracted_text = "\n".join(text_parts)
            except Exception as e:
                logger.warning(f"Regular PDF extraction failed: {e}")
            
            # If minimal text extracted, try OCR
            if len(extracted_text.strip()) < 100:
                try:
                    from pdf2image import convert_from_bytes
                    
                    # Convert PDF pages to images
                    images = convert_from_bytes(
                        file_content, 
                        dpi=200,
                        first_page=1,
                        last_page=min(20, 20)  # Limit to 20 pages for performance
                    )
                    
                    ocr_parts = []
                    for i, image in enumerate(images):
                        # Convert to RGB if necessary
                        if image.mode in ('RGBA', 'P'):
                            image = image.convert('RGB')
                        page_text = pytesseract.image_to_string(image)
                        if page_text.strip():
                            ocr_parts.append(f"--- Page {i+1} ---\n{page_text}")
                    
                    if ocr_parts:
                        extracted_text = "\n\n".join(ocr_parts)
                        ocr_used = True
                        logger.info(f"OCR extracted {len(extracted_text)} chars from scanned PDF {filename}")
                except Exception as e:
                    logger.warning(f"PDF OCR failed: {e}")
        
        # Handle DOCX
        elif filename_lower.endswith('.docx') or "word" in file_type:
            try:
                from docx import Document as DocxDocument
                docx_doc = DocxDocument(io.BytesIO(file_content))
                text_parts = []
                for para in docx_doc.paragraphs:
                    if para.text.strip():
                        text_parts.append(para.text)
                extracted_text = "\n".join(text_parts)
            except Exception as e:
                logger.warning(f"DOCX extraction failed: {e}")
        
        # Handle plain text
        elif "text" in file_type or filename_lower.endswith('.txt'):
            extracted_text = file_content.decode('utf-8', errors='ignore')
    
    except Exception as e:
        logger.error(f"OCR/Text extraction error for {filename}: {e}")
    
    return extracted_text, ocr_used

@api_router.post("/cases/{case_id}/documents/{document_id}/ocr", response_model=dict)
async def ocr_document(case_id: str, document_id: str, request: Request):
    """Extract text from a document using OCR (for scanned documents and images)"""
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
    filename = doc.get('filename', '')
    file_type = doc.get('file_type', '')
    
    # Extract text using OCR
    content_text, ocr_used = extract_text_with_ocr(file_content, filename, file_type)
    
    if not content_text.strip():
        return {
            "document_id": document_id,
            "filename": filename,
            "success": False,
            "ocr_used": ocr_used,
            "message": "No text could be extracted from this document",
            "content_length": 0
        }
    
    # Update document with extracted text
    await db.documents.update_one(
        {"document_id": document_id},
        {"$set": {
            "content_text": content_text,
            "ocr_extracted": ocr_used,
            "text_extracted_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {
        "document_id": document_id,
        "filename": filename,
        "success": True,
        "ocr_used": ocr_used,
        "content_length": len(content_text),
        "content_preview": content_text[:500] + "..." if len(content_text) > 500 else content_text
    }

@api_router.post("/cases/{case_id}/ocr-all", response_model=dict)
async def ocr_all_documents(case_id: str, request: Request):
    """Run OCR on all documents in a case that don't have extracted text"""
    user = await get_current_user(request)
    
    # Verify case ownership
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get documents without text or with minimal text
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(500)
    
    results = []
    successful_ocr = 0
    
    for doc in documents:
        existing_text = doc.get('content_text', '')
        
        # Skip if already has substantial text
        if len(existing_text.strip()) > 100:
            results.append({
                "document_id": doc['document_id'],
                "filename": doc.get('filename'),
                "status": "skipped",
                "reason": "Already has extracted text"
            })
            continue
        
        if not doc.get('file_data'):
            results.append({
                "document_id": doc['document_id'],
                "filename": doc.get('filename'),
                "status": "skipped",
                "reason": "No file data"
            })
            continue
        
        # Try OCR extraction
        file_content = base64.b64decode(doc['file_data'])
        content_text, ocr_used = extract_text_with_ocr(
            file_content, 
            doc.get('filename', ''), 
            doc.get('file_type', '')
        )
        
        if content_text.strip():
            await db.documents.update_one(
                {"document_id": doc['document_id']},
                {"$set": {
                    "content_text": content_text,
                    "ocr_extracted": ocr_used,
                    "text_extracted_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            successful_ocr += 1
            results.append({
                "document_id": doc['document_id'],
                "filename": doc.get('filename'),
                "status": "success",
                "ocr_used": ocr_used,
                "content_length": len(content_text)
            })
        else:
            results.append({
                "document_id": doc['document_id'],
                "filename": doc.get('filename'),
                "status": "failed",
                "reason": "No text could be extracted"
            })
    
    return {
        "total_documents": len(documents),
        "successful_extractions": successful_ocr,
        "results": results
    }

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
    
    # Get ALL documents with FULL content for cross-referencing
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0, "file_data": 0}
    ).to_list(500)
    
    # Get timeline
    timeline = await db.timeline_events.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort("event_date", 1).to_list(500)
    
    # Build comprehensive context with FULL document content
    context = f"""
=== CASE INFORMATION ===
Title: {case.get('title', 'Unknown')}
Defendant: {case.get('defendant_name', 'Unknown')}
Case Number: {case.get('case_number', 'N/A')}
Court: {case.get('court', 'N/A')}

=== GROUND OF MERIT TO INVESTIGATE ===
Title: {ground.get('title')}
Type: {ground.get('ground_type')}
Description: {ground.get('description')}
Current Strength: {ground.get('strength')}
Supporting Evidence Listed: {', '.join(ground.get('supporting_evidence', []))}

"""
    
    # Include FULL document content
    if documents:
        context += f"=== CASE DOCUMENTS ({len(documents)} files) - SEARCH THESE FOR EVIDENCE ===\n"
        for doc in documents:
            context += f"\n--- DOCUMENT: {doc.get('filename')} [{doc.get('category')}] ---\n"
            content = doc.get('content_text', '')
            if content:
                context += f"FULL CONTENT:\n{content[:5000]}\n"
                if len(content) > 5000:
                    context += f"[... {len(content) - 5000} more characters ...]\n"
            else:
                context += "[No text content]\n"
    
    if timeline:
        context += f"\n=== TIMELINE ({len(timeline)} events) ===\n"
        for event in timeline:
            context += f"- {event.get('event_date')}: {event.get('title')} - {event.get('description', '')[:200]}\n"

    system_prompt = """You are an Australian criminal appeal barrister expert in NSW and Federal murder law.
IMPORTANT: You must search through ALL the document content provided and cite specific evidence.
Quote directly from documents to support your analysis."""

    user_prompt = f"""Conduct a THOROUGH investigation of this ground of merit.

{context}

REQUIRED ANALYSIS (search the documents above for evidence):

1. VIABILITY ASSESSMENT
   - Rate: Strong/Moderate/Weak with detailed justification
   - Quote specific evidence FROM THE DOCUMENTS above

2. DOCUMENT EVIDENCE
   - For EACH document, explain what it contains relevant to this ground
   - Quote specific passages that support or undermine this ground

3. RELEVANT LAW SECTIONS (be specific)
   - s.18 Crimes Act 1900 (NSW) - Murder
   - s.23 Crimes Act 1900 (NSW) - Provocation
   - s.6 Criminal Appeal Act 1912 (NSW) - Grounds for appeal
   - Other relevant sections with explanations

4. SIMILAR CASES
   - Name 2-3 Australian cases with citations
   - Explain relevance to this ground

5. EVIDENCE GAPS
   - What additional evidence would strengthen this ground?

6. STRATEGIC RECOMMENDATION
   - How to present this ground to the court"""

    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    # Try up to 4 times with exponential backoff
    response = None
    last_error = None
    for attempt in range(4):
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"ground_{ground_id}_{uuid.uuid4().hex[:8]}",
                system_message=system_prompt
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(text=user_prompt))
            break
        except Exception as e:
            last_error = e
            logger.warning(f"Ground investigation attempt {attempt + 1} failed: {e}")
            if attempt < 3:
                import asyncio
                await asyncio.sleep(3 * (2 ** attempt))
    
    if response is None:
        logger.error(f"All ground investigation attempts failed: {last_error}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed after retries: {str(last_error)}")
    
    # Parse response to extract structured data
    law_sections = []
    similar_cases = []
    
    # Extract law sections
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
        "similar_cases_found": len(similar_cases),
        "documents_analyzed": len(documents)
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
    
    # Try up to 4 times with exponential backoff
    response = None
    last_error = None
    for attempt in range(4):
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"auto_identify_{case_id}_{uuid.uuid4().hex[:8]}",
                system_message=system_prompt
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(text=user_prompt))
            break
        except Exception as e:
            last_error = e
            logger.warning(f"Auto-identify attempt {attempt + 1} failed: {e}")
            if attempt < 3:
                import asyncio
                # Exponential backoff: 3, 6, 12 seconds
                await asyncio.sleep(3 * (2 ** attempt))
    
    if response is None:
        logger.error(f"All auto-identify attempts failed: {last_error}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed after retries: {str(last_error)}")
    
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
    
    # Get documents with full content
    documents = await db.documents.find(
        {"case_id": case_id},
        {"_id": 0, "file_data": 0}
    ).to_list(500)
    
    # Get timeline
    timeline = await db.timeline_events.find(
        {"case_id": case_id},
        {"_id": 0}
    ).sort("event_date", 1).to_list(500)
    
    # Get notes
    notes = await db.notes.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(100)
    
    # Get identified grounds
    grounds = await db.grounds_of_merit.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(100)
    
    # Prepare comprehensive context for AI with FULL document content
    case_context = f"""
=== CASE INFORMATION ===
Title: {case.get('title', 'N/A')}
Defendant: {case.get('defendant_name', 'N/A')}
Case Number: {case.get('case_number', 'N/A')}
Court: {case.get('court', 'N/A')}
Judge: {case.get('judge', 'N/A')}
Summary: {case.get('summary', 'N/A')}

"""
    
    # Include FULL document content for cross-referencing
    if documents:
        case_context += f"=== CASE DOCUMENTS ({len(documents)} files) ===\n"
        for doc in documents:
            case_context += f"\n--- DOCUMENT: {doc.get('filename')} [{doc.get('category', 'other')}] ---\n"
            if doc.get('description'):
                case_context += f"Description: {doc.get('description')}\n"
            content = doc.get('content_text', '')
            if content:
                # Limit content per document based on report type to avoid timeouts
                max_chars = 2000 if report_type == "quick_summary" else 3000
                case_context += f"CONTENT:\n{content[:max_chars]}\n"
                if len(content) > max_chars:
                    case_context += f"[... {len(content) - max_chars} more characters ...]\n"
            else:
                case_context += "CONTENT: [No text extracted]\n"
    else:
        case_context += "=== NO DOCUMENTS UPLOADED ===\n"

    if timeline:
        case_context += f"\n=== TIMELINE OF EVENTS ({len(timeline)} events) ===\n"
        for event in timeline:
            case_context += f"- {event.get('event_date', 'Unknown')}: [{event.get('event_type')}] {event.get('title')}\n"
            if event.get('description'):
                case_context += f"  Details: {event.get('description')}\n"

    if notes:
        case_context += f"\n=== LEGAL NOTES ({len(notes)} notes) ===\n"
        for note in notes:
            case_context += f"- [{note.get('category')}] {note.get('title')}: {note.get('content', '')[:500]}\n"

    if grounds:
        case_context += f"\n=== IDENTIFIED GROUNDS OF MERIT ({len(grounds)} grounds) ===\n"
        for g in grounds:
            case_context += f"- [{g.get('ground_type')}] {g.get('title')} (Strength: {g.get('strength')})\n"
            case_context += f"  {g.get('description', '')[:300]}\n"

    # Define prompts based on report type
    if report_type == "quick_summary":
        system_prompt = """You are an expert criminal appeal legal analyst specializing in NSW State and Australian Federal murder law. 
Provide a concise summary of the case highlighting key points for an appeal. Reference specific documents and evidence."""
        user_prompt = f"""Analyze this criminal appeal case and provide a QUICK SUMMARY (2-3 paragraphs) including:
1. Brief case overview
2. Key evidence points (cite specific documents)
3. Primary grounds for appeal consideration

IMPORTANT: Cross-reference the actual document content provided below.

{case_context}"""

    elif report_type == "full_detailed":
        system_prompt = """You are an expert criminal appeal legal analyst for NSW and Australian Federal murder law. Cite specific documents and law sections."""
        user_prompt = f"""Provide a FULL DETAILED REPORT on this appeal case.

{case_context}

Include:
1. CASE OVERVIEW - cite specific documents
2. GROUNDS OF MERIT - with evidence quotes and law sections (NSW Crimes Act, Criminal Appeal Act, Criminal Code Act)
3. LEGAL FRAMEWORK - relevant law sections
4. RECOMMENDATIONS

Format as a legal brief for a barrister."""

    else:  # extensive_log
        system_prompt = """You are an expert criminal appeal legal analyst. Provide thorough documentation with document citations."""
        user_prompt = f"""Create an EXTENSIVE LOG REPORT for this case.

{case_context}

Include:
1. CASE CHRONOLOGY - with document citations
2. EVIDENCE ANALYSIS - quote key passages
3. ALL GROUNDS OF MERIT - with supporting evidence
4. LEGAL FRAMEWORK - with section numbers
5. DETAILED RECOMMENDATIONS"""

    # Call OpenAI via Emergent
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    # Try up to 4 times with exponential backoff
    response = None
    last_error = None
    for attempt in range(4):
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"report_{case_id}_{uuid.uuid4().hex[:8]}",
                system_message=system_prompt
            ).with_model("openai", "gpt-5.2")
            
            response = await chat.send_message(UserMessage(text=user_prompt))
            break
        except Exception as e:
            last_error = e
            logger.warning(f"Report generation attempt {attempt + 1} failed: {e}")
            if attempt < 3:
                import asyncio
                # Exponential backoff: 3, 6, 12 seconds
                await asyncio.sleep(3 * (2 ** attempt))
    
    if response is None:
        logger.error(f"All report generation attempts failed: {last_error}")
        raise HTTPException(status_code=500, detail=f"AI report generation failed after retries: {str(last_error)}")
    
    # Parse response to extract grounds of merit
    grounds_of_merit = []
    if "GROUNDS OF MERIT" in response or "Ground" in response:
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
async def generate_report(case_id: str, report_request: ReportRequest, request: Request):
    """Generate an AI-powered report for a case"""
    user = await get_current_user(request)
    report_type = report_request.report_type
    
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

# ============ PDF EXPORT ============

@api_router.get("/cases/{case_id}/reports/{report_id}/export-pdf")
async def export_report_pdf(case_id: str, report_id: str, request: Request):
    """Export a report as PDF with Grounds of Merit and Legal References"""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
    from io import BytesIO
    
    user = await get_current_user(request)
    
    # Get report
    report = await db.reports.find_one(
        {"report_id": report_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Get case data
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get grounds of merit for this case
    grounds = await db.grounds_of_merit.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(100)
    
    # Create PDF buffer
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )
    
    # Styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='ReportTitle',
        fontSize=24,
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    styles.add(ParagraphStyle(
        name='ReportSubtitle',
        fontSize=14,
        spaceAfter=12,
        alignment=TA_CENTER,
        textColor=colors.grey
    ))
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontSize=14,
        spaceBefore=20,
        spaceAfter=10,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#1e293b')
    ))
    styles.add(ParagraphStyle(
        name='ReportBodyText',
        fontSize=10,
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        leading=14
    ))
    styles.add(ParagraphStyle(
        name='LawSection',
        fontSize=9,
        spaceAfter=4,
        leftIndent=20,
        textColor=colors.HexColor('#1e40af')
    ))
    styles.add(ParagraphStyle(
        name='GroundTitle',
        fontSize=11,
        spaceBefore=10,
        spaceAfter=4,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#92400e')
    ))
    
    story = []
    
    # Header
    story.append(Paragraph("Justitia AI", styles['ReportSubtitle']))
    story.append(Paragraph("Criminal Appeal Case Management", styles['ReportSubtitle']))
    story.append(Spacer(1, 10*mm))
    
    # Report Title
    report_type_labels = {
        'quick_summary': 'Quick Case Summary',
        'full_detailed': 'Full Detailed Legal Analysis', 
        'extensive_log': 'Extensive Case Log & Analysis'
    }
    story.append(Paragraph(report_type_labels.get(report.get('report_type'), 'Legal Report'), styles['ReportTitle']))
    story.append(Spacer(1, 5*mm))
    
    # Case Info Table
    case_data_table = [
        ['Case Title:', case.get('title', 'N/A')],
        ['Defendant:', case.get('defendant_name', 'N/A')],
        ['Case Number:', case.get('case_number', 'N/A') or 'N/A'],
        ['Court:', case.get('court', 'N/A') or 'N/A'],
        ['Generated:', report.get('generated_at', 'N/A')[:10] if report.get('generated_at') else 'N/A']
    ]
    
    case_table = Table(case_data_table, colWidths=[40*mm, 120*mm])
    case_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#475569')),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(case_table)
    story.append(Spacer(1, 10*mm))
    
    # Grounds of Merit Section
    if grounds:
        story.append(Paragraph("GROUNDS OF MERIT", styles['SectionHeader']))
        story.append(Spacer(1, 5*mm))
        
        ground_type_labels = {
            'procedural_error': 'Procedural Error',
            'fresh_evidence': 'Fresh Evidence',
            'miscarriage_of_justice': 'Miscarriage of Justice',
            'sentencing_error': 'Sentencing Error',
            'judicial_error': 'Judicial Error',
            'ineffective_counsel': 'Ineffective Counsel',
            'prosecution_misconduct': 'Prosecution Misconduct',
            'jury_irregularity': 'Jury Irregularity',
            'constitutional_violation': 'Constitutional Violation',
            'other': 'Other'
        }
        
        for idx, ground in enumerate(grounds, 1):
            ground_type = ground_type_labels.get(ground.get('ground_type'), 'Other')
            strength = ground.get('strength', 'moderate').capitalize()
            
            # Ground header
            story.append(Paragraph(
                f"{idx}. {ground.get('title', 'Unnamed Ground')} [{ground_type}] - Strength: {strength}",
                styles['GroundTitle']
            ))
            
            # Description
            if ground.get('description'):
                story.append(Paragraph(ground.get('description'), styles['ReportBodyText']))
            
            # Legal References (Law Sections)
            if ground.get('law_sections'):
                story.append(Paragraph("<b>Relevant Law Sections:</b>", styles['ReportBodyText']))
                for section in ground.get('law_sections', []):
                    section_text = f"• s.{section.get('section', '')} {section.get('act', '')} ({section.get('jurisdiction', 'NSW')})"
                    story.append(Paragraph(section_text, styles['LawSection']))
            
            # Similar Cases
            if ground.get('similar_cases'):
                story.append(Paragraph("<b>Similar Cases:</b>", styles['ReportBodyText']))
                for case_ref in ground.get('similar_cases', []):
                    case_text = f"• {case_ref.get('case_name', '')} {case_ref.get('citation', '')}"
                    story.append(Paragraph(case_text, styles['LawSection']))
            
            # Supporting Evidence
            if ground.get('supporting_evidence'):
                story.append(Paragraph("<b>Supporting Evidence:</b>", styles['ReportBodyText']))
                for evidence in ground.get('supporting_evidence', []):
                    story.append(Paragraph(f"• {evidence}", styles['LawSection']))
            
            story.append(Spacer(1, 5*mm))
    
    # Legal Framework Reference
    story.append(Paragraph("LEGAL FRAMEWORK REFERENCE", styles['SectionHeader']))
    legal_refs = [
        "• Crimes Act 1900 (NSW) - Primary criminal law for NSW",
        "• Criminal Appeal Act 1912 (NSW) - Governs appeals in NSW",
        "• Criminal Code Act 1995 (Cth) - Federal criminal law",
        "• Evidence Act 1995 (NSW & Cth) - Evidence admissibility",
        "• Sentencing Act 1995 (NSW) - Sentencing guidelines"
    ]
    for ref in legal_refs:
        story.append(Paragraph(ref, styles['LawSection']))
    
    story.append(Spacer(1, 10*mm))
    
    # Main Analysis Content
    story.append(Paragraph("DETAILED ANALYSIS", styles['SectionHeader']))
    
    analysis_text = report.get('content', {}).get('analysis', 'No analysis available.')
    
    # Split analysis into paragraphs for better formatting
    paragraphs = analysis_text.split('\n\n')
    for para in paragraphs:
        if para.strip():
            # Clean up markdown-style formatting
            clean_para = para.replace('**', '').replace('##', '').strip()
            if clean_para:
                story.append(Paragraph(clean_para, styles['ReportBodyText']))
                story.append(Spacer(1, 3*mm))
    
    # Footer disclaimer
    story.append(Spacer(1, 15*mm))
    story.append(Paragraph(
        "This report was generated by Justitia AI and should be reviewed by qualified legal counsel before being relied upon in legal proceedings.",
        ParagraphStyle(
            name='Disclaimer',
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
    ))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    # Create filename
    safe_title = "".join(c for c in case.get('title', 'Report')[:30] if c.isalnum() or c in ' -_').strip()
    filename = f"{safe_title}_{report.get('report_type', 'report')}.pdf"
    
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@api_router.get("/cases/{case_id}/reports/{report_id}/export-docx")
async def export_report_docx(case_id: str, report_id: str, request: Request):
    """Export a report as DOCX (Microsoft Word) with Grounds of Merit and Legal References"""
    from docx import Document as DocxDocument
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.style import WD_STYLE_TYPE
    from io import BytesIO
    
    user = await get_current_user(request)
    
    # Get report
    report = await db.reports.find_one(
        {"report_id": report_id, "case_id": case_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Get case data
    case = await db.cases.find_one({"case_id": case_id, "user_id": user.user_id}, {"_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get grounds of merit
    grounds = await db.grounds_of_merit.find(
        {"case_id": case_id},
        {"_id": 0}
    ).to_list(100)
    
    # Create DOCX document
    doc = DocxDocument()
    
    # Set up styles
    styles = doc.styles
    
    # Title style
    title_style = styles['Title']
    title_style.font.size = Pt(24)
    title_style.font.bold = True
    title_style.font.color.rgb = RGBColor(30, 41, 59)
    
    # Heading 1 style
    h1_style = styles['Heading 1']
    h1_style.font.size = Pt(16)
    h1_style.font.bold = True
    h1_style.font.color.rgb = RGBColor(30, 41, 59)
    
    # Heading 2 style
    h2_style = styles['Heading 2']
    h2_style.font.size = Pt(14)
    h2_style.font.bold = True
    h2_style.font.color.rgb = RGBColor(146, 64, 14)
    
    # Header
    header_para = doc.add_paragraph()
    header_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    header_run = header_para.add_run("JUSTITIA AI")
    header_run.font.size = Pt(12)
    header_run.font.color.rgb = RGBColor(100, 116, 139)
    
    sub_header = doc.add_paragraph()
    sub_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub_header.add_run("Criminal Appeal Case Management")
    sub_run.font.size = Pt(10)
    sub_run.font.color.rgb = RGBColor(100, 116, 139)
    
    doc.add_paragraph()
    
    # Report Title
    report_type_labels = {
        'quick_summary': 'Quick Case Summary',
        'full_detailed': 'Full Detailed Legal Analysis', 
        'extensive_log': 'Extensive Case Log & Analysis'
    }
    title = doc.add_heading(report_type_labels.get(report.get('report_type'), 'Legal Report'), 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    doc.add_paragraph()
    
    # Case Information Table
    case_table = doc.add_table(rows=5, cols=2)
    case_table.style = 'Table Grid'
    
    case_info = [
        ('Case Title:', case.get('title', 'N/A')),
        ('Defendant:', case.get('defendant_name', 'N/A')),
        ('Case Number:', case.get('case_number', 'N/A') or 'N/A'),
        ('Court:', case.get('court', 'N/A') or 'N/A'),
        ('Generated:', report.get('generated_at', 'N/A')[:10] if report.get('generated_at') else 'N/A')
    ]
    
    for i, (label, value) in enumerate(case_info):
        row = case_table.rows[i]
        row.cells[0].text = label
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[1].text = str(value)
    
    doc.add_paragraph()
    
    # Grounds of Merit Section
    if grounds:
        doc.add_heading('GROUNDS OF MERIT', level=1)
        
        ground_type_labels = {
            'procedural_error': 'Procedural Error',
            'fresh_evidence': 'Fresh Evidence',
            'miscarriage_of_justice': 'Miscarriage of Justice',
            'sentencing_error': 'Sentencing Error',
            'judicial_error': 'Judicial Error',
            'ineffective_counsel': 'Ineffective Counsel',
            'prosecution_misconduct': 'Prosecution Misconduct',
            'jury_irregularity': 'Jury Irregularity',
            'constitutional_violation': 'Constitutional Violation',
            'other': 'Other'
        }
        
        for idx, ground in enumerate(grounds, 1):
            ground_type = ground_type_labels.get(ground.get('ground_type'), 'Other')
            strength = ground.get('strength', 'moderate').capitalize()
            
            # Ground heading
            doc.add_heading(
                f"{idx}. {ground.get('title', 'Unnamed Ground')} [{ground_type}] - Strength: {strength}",
                level=2
            )
            
            # Description
            if ground.get('description'):
                doc.add_paragraph(ground.get('description'))
            
            # Legal References
            if ground.get('law_sections'):
                law_para = doc.add_paragraph()
                law_run = law_para.add_run('Relevant Law Sections:')
                law_run.font.bold = True
                law_run.font.color.rgb = RGBColor(30, 64, 175)
                
                for section in ground.get('law_sections', []):
                    section_text = f"s.{section.get('section', '')} {section.get('act', '')} ({section.get('jurisdiction', 'NSW')})"
                    bullet = doc.add_paragraph(section_text, style='List Bullet')
                    for run in bullet.runs:
                        run.font.color.rgb = RGBColor(30, 64, 175)
            
            # Similar Cases
            if ground.get('similar_cases'):
                cases_para = doc.add_paragraph()
                cases_run = cases_para.add_run('Similar Cases:')
                cases_run.font.bold = True
                cases_run.font.color.rgb = RGBColor(146, 64, 14)
                
                for case_ref in ground.get('similar_cases', []):
                    case_text = f"{case_ref.get('case_name', '')} {case_ref.get('citation', '')}"
                    doc.add_paragraph(case_text, style='List Bullet')
            
            # Supporting Evidence
            if ground.get('supporting_evidence'):
                evidence_para = doc.add_paragraph()
                evidence_run = evidence_para.add_run('Supporting Evidence:')
                evidence_run.font.bold = True
                evidence_run.font.color.rgb = RGBColor(5, 150, 105)
                
                for evidence in ground.get('supporting_evidence', []):
                    doc.add_paragraph(evidence, style='List Bullet')
            
            doc.add_paragraph()
    
    # Legal Framework Reference
    doc.add_heading('LEGAL FRAMEWORK REFERENCE', level=1)
    
    legal_refs = [
        "Crimes Act 1900 (NSW) - Primary criminal law for New South Wales",
        "Criminal Appeal Act 1912 (NSW) - Governs criminal appeals in NSW",
        "Criminal Code Act 1995 (Cth) - Federal criminal law",
        "Evidence Act 1995 (NSW & Cth) - Rules on evidence admissibility",
        "Sentencing Act 1995 (NSW) - Sentencing guidelines and procedures"
    ]
    
    for ref in legal_refs:
        doc.add_paragraph(ref, style='List Bullet')
    
    doc.add_paragraph()
    
    # Detailed Analysis
    doc.add_heading('DETAILED ANALYSIS', level=1)
    
    analysis_text = report.get('content', {}).get('analysis', 'No analysis available.')
    
    # Split analysis into paragraphs
    paragraphs = analysis_text.split('\n\n')
    for para in paragraphs:
        if para.strip():
            clean_para = para.replace('**', '').replace('##', '').strip()
            if clean_para:
                doc.add_paragraph(clean_para)
    
    # Footer disclaimer
    doc.add_paragraph()
    disclaimer = doc.add_paragraph()
    disclaimer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    disclaimer_run = disclaimer.add_run(
        "This report was generated by Justitia AI and should be reviewed by qualified legal counsel before being relied upon in legal proceedings."
    )
    disclaimer_run.font.size = Pt(9)
    disclaimer_run.font.italic = True
    disclaimer_run.font.color.rgb = RGBColor(100, 116, 139)
    
    # Save to buffer
    buffer = BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    
    # Create filename
    safe_title = "".join(c for c in case.get('title', 'Report')[:30] if c.isalnum() or c in ' -_').strip()
    filename = f"{safe_title}_{report.get('report_type', 'report')}.docx"
    
    return Response(
        content=buffer.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

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
