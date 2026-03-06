# Appeal Case Manager — Changelog

## 2026-03 — Session 12 (Unfinished Tasks Execution Sweep)
- Realtime notes collaboration upgraded:
  - Added WebSocket collaboration endpoint: `/api/cases/{case_id}/notes/ws`
  - Presence + typing events implemented
  - Mentions extraction for notes/comments
  - Threaded note comments (add/delete)
  - Pin/unpin alignment fixed (`PATCH /notes/{note_id}/pin`, compatibility fields: `is_pinned` + `pinned`)
- Report generation upgraded with **Aggressive Mode**:
  - `aggressive_mode` added to report request
  - Prompt directives updated for assertive primary/fallback orders
  - `content.aggressive_mode` persisted in saved report
- Barrister View expanded:
  - Comparative sentencing panel
  - Full relief options matrix (quash/retrial/substitute/reduce/dismiss)
- Deadline tracker calendar integration completed:
  - Google Calendar deep-link action
  - ICS export per deadline
- Contacts page ambiguity resolved:
  - Canonical route `/legal-contacts`
  - Redirect `/contacts -> /legal-contacts`
  - Cross-links between contact form and directory
- Mobile packaging progress:
  - `yarn build` completed
  - `npx cap sync` completed successfully
- Validation:
  - Testing report: `/app/test_reports/iteration_35.json`
  - Frontend sanity pass: success

## 2026-03 — Session 11 (Premium Report + Barrister Overhaul)
- AI report prompts reworked for hybrid legal/plain-English depth
- Removed costs + witness contradiction/credibility sections from report content requirements
- Landing report samples rebuilt with stronger examples
- Barrister view and landing legal-professional messaging significantly upgraded
- Admin dashboard access hardening completed
- Legal resources quick-nav and structure improved

## 2026-03 — Session 10 (PayID + Mobile UX)
- PayID flow made clearer and mobile-first
- Payment modal touch targets and layout improved
- PayID details and reference visibility improved