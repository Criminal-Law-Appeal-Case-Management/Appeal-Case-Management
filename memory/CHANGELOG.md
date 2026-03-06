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

## 2026-03 — Session 13 (AU-English Enforcement Pass)
- Enforced Australian-English spelling in key user-facing strings (e.g., organise/analysing/analyse)
- Updated remaining US-spelling copy in templates/error text where safe
- Extended proofreading across Landing, FAQ, Statistics, Compare Cases, Case Detail labels, Form Templates, and glossary/legal resources wording
- Preserved API route contracts that use `/analyze` naming for compatibility
- Validation: landing + backend quick regression checks passed

## 2026-03 — Session 14 (Grounds/Report Performance Optimisation)
- Reduced AI prompt payload size for grounds auto-identify, single-ground investigation, and report generation using bounded context budgets
- Added document/timeline/notes truncation metadata in prompt assembly to keep responses faster on large matters
- Switched grounds auto-identify + ground investigation model calls to `gpt-4o-mini` for faster turnaround
- Improved frontend user feedback for long operations (clear speed-mode toasts + timeout messaging)
- Increased client timeout windows for heavy analysis routes to reduce premature timeout errors
- Validation: health checks + endpoint smoke tests + report/ground generation checks passed

## 2026-03 — Session 15 (Legal Directory + Statistics Readability Refresh)
- Merged legal contacts/resources experience to a single canonical page (`/legal-resources`)
- Added state filter and state-order rendering on legal directory cards to reduce scrolling fatigue
- Kept all listings and added clearer "How they can help with legal advice" card labelling
- Redirects updated: `/legal-contacts` and `/contacts` now route to merged legal resources page
- Reworked Appeal Statistics visual hierarchy:
  - Larger headline
  - Prominent 0.012% spotlight box near top
  - Section labels and clearer sectional structure
  - Long crisis analysis block made collapsible for readability
- Validation: frontend test pass with working filters, section structure, and page rendering

## 2026-03 — Session 16 (Legal Directory State-Focused Simplification)
- Set legal directory default to state-focused mode (NSW) with national support included to reduce clutter on first load
- Added unified state-view banner and condensed section presentation when a specific state filter is active
- Kept all legal contacts/resources in merged one-page experience and retained advice-help descriptors
- Validation: UX checks confirm improved scannability and stable rendering

## 2026-03 — Session 17 (How It Works Standalone Experience)
- Added new standalone `/how-it-works` page to show process flow in action
- Included report pricing section directly under the process walkthrough
- Added clear "Start Your Case Now" CTA button on the new page
- Kept existing `/how-to-use` page intact (no info removed)
- Updated landing Learn dropdown and mobile menu links to include new page
- Validation: routing and UI checks passed with no regressions

## 2026-03 — Session 18 (Presentation Tightening + Success Stories Layout)
- Success Stories redesigned into compact multi-column cards (desktop 3-up), with explicit heading above each comment and preserved detail/outcome data
- Landing Resources dropdown tidied (merged legal resources/contacts entry, duplicate removed)
- Landing resources section updated to reflect merged flow and new How It Works page
- Landing footer reorganised into clearer grouped sections with updated links
- Validation: full frontend presentation checks passed, no regressions

## 2026-03 — Session 19 (Glossary + Landing Navigation Polish Continuation)
- Added Legal Glossary compact/expanded density toggle (compact default) for faster scanning without removing any term details
- Kept full glossary data and examples intact while tightening card spacing/typography for readability
- Added mini "Back to top" controls between major landing sections with smooth scroll
- Validation: frontend testing agent pass (`iteration_37.json`) + final sanity pass all green

## 2026-03 — Session 20 (No-Dropdown Navigation + Visibility Pass)
- Removed landing desktop dropdown menu pattern; promoted key destinations to always-visible top nav links
- Ensured high-value pages are directly visible: See It In Action, Appeal Statistics, Legal Resources, Success Stories, FAQ, About
- Made appeal statistics critical content visible by default (removed collapse/dropdown behaviour from access-crisis section)
- Centred major headings/subheadings on Appeal Statistics and How It Works for cleaner reading flow
- Validation: `iteration_38.json` pass + final frontend sanity pass complete

## 2026-03 — Session 21 (Report Generation Reliability + Aggressive Footer)
- Fixed admin detection reliability by normalising admin email checks (`is_admin_user`) across unlock/payment paths
- Improved report generation reliability with adaptive model fallback strategy (`gpt-4o` then `gpt-4o-mini`)
- Reduced extremely high paid-report target ranges to practical premium ranges to lower timeout risk while preserving structure depth
- Added explicit bottom section when aggressive mode is enabled:
  - `AGGRESSIVE RELIEF OPTIONS — QUICK REFERENCE`
- Improved frontend error feedback to show backend report-generation detail messages instead of generic errors
- Validation: backend report-generation stability checks passed and aggressive section confirmed present

## 2026-03 — Session 22 (Recovered Report Embedding)
- Added authenticated backend endpoint: `GET /api/reports/embedded-legacy`
  - Finds strongest historical reports for the current user (prioritised by detail length)
  - Returns embedded-ready report payload with type/title/date/content
- Report View now embeds recovered high-detail historical reports directly below current report content
  - Includes report type badge, generated date, embedded analysis block, and “Open Original” button
- Goal: preserve previously strong report quality references and reduce perceived loss of good prior outputs
- Validation: frontend testing pass (`iteration_40.json`) confirms section visibility and no regressions

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