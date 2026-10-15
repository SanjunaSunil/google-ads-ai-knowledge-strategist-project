# Product Launch Readiness Checklist
## Google Ads AI Support Assistant — Content Governance
## Trigger: Any Google Ads policy update or new product feature launch

---

**Launch / Update Name:** ___________________________________
**Policy or Feature Affected:** ___________________________________
**Target Go-Live Date:** ___________________________________
**Knowledge Engineer:** ___________________________________
**Reviewer:** ___________________________________

---

## Stage 1 — Knowledge Base

- [ ] Raw policy source document saved to `01-knowledge-base/raw/`
- [ ] Source document reviewed for changes vs. previous version
- [ ] Affected chunks identified by `policy_id` and `id`
- [ ] Stale chunks updated — `last_updated` date refreshed, `version` incremented
- [ ] New chunks created for any net-new rules
- [ ] Token count reviewed — no chunk exceeds 100 tokens
- [ ] All new/updated chunks validated against `metadata-schema.json`
- [ ] `related_chunks` cross-references updated for affected chunks

**Sign-off:** ___________________ **Date:** ___________

---

## Stage 2 — Intent Taxonomy

- [ ] `intent-taxonomy.json` reviewed for any intent affected by the policy change
- [ ] `example_phrases` updated if new phrasing patterns are expected from advertisers
- [ ] `knowledge_chunk` references updated to point to new or revised chunk IDs
- [ ] `confidence_threshold` reviewed — adjust if the intent boundary has changed
- [ ] New intents added if the update introduces a scenario not previously covered
- [ ] `intent-tree.md` Mermaid diagram updated to reflect any new branches or routing changes

**Sign-off:** ___________________ **Date:** ___________

---

## Stage 3 — Prompt Engineering

- [ ] System prompt reviewed for any constraint affected by the policy change
- [ ] Positive constraints updated if new "must always do" rules apply
- [ ] Negative constraints updated if new prohibited behaviors apply
- [ ] Escalation triggers table reviewed — add new trigger conditions if needed
- [ ] System prompt version incremented and change log entry added
- [ ] Hyperparameter guide reviewed — Temperature/Top-P settings still appropriate for new intents

**Sign-off:** ___________________ **Date:** ___________

---

## Stage 4 — Few-Shot Dataset

- [ ] Existing few-shot examples reviewed for any that reference the changed policy
- [ ] Outdated examples updated or removed
- [ ] New few-shot examples written for any new intent or changed rule (minimum 1 per new intent)
- [ ] Each new example reviewed against the LLM judge rubric dimensions manually

**Sign-off:** ___________________ **Date:** ___________

---

## Stage 5 — Evaluation

- [ ] LLM judge rubric reviewed — scoring criteria still appropriate
- [ ] Smoke test run: minimum 10 synthetic conversations covering affected intents
- [ ] LLM judge scores reviewed — all dimensions above threshold (overall ≥ 3.0)
- [ ] Escalation trigger accuracy confirmed: DIM-04 pass rate = 100%
- [ ] No grounding failures (DIM-01 score < 2) in smoke test

**Sign-off:** ___________________ **Date:** ___________

---

## Stage 6 — Stakeholder Sign-Off

- [ ] Knowledge engineer sign-off
- [ ] Policy team sign-off (confirms content accuracy)
- [ ] Product team sign-off (confirms feature details are represented correctly)
- [ ] Go/No-Go decision recorded

**Final decision:** ☐ Go   ☐ No-Go   ☐ Go with conditions: ___________________________

**Sign-off:** ___________________ **Date:** ___________
