# Criminal Appeal AI - Case Management

## Original Problem Statement
Create an app to sort, store and organise documents, briefs, case notes, and public case information for criminal appeals. Features include timeline generation, AI-powered grounds of merit identification, cross-referencing with source material, multiple report types, notes/comments, barrister presentation view, and PDF/DOCX export.

## Owner
**Deb King, Glenmore Park 2745**
*One woman's fight for justice — seeking truth for Joshua Homann, failed by the system*

## User Choices
- AI Provider: OpenAI GPT-4o with Emergent LLM key
- Authentication: Google Social Login (Emergent Auth)
- Multi-case support: Yes
- Document formats: PDF, DOCX, TXT, Images (with OCR)
- Export: PDF and DOCX with Grounds of Merit and Legal References
- Payment: PayPal integration for premium features

## Pricing Model (PayPal)
| Feature | Price (AUD) |
|---------|-------------|
| Document Upload | FREE |
| Grounds of Merit (count only) | FREE |
| **Unlock Grounds of Merit Details** | **$50.00** |
| Quick Summary Report | FREE |
| **Full Detailed Report** | **$29.99** |
| **Extensive Log Report** | **$50.00** |

## Architecture
- **Backend**: FastAPI with MongoDB
- **Frontend**: React with Tailwind CSS + Shadcn UI
- **AI**: OpenAI GPT-4o via Emergent Integrations
- **Auth**: Emergent Google OAuth
- **PDF Generation**: ReportLab library
- **DOCX Generation**: python-docx library
- **OCR**: Tesseract OCR + pdf2image

## Features Implemented

### Core Features ✅
- [x] Google OAuth authentication
- [x] Multi-case dashboard with search
- [x] Case CRUD operations
- [x] Multi-file document upload
- [x] Document text extraction (PDF, DOCX, TXT)
- [x] OCR for scanned documents and images
- [x] Document search across case files
- [x] Timeline event management

### Enhanced Timeline System ✅ (Mar 2026)
- [x] **Comprehensive Event Categories** - Pre-trial, Trial, Evidence, Post-conviction, Investigation
- [x] **27 Event Types** - Arrest, Charge, Bail, Committal, Jury Selection, Witness Testimony, etc.
- [x] **Event Details:**
  - Significance levels (Critical, Important, Normal, Minor)
  - Perspective tracking (Prosecution, Defence, Neutral)
  - Source citations
  - Participants with roles
  - Document linking
  - Ground of appeal linking
- [x] **Contested Facts** - Mark disputed events with details
- [x] **Inconsistency Notes** - Track contradictions
- [x] **Timeline Analysis (AI):**
  - Gap detection between events
  - Inconsistency identification  
  - Prosecution vs Defence balance
  - Ground of appeal connections
  - Key observations and recommendations
- [x] **Timeline Filters** - By category, significance, perspective, contested status
- [x] **Timeline Search** - Search across events, participants, sources
- [x] **PDF Export** - Professional formatted timeline document

### AI-Powered Features ✅
- [x] Auto-identify Grounds of Merit from documents **with duplicate prevention**
- [x] Deep investigation of individual grounds
- [x] Law section extraction (NSW & Federal)
- [x] Similar case identification
- [x] Report generation (Quick Summary, Full Detailed, Extensive Log)
- [x] **Auto-generate Timeline from documents** - AI extracts dates and events

### PayPal Paywall System ✅ (Mar 2026)
- [x] **Grounds of Merit Paywall** - Shows count for free, $50 to unlock full details
- [x] **Report Tiers:**
  - Quick Summary: FREE
  - Full Detailed Report: $29.99
  - Extensive Log Report: $50.00
- [x] PayPal payment integration
- [x] Payment tracking per case
- [x] Unlock state persistence
- [x] Payment modal UI component

### Export & Presentation ✅
- [x] PDF export with grounds and legal references
- [x] DOCX/Word export for editing
- [x] Barrister View (A4 professional format)
- [x] Print-ready formatting

### Mobile App Support ✅ (Feb 2026)
- [x] Progressive Web App (PWA) - installable from browser
- [x] App icons for all platforms (72px to 512px)
- [x] iOS "Add to Home Screen" support
- [x] Android install prompt
- [x] Service worker for offline caching
- [x] Capacitor configured for App Store/Play Store submission
- [x] Mobile-responsive design

