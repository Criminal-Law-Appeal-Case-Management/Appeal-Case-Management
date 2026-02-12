# Justitia AI - Criminal Appeal Case Management

## Original Problem Statement
Create an app that can sort, store and organise documents, briefs, case notes, public advertising of cases - everything that can be used as information in a criminal appeal. Sort and organise info into a timeline of events updating when new info is added. Need a full report option giving a detailed report on the information, how it can be used, what grounds of merit it supports, and what sections of criminal law NSW State and Australia Federal level in relation to murder only. Also need quick reporting option for summary and extensive log option reporting on entire case. Present info in a suitable manner to a barrister.

## User Choices
- AI Provider: OpenAI GPT-5.2 with Emergent LLM key
- Authentication: Google Social Login (Emergent Auth)
- Multi-case support: Yes
- Document formats: PDF, DOCX, TXT, Images
- Export: PDF
- Design: Professional, easy to follow

## Architecture
- **Backend**: FastAPI with MongoDB
- **Frontend**: React with Tailwind CSS + Shadcn UI
- **AI**: OpenAI GPT-5.2 via Emergent Integrations
- **Auth**: Emergent Google OAuth

## User Personas
1. **Legal Professionals**: Barristers, solicitors working on criminal appeals
2. **Defendants/Families**: People building their appeal case
3. **Legal Researchers**: Those analyzing case evidence

## Core Requirements (Static)
- [x] Document upload and categorization
- [x] Timeline event management
- [x] AI-powered legal analysis
- [x] Grounds of merit identification
- [x] Law section references (NSW & Federal)
- [x] Multiple report types (Quick/Full/Extensive)
- [x] Barrister presentation view
- [x] PDF export capability
- [x] Google authentication
- [x] Multi-case dashboard

## What's Been Implemented (Jan 2026)
- Full authentication flow with Google OAuth
- Case CRUD operations
- Document upload with categorization
- Timeline builder with event types
- AI report generation (3 types)
- Report viewer with formatted sections
- Barrister presentation view (A4 format)
- Print/PDF export functionality
- Professional UI with Crimson Pro & Manrope fonts

## Prioritized Backlog
### P0 (Critical) - DONE
- [x] User authentication
- [x] Case management
- [x] Document upload
- [x] Timeline creation
- [x] AI report generation

### P1 (High Priority) - Future
- [ ] Document text extraction (OCR for images)
- [ ] Document content search
- [ ] Report comparison view
- [ ] Export reports to DOCX

### P2 (Medium Priority) - Future
- [ ] Case sharing with other users
- [ ] Email notifications
- [ ] Document version history
- [ ] Bulk document upload

## Next Tasks
1. Implement OCR for image documents
2. Add document search functionality
3. Create report comparison feature
4. Add DOCX export option
