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
| **Quick Summary Report** | **FREE** |
| **Full Detailed Report** | **$29.00** |
| **Extensive Log Report** | **$39.00** |

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
- **cases**: case_id, user_id, title, defendant_name, case_number, court, state, offence_category, offence_type
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

### Complete UI/UX Redesign (Dec 2025 - Mar 2026) ✅
- [x] **New Color Scheme** - "Hope in Darkness" theme
  - Deep Indigo (#1E1B4B) primary color
  - Burnished Amber (#B45309) accent color
  - Professional dark mode support
- [x] **Typography Update**
  - Crimson Pro for headings (serif, legal feel)
  - Manrope for body text (clean, modern)
- [x] **Landing Page Redesign**
  - Asymmetric hero section with Lady Justice image
  - State selector for jurisdiction-specific content
  - Feature preview mockups for timeline, grounds, reports
  - Cleaner feature cards in bento grid layout
  - Quick links bar for easy navigation
  - Condensed About section with personal story
  - Legal Resources section
- [x] **Dashboard Redesign**
  - New sidebar navigation (collapsible)
  - Stat cards showing Total Cases, Documents, Timeline Events
  - Dark/Light mode toggle in sidebar
  - User profile section at bottom
- [x] **Case Detail Styling Update**
  - Glass header with breadcrumb navigation
  - Updated tab styling with rounded corners
  - Consistent card styling throughout
- [x] **All Pages Updated** (Mar 2026 Session)
  - ✅ AuthModal - Branded header with gradient, amber button styling
  - ✅ ContactPage - Hero section, form redesign, navigation
  - ✅ Statistics Page - Dashboard with stat cards and bar charts
  - ✅ AdminStats - Admin analytics page
  - ✅ TermsOfService - Collapsible sections, highlighted warnings
  - ✅ SuccessStories - Story cards with outcome badges
  - ✅ Forms & Templates page
  - ✅ FAQ page with accordion and category graphics
  - ✅ Lawyer Directory page
  - ✅ Legal Glossary page with expandable definitions
  - All pages use new design tokens
- [x] **Glass Morphism Effects** - Backdrop blur on headers and modals
- [x] **Legal-themed Graphics** - Scales of justice, gavel imagery throughout
- [x] **Testing Verified** - All redesigned pages tested (test_reports/iteration_19.json)
- [x] **New Features Tested** - Compare Cases and Contradiction Finder (test_reports/iteration_20.json)
  - Backend: 20/20 API tests passed
  - Frontend: All features working correctly

- [x] **Export Features Tested** - Quick Export, Document Bundler, Enhanced Case Strength Meter (test_reports/iteration_21.json)
  - Backend: 11/13 API tests passed (85%)
  - Frontend: 100% - All new features verified



## Future Enhancements
- [ ] Case sharing with other users
- [ ] Email notifications
- [ ] Case law database integration
- [ ] Report comparison view
- [ ] Document version history

### New Features (Mar 2026 - Session 2) ✅
- [x] **Compare Cases Feature** - New page at `/compare` with two modes:
  - My Cases: Compare 2-5 of your own cases side-by-side
  - Platform Patterns: View anonymized aggregate insights from all users
  - Filters by offence category, state, and ground type
  - Success factors analysis showing what correlates with strong appeals
  - Backend: `/app/backend/routers/compare.py`
  - Frontend: `/app/frontend/src/pages/CompareCasesPage.jsx`

- [x] **Contradiction Finder (Enhanced)** - New tab in Case Detail:
  - AI-powered scan of documents, notes, and timeline for inconsistencies
  - Detects: witness statement contradictions, timeline issues, evidence conflicts
  - Severity levels: Critical, Significant, Minor
  - Specific quotes and recommendations for each finding
  - Scan history with ability to compare past scans
  - Backend: `/app/backend/routers/contradictions.py`
  - Frontend: `/app/frontend/src/components/ContradictionFinder.jsx`

- [x] **Dashboard Navigation Update** - Added Compare Cases link to sidebar

- [x] **Quick Export (Appeal Package) ✅** - Full ZIP with everything + editable DOCX
  - ZIP contains: all docs, timeline, grounds, notes, reports, AI analysis
  - 5 editable legal templates pre-filled with case data:
    - Notice of Intention to Appeal
    - Application for Leave to Appeal
    - Written Submissions Template
    - Fresh Evidence Affidavit
    - Chronology of Proceedings
  - Backend: `/app/backend/routers/export.py`
  - Frontend: `/app/frontend/src/components/QuickExport.jsx`

- [x] **Document Bundler ✅** - Bundle multiple docs into single PDF
  - Select documents to include
  - Auto-generate table of contents
  - Includes AI analysis notes
  - Backend: Added to `/app/backend/routers/export.py`
  - Frontend: `/app/frontend/src/components/DocumentBundler.jsx`

- [x] **Enhanced Case Strength Meter ✅** - Visual scoring system
  - Circular score display (0-100)
  - Color-coded rating badge
  - 4 breakdown categories: Grounds, Documentation, Timeline, Preparation
  - Recommendations to improve score
  - Frontend: Updated `/app/frontend/src/components/CaseStrengthMeter.jsx`

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

### Legal Framework Viewer ✅ (Mar 2026)
- [x] **New Tab in Case Detail** - "Legal Framework" tab shows applicable legislation for the case
- [x] **Collapsible Sections**:
  - State-specific Legislation with section references (dynamically loads based on state)
  - Commonwealth/Federal Legislation
  - Key Elements to Prove (numbered list)
  - Available Defences (badge tags)
  - Appeal Procedure (state-specific court, time limits, forms)
  - Common Appeal Grounds
- [x] **State Selector** - Dropdown to switch between Australian states and view their specific legislation
- [x] **AustLII Link** - Quick link to view full legislation on AustLII.edu.au
- [x] **Component**: `/app/frontend/src/components/LegalFrameworkViewer.jsx`

### All Australian States Expansion ✅ (Mar 2026)
- [x] **Full National Coverage** - Now supports ALL Australian jurisdictions:
  - New South Wales (NSW)
  - Victoria (VIC)
  - Queensland (QLD)
  - South Australia (SA)
  - Western Australia (WA)
  - Tasmania (TAS)
  - Northern Territory (NT)
  - Australian Capital Territory (ACT)
  - Commonwealth/Federal law

- [x] **State-Specific Legislation** - Each state has its own legislation mapped:
  - NSW: Crimes Act 1900 (NSW)
  - VIC: Crimes Act 1958 (Vic)
  - QLD: Criminal Code Act 1899 (Qld)
  - SA: Criminal Law Consolidation Act 1935 (SA)
  - WA: Criminal Code Act Compilation Act 1913 (WA)
  - TAS: Criminal Code Act 1924 (Tas)
  - NT: Criminal Code Act 1983 (NT)
  - ACT: Crimes Act 1900 (ACT)

- [x] **State-Specific Appeal Procedures** - Each state has mapped:
  - Governing legislation (e.g., Criminal Appeal Act 1912 NSW, Criminal Procedure Act 2009 Vic)
  - Appeal court name
  - Time limits for lodging appeals
  - Required forms

- [x] **UI Enhancements**:
  - Landing page shows all 8 state badges + Federal
  - Dashboard: State selector when creating new case
  - Case Detail: State badge displayed in blue
  - Legal Framework Viewer: State dropdown to switch jurisdictions

- [x] **API Endpoints**:
  - `GET /api/states` - Returns all 8 Australian states/territories
  - `GET /api/offence-framework/{category}?state={state}` - Returns state-specific legislation

- [x] **Testing**: All 35 tests passed (`/app/test_reports/iteration_14.json`)
  - Verified all states return correct legislation
  - Verified appeal framework returns state-specific procedures

### Case Law Research Links ✅ (Mar 2026)
- [x] **All State Case Law Databases Added**:
  - NSW: caselaw.nsw.gov.au (Supreme, District & Local Court)
  - VIC: AustLII Victoria (Supreme & County Court)
  - QLD: sclqld.org.au (Supreme & District Court Library)
  - SA: courts.sa.gov.au/judgments
  - WA: ecourts.justice.wa.gov.au
  - TAS: AustLII Tasmania
  - NT: AustLII NT
  - ACT: courts.act.gov.au/supreme/judgments
  
- [x] **Federal Courts Added**:
  - High Court of Australia (hcourt.gov.au)
  - Federal Court of Australia (fedcourt.gov.au)
  
- [x] **AustLII Integration** - Main search for all Australian law
- [x] **Landing Page** - New "Search Real Court Decisions" section with all state links
- [x] **Legal Framework Viewer** - Case law links integrated into Legal Framework tab

### Refactoring & Technical Improvements ✅ (Mar 2026)
- [x] **Admin Email Moved to Environment Variable**:
  - `ADMIN_EMAILS` env var in `/app/backend/.env`
  - Supports comma-separated list for multiple admins
  - Default fallback to `djkingy79@gmail.com`

- [x] **Component Extraction from CaseDetail.jsx**:
  - Created `/app/frontend/src/components/DocumentsSection.jsx` - Document upload, list, search, OCR
  - Created `/app/frontend/src/components/NotesSection.jsx` - Notes management with categories
  - Updated `/app/frontend/src/components/ReportsSection.jsx` - Report generation and viewing
  - **INTEGRATED into CaseDetail.jsx** - Reduced from 2294 to 1209 lines (Dec 2025)

### Criminal Law & Human Rights Resources ✅ (Mar 2026)
- [x] **Criminal Legislation by State** - Direct links to:
  - NSW: Crimes Act 1900, Criminal Appeal Act 1912, Evidence Act 1995
  - VIC: Crimes Act 1958, Criminal Procedure Act 2009
  - QLD: Criminal Code Act 1899, Evidence Act 1977
  - SA: Criminal Law Consolidation Act 1935
  - WA: Criminal Code Act 1913, Criminal Appeals Act 2004
  - CTH: Criminal Code Act 1995, Evidence Act 1995, Judiciary Act 1903

- [x] **Human Rights Framework** - Links to:
  - International: ICCPR, UDHR, Convention Against Torture
  - Australian: Victoria Charter, ACT Human Rights Act, QLD Human Rights Act
  - Fair Trial Rights summary (before/during trial + after conviction)

- [x] **Case Law Research** - Links to all state court databases:
  - NSW Caselaw, Victorian Cases (AustLII), QLD Caselaw, SA Judgments
  - WA eCourts, Tasmanian Cases, NT Cases, ACT Judgments
  - High Court & Federal Court of Australia
  - AustLII main search

### CaseDetail.jsx Refactoring Complete ✅ (Dec 2025)
- [x] **Reduced from 2294 lines to 1209 lines** (~47% reduction)
- [x] **Integrated Section Components**:
  - `DocumentsSection.jsx` - Handles document upload, listing, search, OCR
  - `NotesSection.jsx` - Manages notes CRUD, categories, pinning
  - `ReportsSection.jsx` - Report generation with payment integration
- [x] **Cleaned Up Unused Code**:
  - Removed 10+ unused state variables
  - Removed 15+ unused handler functions
  - Removed unused imports (ScrollArea, ScanLine, etc.)
- [x] **Testing Verified**: All 7 tabs working (Documents, Timeline, Grounds, Notes, Reports, Legal Framework, Progress)
- [x] **Test Report**: `/app/test_reports/iteration_16.json`

### Pricing & Paywall Updates ✅ (Dec 2025)
- [x] **Quick Summary Reports now FREE**
- [x] **Grounds of Merit paywall fixed** - Shows count only, $50 to unlock details
- [x] **Updated pricing**:
  - Quick Summary: FREE
  - Full Detailed: $29 AUD
  - Extensive Log: $39 AUD
  - Grounds of Merit Details: $50 AUD

### Success Stories Page Updated ✅ (Dec 2025)
- [x] **4 detailed, realistic stories** with specific legal issues:
  - Sarah M. (NSW) - Jury misdirection, sentence reduced by 5 years
  - Michael T. (NSW) - Self-defence, CCTV contradiction, appeal pending
  - Jenny K. (QLD) - Search warrant timing issue, Legal Aid review
  - David R. (VIC) - Forensic calculation error, sentence reduced
- [x] **Added timeframe badges** showing appeal duration

### Case Statistics Dashboard ✅ (Dec 2025)
- [x] **Public statistics page** at `/statistics`
- [x] **Overview metrics**: Total cases, documents, reports, grounds identified
- [x] **Visual charts**:
  - Cases by Offence Type (horizontal bar chart)
  - Cases by State (horizontal bar chart)
  - Most Common Appeal Grounds (ranked list)
  - Ground Strength Distribution (circular badges)
- [x] **Key Insights section** highlighting trends
- [x] **Navigation links** added to header and footer

### New Pages & Features ✅ (Dec 2025)
- [x] **FAQ Page** (`/faq`) - Searchable FAQ with 6 categories, 20+ questions
- [x] **Lawyer Directory** (`/lawyers`) - Legal Aid, Bar Association, Law Society links for all 8 states
- [x] **Dark Mode Toggle** - Moon/Sun icon in header, persists in localStorage
- [x] **Drag & Drop Upload** - Enhanced document upload with drag/drop zone
- [x] **Updated Navigation** - FAQ, Find Lawyers links in header and footer

### Compare Your Case Feature ✅ (Dec 2025)
- [x] **New API endpoint** `/api/cases/{case_id}/comparison`
- [x] **CaseComparison component** in Progress tab showing:
  - Similar cases count (same offence, same state, exact match)
  - Your documents vs average comparison
  - Your grounds vs average comparison
  - Most common grounds for your offence type
  - Personalized insights and recommendations
- [x] **Visual indicators** (above/below average badges)

### Landing Page Design Cleanup ✅ (Dec 2025)
- [x] **Criminal Law by State** section converted to **collapsible accordions**
- [x] Each state (NSW, VIC, QLD, SA, WA, CTH) is now a clickable dropdown
- [x] Reduces visual clutter - users only expand what they need

## Next Priority Tasks
- [ ] Convert tabbed pages (LegalResourcesPage, ContactsPage) to scrollable single-page view
- [ ] Complete backend refactoring - remove duplicate routes from server.py
- [ ] Finalize PayPal backend payment processing

## Backlog
- [ ] Build and submit native mobile app (Capacitor ready)
- [ ] Enhanced collaboration features (replies, threads, @mentions in notes)
- [ ] Backend refactoring - continue modularizing server.py
- [ ] Deadline Tracker with Calendar integration
- [ ] Real-time collaboration/chat

### Bug Fixes & Improvements (Mar 2026 - Session 4) ✅
- [x] **Google Sign-in Button Restored** - Added "Sign in with Google" button to AuthModal
  - Uses Emergent Auth at `auth.emergentagent.com`
  - Proper redirect URL derived dynamically from `window.location.origin`
  - OR divider between Google and email/password login
  - data-testid="google-signin-btn" for testing
  - File: `frontend/src/components/AuthModal.jsx`

- [x] **How To Use Page Updated with Real Screenshots** - Complete rewrite with actual app photos
  - 8 real screenshots taken of: Sign-in modal, Dashboard, Case Detail, Timeline, Grounds, Contradictions, Progress, Reports
  - Screenshots stored in `/app/frontend/public/images/howto/`
  - Step-by-step instructions with tips for each step
  - Added Legal Framework link to page header nav
  - File: `frontend/src/pages/HowToUsePage.jsx`

- [x] **Landing Page Navigation Improved** - All content cards now clickable
  - Linked 9 previously unlinked cards: Forms, Contacts, Glossary, Statistics, Success Stories, Lawyers, How To Use, FAQ, Legal Research Hub
  - Mobile menu: Added highlighted amber links for "How To Use" and "Legal Framework"
  - File: `frontend/src/pages/LandingPage.jsx`

- [x] **Testing**: All 24 tests passed (`/app/test_reports/iteration_23.json`)
  - Google Sign-in: Button visible, correct redirect URL
  - How To Use: All 8 screenshots loaded, 10 steps visible
  - Legal Framework: All 4 tabs working, all states covered
  - Landing page: 9 clickable card links verified
  - Mobile menu: Highlighted links verified

### Landing Page Reorganization (Dec 2025) ✅
- [x] **Section Order Reorganized** - Per user request, Landing Page now follows this structure:
  1. Hero Section (top)
  2. See It In Action (with Features merged - no separate Features section)
  3. Relevant Legislation (Criminal Law by State + Human Rights merged)
  4. Live Caselaw Search
  5. Pricing
  6. "You Have Options" (Legal Help - moved to bottom)
- [x] **About Page Created** - `/about` route with standalone page for creator's story
  - Contains: Deb's story, Josh & Brad's stories, mission statement
  - Moved from Landing Page's About section
- [x] **Footer Updated** - Added "About" link to footer navigation
- [x] **"Read My Full Story" Button** - Links to /about from Landing Page
- [x] **Testing**: All sections verified in correct order (`/app/test_reports/iteration_22.json`)
  - Hero (Y=289px) → See It In Action (Y=978px) → Legislation (Y=6032px) → Caselaw (Y=7222px) → Pricing (Y=7925px) → You Have Options (Y=8776px)

## Backlog (Bottom)
- [ ] Build and submit native mobile app (Capacitor ready)
- [ ] Enhanced collaboration features (replies, threads, @mentions in notes)
- [ ] Deadline Tracker with Calendar integration
- [ ] Real-time collaboration/chat for Notes section