### Notes & Comments ✅
- [x] Create/edit/delete notes
- [x] 6 note categories
- [x] Pin/unpin important notes

## Key API Endpoints
- `POST /api/auth/session`: OAuth session exchange
- `POST /api/cases`: Create case
- `POST /api/cases/{id}/documents`: Upload documents
- `POST /api/cases/{id}/documents/search`: Search documents
- `POST /api/cases/{id}/documents/{id}/ocr`: OCR single document
- `POST /api/cases/{id}/ocr-all`: OCR all documents
- `POST /api/cases/{id}/grounds/auto-identify`: AI identify grounds
- `POST /api/cases/{id}/grounds/{id}/investigate`: Deep investigation
- `POST /api/cases/{id}/timeline/auto-generate`: AI generate timeline from docs
- `POST /api/cases/{id}/timeline/analyze`: AI timeline analysis (gaps, inconsistencies)
- `GET /api/cases/{id}/timeline/export-pdf`: Export timeline as PDF
- `POST /api/cases/{id}/reports/generate`: Generate report
- `GET /api/cases/{id}/reports/{id}/export-pdf`: Export PDF
- `GET /api/cases/{id}/reports/{id}/export-docx`: Export Word

## Database Schema
- **users**: user_id, email, name, google_id
- **user_sessions**: session_token, user_id, expires_at
- **cases**: case_id, user_id, title, defendant_name, case_number, court, offence_category, offence_type
- **documents**: document_id, case_id, filename, content_text, ocr_extracted
- **timeline_events**: event_id, case_id, title, event_date, event_type, event_category, significance, perspective, is_contested, contested_details, linked_documents, participants, related_grounds, source_citation, inconsistency_notes
- **notes**: note_id, case_id, title, content, category, is_pinned
- **grounds_of_merit**: ground_id, case_id, title, ground_type, status, strength, law_sections, similar_cases, analysis
- **reports**: report_id, case_id, report_type, content, generated_at

## 3rd Party Integrations
- **OpenAI GPT-4o** via Emergent LLM Key
- **Emergent Google OAuth** for authentication
- **ReportLab** for PDF generation
- **python-docx** for Word document generation
- **Tesseract OCR** for image text extraction
- **pdf2image** for scanned PDF processing

## Legal Framework Reference
- Crimes Act 1900 (NSW)
- Criminal Appeal Act 1912 (NSW)
- Criminal Code Act 1995 (Cth)
- Evidence Act 1995 (NSW & Cth)
- Sentencing Act 1995 (NSW)

## Bug Fixes (Feb 2026)
- [x] **Case Loading Error** - Improved error handling with retry functionality
  - Changed from `Promise.all` to `Promise.allSettled` for resilient data loading
  - Added specific error messages for session expired, not found, timeout
  - Added retry button instead of immediate redirect
  - File: `frontend/src/pages/CaseDetail.jsx`

### User Guide & Glossary ✅ (Mar 2026)
- [x] Comprehensive "How to Use" guide with step-by-step instructions
- [x] **Legal Glossary** with 40+ terms covering:
  - Appeal Process (Appeal, Leave to Appeal, Ground of Appeal)
  - Parties (Appellant, Respondent)
  - Types of Grounds (Miscarriage of Justice, Procedural Error, etc.)
  - Evidence Terms (Hearsay, ERISP, Brief of Evidence, Disclosure)
  - Trial Process (Committal, Indictment, Verdict, Summing Up)
  - Legal Standards (Beyond Reasonable Doubt, Onus of Proof)
  - Offences & Defences (Murder, Manslaughter, Self-Defence)
  - App-specific terms (Significance, Perspective, Contested Facts)
- [x] Searchable glossary with category filtering
- [x] Examples for each term

### New Features (Mar 2026) ✅
- [x] **Appeal Deadline Tracker** - Track critical dates with countdown timers
- [x] **Witness Statement Contradiction Finder** - AI compares documents to find inconsistencies
- [x] **Case Strength Meter** - Visual dashboard showing appeal prospects (grounds, docs, timeline, preparation)
- [x] **Appeal Checklist System** - 22-step checklist from Preparation to Hearing
- [x] **Resource Directory** - Legal Aid offices, advocacy groups, courts, information services
- [x] **Document Templates** - Notice of Appeal, Leave to Appeal, Fresh Evidence Affidavit, Extension of Time
- [x] **Progress Tab** - New tab showing Case Strength, Deadlines, and Checklist

