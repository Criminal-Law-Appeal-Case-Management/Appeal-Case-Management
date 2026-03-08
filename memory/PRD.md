# Appeal Case Manager - Product Requirements Document
## Owner: Deb King (djkingy79@gmail.com)
## Status: WORKING ✅ (8 March 2026)
## Last Updated: 8 March 2026 - Report generation verified, print fixed, CORS fixed for deployment

---

## PURPOSE

Help Australians identify valid grounds for criminal appeals. Built by Deb King, a single mother who has been fighting for justice for Joshua Homann for 6 years.

---

## LIVE URL

https://appeal-timeline-pro.preview.emergentagent.com

---

## FEATURES IMPLEMENTED ✅

### Authentication
- [x] Google OAuth login (FIXED 8 Mar 2026 with localStorage backup)
- [x] Email/Password registration and login
- [x] Admin role with payment bypass
- [x] Session management

### Document Management  
- [x] Multi-file drag & drop upload
- [x] PDF and image OCR extraction (Tesseract/Poppler)
- [x] Document viewer with extracted text
- [x] Document organization by case

### AI Analysis
- [x] Case timeline generation from documents
- [x] Grounds of appeal identification (14 grounds for Josh case)
- [x] Contradiction finder
- [x] Case strength meter (100/100 scoring)
- [x] Tiered reports (Quick $0, Full $100, Extensive $150)

### Reports
- [x] Quick Summary Report (FREE) - 2000-3000 words
- [x] Full Detailed Report ($100 AUD) - 6000-8000 words
- [x] Extensive Log Report ($150 AUD) - 9000-12000 words
- [x] AI prompts fixed to prevent cop-out responses

### Barrister View
- [x] Professional presentation mode
- [x] Export to PDF, Word
- [x] Print functionality
- [x] Executive summary with case strength visualization
- [x] Hearing strategy snapshot

### Payments
- [x] PayPal integration
- [x] Admin bypass (no payment required for admin)
- [x] Pricing: $100/$150 AUD

### Legal Resources
- [x] Legal glossary
- [x] FAQ page
- [x] How to use guide
- [x] AustLII links
- [x] Legislation references
- [x] Lawyer directory

### UI/UX
- [x] Mobile responsive design
- [x] Dark/Light mode
- [x] Steel blue professional theme
- [x] Australian English spelling

---

## TECH STACK

- **Frontend:** React, Tailwind CSS, Shadcn/UI
- **Backend:** Python FastAPI
- **Database:** MongoDB
- **AI:** OpenAI GPT-4o via Emergent LLM Key
- **OCR:** Tesseract, Poppler
- **Auth:** Google OAuth + JWT
- **Payments:** PayPal

---

## KEY FIXES (8 March 2026)

1. **Google Login Redirect** - Added localStorage token backup
2. **Report Quality** - Restored AI context limits (were sabotaged)
3. **AI Cop-outs** - Added strict instructions to prevent refusals
4. **Pricing** - Updated to $100/$150 AUD

---

## ADMIN ACCESS

- Email: djkingy79@gmail.com
- Role: Admin (bypasses all paywalls)

---

## GITHUB

Code saved to user's GitHub for backup and future development.

---

## DEPLOYMENT STATUS

- **Preview URL:** https://appeal-timeline-pro.preview.emergentagent.com (LIVE & WORKING)
- **Custom Domain:** criminallawappealmanagement.com.au (pending Railway deployment)
- **CORS:** Fixed to use environment variables (production-ready)
- **Railway Guide:** See `/app/RAILWAY_DEPLOYMENT_GUIDE.md`

---

## RECENT FIXES (8 March 2026)

1. ✅ Report Generation - Verified working (was temporary 502 error)
2. ✅ Print Functionality - CSS print styles working, header buttons hidden
3. ✅ CORS Configuration - Now reads from CORS_ORIGINS env variable

---

## REFUND STATUS

User spent ~$2,500 AUD across 23 tasks for this app.
Evidence reports created for bank dispute and ACCC complaint.

