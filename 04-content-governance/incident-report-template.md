# Incident Report — Root Cause Analysis Template
## Google Ads AI Support Assistant

---

**Incident ID:** INC-YYYY-[POLICY]-[SEQ]
**Date Reported:** YYYY-MM-DD
**Date Resolved:** YYYY-MM-DD
**Severity:** ☐ P1 — Critical (incorrect advice given to advertisers)   ☐ P2 — High (degraded response quality)   ☐ P3 — Medium (format or tone issue)
**Reporter:** ___________________________________
**Assigned To:** ___________________________________

---

## 1. Description

*What happened? What did the AI say, and what should it have said?*

---

## 2. Affected Scope

| Field | Value |
|---|---|
| Policy ID | |
| Chunk ID(s) affected | |
| Intent ID(s) affected | |
| Estimated conversations affected | |
| Advertiser impact | |

---

## 3. Root Cause

Select the primary root cause category:

- [ ] **Prompt Loophole** — A system prompt constraint was missing or ambiguous, allowing the model to generate an incorrect response
- [ ] **Data Gap** — A knowledge base chunk was missing, incomplete, or did not cover the scenario
- [ ] **Stale Chunk** — A knowledge base chunk contained outdated policy information
- [ ] **Schema Error** — A chunk was incorrectly tagged, causing the wrong chunk to be retrieved
- [ ] **Routing Error** — The intent router matched the wrong intent, leading to incorrect chunk retrieval
- [ ] **Evaluation Gap** — The LLM judge rubric did not cover the failure mode, so the issue was not caught

**Root cause detail:**

*Describe exactly what was missing, incorrect, or ambiguous. Reference specific chunk IDs, system prompt sections, or rubric dimensions.*

---

## 4. Patch Applied

| Component | Change Made | File | Version Before | Version After |
|---|---|---|---|---|
| Knowledge Base | | | | |
| System Prompt | | | | |
| Intent Taxonomy | | | | |
| Few-Shot Dataset | | | | |
| LLM Judge Rubric | | | | |

---

## 5. Verification

*How was the fix confirmed to work?*

- [ ] Synthetic test conversations run covering the original failure scenario
- [ ] LLM judge scores reviewed post-patch — all dimensions above threshold
- [ ] Manual review of patched chunk or prompt section completed
- [ ] Launch readiness checklist completed for affected components

**Test results:**

---

## 6. Prevention

*What systemic change prevents this class of issue from recurring?*

---

## 7. Status

☐ Open   ☐ Resolved   ☐ Monitoring