## Future Enhancements
- [ ] Case sharing with other users
- [ ] Email notifications
- [ ] Case law database integration
- [ ] Report comparison view
- [ ] Document version history

## Technical Debt (Priority)
- [x] **Backend Refactoring** - Created modular structure (COMPLETE - NO REGRESSIONS)
  - ✅ `/app/backend/models/__init__.py` - All Pydantic models extracted
  - ✅ `/app/backend/config.py` - Database connection and configuration
  - ✅ `/app/backend/auth_utils.py` - Shared authentication utilities
  - ✅ `/app/backend/services/ai_service.py` - AI helper functions
  - ✅ `/app/backend/routers/auth.py` - Auth endpoints
  - ✅ `/app/backend/routers/cases.py` - Case CRUD endpoints
  - ✅ `/app/backend/routers/documents.py` - Document handling
  - ✅ `/app/backend/routers/timeline.py` - Timeline management
  - ✅ `/app/backend/routers/notes.py` - Notes management
  - ✅ `/app/backend/routers/deadlines.py` - Deadlines & Checklist
  - ✅ `/app/backend/routers/resources.py` - Resources & Templates
  - Tested: 17/17 backend tests passed

- [x] **Frontend Refactoring** - Created reusable components (COMPLETE - NO REGRESSIONS)
  - ✅ `/app/frontend/src/components/DocumentSection.jsx` - Document handling (~400 lines)
  - ✅ `/app/frontend/src/components/NotesSection.jsx` - Notes management (~250 lines)
  - ✅ `/app/frontend/src/components/ReportsSection.jsx` - Report generation (~320 lines)
  - Tested: All frontend sections loading correctly

## Bug Fixes (Mar 2026)
- [x] **Report Generation Fixed** - All 3 report types working (Quick Summary, Full Detailed, Extensive Log)
  - Verified with comprehensive backend testing (17/17 tests passed)
  - AI calls use GPT-4o via Emergent LLM Key with retry logic
  - Test reports: `/app/test_reports/iteration_9.json`, `/app/test_reports/iteration_10.json`

### All Criminal Offence Types Support ✅ (Mar 2026)
- [x] **Expanded Beyond Murder/Manslaughter** - Now supports ALL criminal offence categories:
  - Homicide (Murder, Manslaughter, Attempted Murder, Dangerous Driving Causing Death)
  - Assault & Violence (Common Assault, ABH, GBH, Wounding, Affray, Intimidation)
  - Sexual Offences (Sexual Assault, Aggravated Sexual Assault, Sexual Touching, Child Offences)
  - Robbery & Theft (Armed Robbery, Theft, Receiving Stolen Property, Break and Enter)
  - Drug Offences (Possession, Supply, Trafficking, Importation, Manufacturing)
  - Fraud & Dishonesty (Fraud, Forgery, Identity Theft, Money Laundering)
  - Firearms & Weapons (Unauthorised Possession, Prohibited Weapons, Trafficking)
  - Domestic Violence (DV Assault, Stalking, Intimidation, AVO Contravention)
  - Public Order Offences (Riot, Affray, Offensive Conduct, Resist Arrest)
  - Terrorism Offences (Terrorist Acts, Membership, Financing, Foreign Incursion)
  - Driving Offences (Dangerous Driving, Drink/Drug Driving, Driving While Disqualified)

- [x] **Dynamic Legal Framework** - Each offence category includes:
  - NSW legislation with specific section references
  - Commonwealth/Federal legislation where applicable
  - Available defences specific to offence type
  - Key elements that must be proven
  
- [x] **AI Analysis Uses Offence Context** - All AI features now dynamically adjust:
  - Auto-identify grounds uses offence-specific system prompts
  - Deep investigation references correct legislation
  - Report generation tailored to offence type
  
- [x] **UI Enhancements**:
  - Dashboard: Offence category selector when creating new case
  - Dashboard: Dynamic offence type dropdown based on selected category
  - Case Detail: Displays offence category and type badges
  - Landing Page: Shows all supported offence types

- [x] **API Endpoints**:
  - `GET /api/offence-categories` - Returns all 11 categories with offences
  - `GET /api/offence-framework` - Returns complete legal framework
  - `GET /api/offence-framework/{category}` - Returns detailed framework for specific category

- [x] **Testing**: All tests passed (`/app/test_reports/iteration_13.json`)

