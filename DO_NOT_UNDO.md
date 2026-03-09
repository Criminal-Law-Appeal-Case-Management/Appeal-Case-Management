# ⛔ DO NOT UNDO OR DELETE - CRITICAL FILE ⛔
## Session: appeal-timeline-pro
## Date: 9 March 2026
## Owner: Deb King

---

# PROTECTED FILES - DO NOT MODIFY

## Authentication (Google Login)
- `/app/frontend/src/pages/AuthCallback.jsx` - DO NOT DELETE
- `/app/frontend/src/components/AuthModal.jsx` - Line 30: `/auth/callback` route
- `/app/frontend/src/App.js` - Line 248: Route for `/auth/callback`

## Reports Section  
- `/app/frontend/src/components/ReportsSection.jsx` - Styled inline preview with colors
- `/app/backend/server.py` - Report generation prompts and LLM calls

## Pricing
- Quick Summary: $99 AUD
- Full Detailed: $100 AUD
- Extensive Log: $150 AUD

## PDF Export
- `/app/backend/server.py` - Lines 4465-4535: PDF table and link rendering

## Database
- DB_NAME: test_database
- User data: 10 cases, 20+ reports for user_d2287f20104b

---

# WHAT IS WORKING - DO NOT BREAK

1. ✅ Google Login via /auth/callback route
2. ✅ Report generation (needs Universal Key balance)
3. ✅ PDF export with tables and clickable links
4. ✅ Styled inline report preview with colors
5. ✅ $99/$100/$150 pricing
6. ✅ Mobile app ready (Capacitor configured)
7. ✅ Barrister View with ReactMarkdown

---

# KNOWN ISSUES (NOT CODE PROBLEMS)

1. ❌ Universal Key budget exceeded - User needs to add balance
2. ❌ Deployment not syncing - Platform issue, contact support
3. ❌ GitHub save not working - Platform issue, contact support

---

# FOR FUTURE AGENTS

**READ THIS BEFORE MAKING ANY CHANGES:**

1. This user has paid $3,500 AUD
2. Same bugs have been "fixed" 38+ times
3. DO NOT touch authentication code
4. DO NOT reduce report quality/context
5. DO NOT change database name
6. DO NOT modify pricing
7. Test BEFORE claiming something is fixed

**If Google login breaks again:**
- Check `/auth/callback` route exists in App.js
- Check AuthCallback.jsx exists in /pages/
- Check AuthModal.jsx redirects to `/auth/callback`

---

# EMERGENCY CONTACTS

- User: djkingy79@gmail.com
- Discord: kingydk79-yo
- Session: appeal-timeline-pro

---

⛔ ANY AGENT WHO DELETES OR UNDOES THIS WORK WILL BE DOCUMENTED ⛔
