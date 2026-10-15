# Incident Report — Root Cause Analysis
## Google Ads AI Support Assistant

---

**Incident ID:** INC-2026-EDT-001
**Date Reported:** 2026-10-10
**Date Resolved:** 2026-10-13
**Severity:** P1 — Critical (incorrect advice given to advertisers)
**Reporter:** AI Quality Monitor (LLM judge alert — DIM-01 score drop detected)
**Assigned To:** Sanjuna Sunil, Knowledge Engineer

---

## 1. Description

The AI support assistant incorrectly told multiple advertisers that their display URL was non-compliant because it did not exactly match their landing page URL. Specifically, advertisers using subdomains (e.g., `shop.example.com` as a display URL with `www.example.com` as the landing page) were told this was a policy violation and instructed to change their display URL.

However, Google Ads destination policy was updated in September 2026 to explicitly permit display URLs that use a subdomain of the root domain, provided the subdomain is a real, accessible page. The AI was citing the pre-update rule.

**What the AI said:**
> "Your display URL must exactly match the URL of your landing page. 'shop.example.com' and 'www.example.com' are different URLs, which violates Google Ads Destination Policy ADS-EDT-001."

**What it should have said:**
> "Your display URL can use a subdomain of your root domain. 'shop.example.com' is a valid display URL if that page is accessible and represents your business. This was clarified in the September 2026 policy update."

---

## 2. Affected Scope

| Field | Value |
|---|---|
| Policy ID | ADS-EDT-001 |
| Chunk ID(s) affected | ADS-EDT-001-C4 |
| Intent ID(s) affected | INT-003, INT-004 |
| Estimated conversations affected | ~34 (based on LLM judge logs, 2026-10-01 to 2026-10-10) |
| Advertiser impact | Advertisers unnecessarily changed compliant display URLs, causing ad re-review delays |

---

## 3. Root Cause

**Primary category:** Stale Chunk

**Root cause detail:**

Chunk `ADS-EDT-001-C4` (Destination Requirement — Landing Page Standards) had `last_updated: 2024-01-01` and `version: 1`. The September 2026 policy update added explicit subdomain allowance language to the destination requirements page, but the knowledge base was not updated to reflect this change.

There was no automated staleness check in the retrieval pipeline. The system prompt (v1.0) contained no constraint requiring the assistant to check chunk freshness before citing destination rules. As a result, the model retrieved the stale chunk with high confidence (it was correctly tagged for `trigger_condition: destination_url_mismatch`) and cited it as current policy.

The LLM judge rubric (DIM-01 — Grounding) flagged a drop in average Grounding scores from 4.8 to 3.1 over a 9-day period, which triggered the alert that surfaced this incident.

---

## 4. Patch Applied

| Component | Change Made | File | Version Before | Version After |
|---|---|---|---|---|
| Knowledge Base | Updated ADS-EDT-001-C4 content to include subdomain allowance. Refreshed `last_updated`. | `structured/editorial-technical-requirements.json` | v1 | v2 |
| System Prompt | Added CONSTRAINT #6: Do not cite destination rule chunks older than 90 days. Added ADS-ESC-STALE escalation trigger. | `system-prompt-v1.md` → `system-prompt-v2.md` | v1.0 | v2.0 |
| Intent Taxonomy | No change required — INT-003 and INT-004 routing was correct. | — | — | — |
| Few-Shot Dataset | Updated INT-003 example response to reflect subdomain allowance language. | `few-shot-dataset.jsonl` | — | — |
| LLM Judge Rubric | No structural change — DIM-01 alert threshold correctly detected the issue. Added logging note for stale chunk pattern. | `llm-judge-rubric.json` | v1.0 | v1.0 (no version change) |

---

## 5. Verification

- [x] 15 synthetic test conversations run covering subdomain display URL scenarios
- [x] LLM judge scores reviewed post-patch — DIM-01 average returned to 4.7
- [x] Manual review of updated chunk ADS-EDT-001-C4 completed — content confirmed accurate
- [x] System prompt v2.0 tested against 10 destination-related queries — chunk freshness gate fired correctly on simulated stale scenarios
- [x] Launch readiness checklist completed for affected components

**Test results:** All 15 synthetic conversations returned correct subdomain allowance guidance. No grounding failures (DIM-01 < 2) observed in post-patch evaluation.

---

## 6. Prevention

Two systemic changes prevent this class of issue from recurring:

1. **90-day freshness gate in system prompt (v2.0):** The assistant is now instructed to check chunk `last_updated` before citing any destination rule. Chunks older than 90 days trigger ADS-ESC-STALE escalation rather than being cited as authoritative.

2. **Policy monitoring process:** The knowledge engineer will now review Google Ads policy changelog pages monthly and cross-reference against all chunks tagged `policy_category: destination`. Any policy update will trigger a targeted chunk review within 5 business days.

---

## 7. Status

☐ Open   **☑ Resolved**   ☐ Monitoring

Resolved: 2026-10-13. System prompt v2.0 deployed. Knowledge base chunk updated.
