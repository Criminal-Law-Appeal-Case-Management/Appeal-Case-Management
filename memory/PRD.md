# Justitia AI - Criminal Appeal Case Management

## Original Problem Statement
Create an app that can sort, store and organise documents, briefs, case notes, public advertising of cases - everything that can be used as information in a criminal appeal. Sort and organise info into a timeline of events updating when new info is added. Need a full report option giving a detailed report on the information, how it can be used, what grounds of merit it supports, and what sections of criminal law NSW State and Australia Federal level in relation to murder only. Also need quick reporting option for summary and extensive log option reporting on entire case. Present info in a suitable manner to a barrister.

## User Choices
- AI Provider: OpenAI GPT-5.2 with Emergent LLM key
- Authentication: Google Social Login (Emergent Auth)
- Multi-case support: Yes
- Document formats: PDF, DOCX, TXT, Images
- Export: PDF with Grounds of Merit and Legal References
- Design: Professional, easy to follow

## Architecture
- **Backend**: FastAPI with MongoDB
- **Frontend**: React with Tailwind CSS + Shadcn UI
- **AI**: OpenAI GPT-5.2 via Emergent Integrations
- **Auth**: Emergent Google OAuth
- **PDF Generation**: ReportLab library

## User Personas
1. **Legal Professionals**: Barristers, solicitors working on criminal appeals
2. **Defendants/Families**: People building their appeal case
3. **Legal Researchers**: Those analyzing case evidence

## Core Requirements
- [x] Document upload and categorization
- [x] **Multi-file upload** - Upload multiple documents at once
- [x] **Document search** - Search for text across all case documents with context highlighting
- [x] **OCR support** - Extract text from scanned PDFs and images using Tesseract OCR
- [x] Timeline event management
- [x] AI-powered legal analysis
- [x] Grounds of merit identification with deep investigation
- [x] Law section references (NSW & Federal)
- [x] Multiple report types (Quick/Full/Extensive)
- [x] **Barrister presentation view** - Prominently displays Grounds of Merit with legal references
- [x] **PDF export capability** - Downloads actual PDF files with grounds and legal references
- [x] Google authentication
- [x] Multi-case dashboard
- [x] Notes & Comments system

## What's Been Implemented (Feb 2026)

### Core Features
- Full authentication flow with Google OAuth
- Case CRUD operations with dashboard overview
- Document upload with text extraction (PDF, DOCX, TXT)
- **Multi-file upload** - Select and upload multiple documents simultaneously
- **Document search** - Search for specific text across all case documents
  - Shows context (100 chars before/after match)
  - Highlights matched text
  - Sorted by match count
  - Displays which documents contain matches
- **OCR support** - Extract text from scanned documents and images
  - Uses Tesseract OCR for text recognition
  - Supports PNG, JPG, TIFF, BMP, GIF, WebP images
  - Handles scanned PDFs (converts to images then OCR)
  - Individual document OCR or batch OCR for all documents
- Timeline builder with event types
- AI report generation (3 types: Quick, Full, Extensive)
- Report viewer with formatted sections
- **PDF Export** - Backend generates proper PDF files using ReportLab with:
  - Case information header
  - Grounds of Merit section
  - Legal References (NSW & Federal law)
  - Full analysis content
- **DOCX Export** - Export reports to Microsoft Word format
  - Styled headings and case info table
  - Grounds of Merit with legal references
  - Editable in Word for customization
- **Barrister presentation view** (A4 format) with:
  - Prominent Grounds of Merit display
  - Law sections for each ground
  - Similar cases references
  - Supporting evidence
  - Professional legal brief formatting
- Professional UI with Crimson Pro & Manrope fonts

### Notes & Comments System
- Create/edit/delete notes
- 6 note categories: General, Legal Opinion, Evidence Note, Strategy, Question, Action Item
- Pin/unpin important notes
- Author tracking and timestamps

### Grounds of Merit Feature
- AI auto-identify potential grounds from case materials
- Manually add grounds with type classification
- 10 ground types: Procedural Error, Fresh Evidence, Miscarriage of Justice, Sentencing Error, Judicial Error, Ineffective Counsel, Prosecution Misconduct, Jury Irregularity, Constitutional Violation, Other
- Deep AI investigation of individual grounds
- Extracts relevant law sections (NSW Crimes Act, Criminal Appeal Act, Federal Criminal Code)
- Identifies similar Australian cases
- Strength assessment (Strong/Moderate/Weak)
- Status tracking (Identified/Investigating/Confirmed/Rejected)

## Prioritized Backlog

### P1 (High Priority) - Future
- [ ] Report comparison view

### P2 (Medium Priority) - Future
- [ ] Case sharing with other users
- [ ] Email notifications
- [ ] Document version history
- [ ] Integrate with case law database for verified citations

## Key Technical Details

### Database Schema
- **users**: user_id, email, name, google_id
- **cases**: case_id, user_id, name, description, status
- **documents**: document_id, case_id, filename, file_type, content_text
- **timeline_events**: event_id, case_id, title, event_date
- **notes**: note_id, case_id, user_id, title, content, is_pinned
- **grounds_of_merit**: ground_id, case_id, title, ground_type, status, strength, law_sections, similar_cases
- **reports**: report_id, case_id, report_type, title, content

### Key API Endpoints
- `POST /api/auth/session`: Exchange OAuth session for token
- `POST /api/cases`: Create new case
- `POST /api/cases/{id}/documents`: Upload document(s)
- `POST /api/cases/{id}/documents/search`: Search text across documents
- `POST /api/cases/{id}/documents/{docId}/ocr`: OCR single document
- `POST /api/cases/{id}/ocr-all`: OCR all documents without text
- `POST /api/cases/{id}/grounds/auto-identify`: AI identifies grounds
- `POST /api/cases/{id}/grounds/{id}/investigate`: Deep AI analysis
- `POST /api/cases/{id}/reports/generate`: Generate AI report
- `GET /api/cases/{id}/reports/{id}/export-pdf`: Download PDF

### 3rd Party Integrations
- **OpenAI GPT-5.2** via Emergent LLM Key - for AI analysis
- **Emergent Google OAuth** - for authentication
- **ReportLab** - for PDF generation
- **Tesseract OCR** - for text extraction from images/scanned docs
- **pdf2image** - for converting PDF pages to images for OCR

## Next Tasks
1. Add DOCX export option
2. Create report comparison feature
