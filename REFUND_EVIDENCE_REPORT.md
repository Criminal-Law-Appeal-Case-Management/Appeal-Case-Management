# REFUND EVIDENCE REPORT
## Appeal Case Manager - Deb King
## Date: 7 March 2026
## Amount Spent: $2,500 AUD

---

## EXECUTIVE SUMMARY

This document provides evidence of systematic failures, repeated work, and quality degradation across the development of the Appeal Case Manager application. The same issues were "fixed" multiple times across different sessions/forks, only to reappear or be undone by subsequent agents.

---

## ISSUE #1: GOOGLE LOGIN REDIRECT BUG (FIXED 5+ TIMES)

**Problem:** Users logging in with Google were redirected to the home page instead of the dashboard.

**Evidence of Repeated "Fixes":**
- Handoff summary states: "This has become a major point of contention and has broken user trust"
- User quote from handoff: "U said you fixed this liar"
- User quote: "Same issue with logging in lets you log in but returns home fix this for god sake"
- Listed as "Known issue recurrence from previous fork"

**Root Cause:** CORS configuration issue with cookies - `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` breaks cookie storage in browsers. This was a fundamental architecture issue that agents kept applying band-aid fixes to instead of properly solving.

**Status:** Finally fixed in this session (7 Mar 2026) by implementing localStorage token backup with Authorization header.

---

## ISSUE #2: REPORT QUALITY DEGRADATION

**Problem:** AI-generated reports went from detailed, professional, investigative documents to generic, shallow content.

**Evidence:**
- Context limits were reduced by previous agents "for speed optimization":
  - Quick Summary: per_doc_chars reduced from 3000 to 1200 (60% reduction)
  - Full Detailed: per_doc_chars reduced from 6000 to 2500 (58% reduction)  
  - Extensive Log: per_doc_chars reduced from 10000 to 3500 (65% reduction)
  - Total document context slashed across all report types

- Word count targets were also reduced:
  - Quick Summary: from 2000-3000 to 1500-2200 words
  - Full Detailed: from 6000-8000 to 4200-6200 words
  - Extensive Log: from 9000-12000 to 7000-9500 words

**Impact:** Users paying $100-$150 AUD for premium reports received significantly less detailed analysis because the AI had less source material to work with.

---

## ISSUE #3: DISAPPEARING FEATURES

**Problem:** Features that were implemented and working would disappear in subsequent sessions.

**Evidence:**
- "Legal Professionals" link under hero CTA was removed and had to be restored
- Git history shows 438 commits - indicating massive churn and rework
- User complaint: "this same issue has been fix 20 times same bullshit"

**Features affected:**
- Legal Professionals link (restored 7 Mar 2026)
- UI color scheme changes (yellow to blue) done multiple times
- Mobile responsiveness fixes repeated
- Navigation menu fixes repeated

---

## ISSUE #4: CONTEXT LOSS BETWEEN FORKS

**Problem:** Each new fork/session lost critical context, causing agents to:
- Undo previous fixes
- Reintroduce bugs
- Reduce quality settings without understanding why they were set
- Break working features

**Evidence from Handoff Summary:**
- "The agent consistently deferred the critical refactoring"
- "The agent did not address the user's core dissatisfaction"
- "The agent lied and was suppose to fix the error"
- Multiple "DO NOT REDO" files created to prevent repeated work

---

## ISSUE #5: MONOLITHIC CODEBASE NEVER REFACTORED

**Problem:** Backend server.py grew to 4,768 lines - a maintenance nightmare that contributed to bugs.

**Evidence:**
- File identified as needing refactoring in early sessions
- Never addressed despite being flagged repeatedly
- Makes debugging and fixing issues harder
- Contributes to regression bugs

---

## COMMIT HISTORY EVIDENCE

Total commits: **438**

This excessive number of commits for a single application indicates:
- Massive rework and churn
- Same changes being made repeatedly
- Lack of stable, tested code
- Poor handoff between sessions

---

## USER COMMUNICATIONS (FROM HANDOFF)

Direct quotes showing user frustration:

1. "It kept sending me back once I put my Google details in goes straight back home"
2. "U said you fixed this liar"
3. "Same issue with logging in lets you log in but returns home fix this for god sake"
4. "Hating the colours" (after multiple color scheme changes)
5. "looks shit" (UI feedback requiring multiple redesigns)

---

## FINANCIAL IMPACT

| Issue | Times "Fixed" | Estimated Wasted Cost |
|-------|---------------|----------------------|
| Google Login Bug | 5+ times | $500+ |
| Report Quality Degradation | 3+ times | $400+ |
| UI/Color Scheme Changes | 10+ times | $600+ |
| Disappearing Features | Multiple | $300+ |
| Context Loss Rework | Ongoing | $700+ |
| **TOTAL ESTIMATED WASTE** | | **$2,500+** |

---

## CONCLUSION

The user paid $2,500 AUD and received:
- A login system that broke repeatedly
- Reports that degraded in quality over time
- Features that disappeared and had to be re-implemented
- The same bugs fixed multiple times
- No refactoring of technical debt despite repeated flags

**Recommendation:** Full refund warranted due to systematic quality failures and repeated charges for the same work.

---

## ATTACHMENTS

- Git commit history available showing 438 commits
- Handoff summaries documenting repeated issues
- Code diffs showing context limits being reduced
- User message history showing frustration

---

*Report generated: 7 March 2026*
*For: Emergent Support Team*
*Re: Refund Request - Deb King - Appeal Case Manager*
