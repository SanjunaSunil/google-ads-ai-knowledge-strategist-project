# Hyperparameter Tuning Guide
## Google Ads AI Support Assistant — Editorial and Technical Requirements (ADS-EDT-001)

This guide documents the recommended Temperature and Top-P settings for each intent category.
These settings are configured in Vertex AI Studio and govern how deterministic or creative
the model's output is for a given query type.

---

## Background

| Parameter | What it controls | Low value effect | High value effect |
|---|---|---|---|
| **Temperature** | Randomness of token selection | More deterministic, consistent | More varied, creative |
| **Top-P** | Probability mass of token candidates | Narrower vocabulary, precise | Broader vocabulary, diverse |

For policy and compliance responses, accuracy and consistency take priority over creativity.
Temperature and Top-P are tuned low for policy intents and higher only for tasks where
generating varied examples is appropriate.

---

## Settings by Intent

| Intent ID | Intent Label | Temperature | Top-P | Rationale |
|---|---|---|---|---|
| INT-001 | Gimmicky Symbols — Policy Explanation | 0.1 | 0.85 | Policy rule is binary. Low temperature enforces consistent, factual explanation. |
| INT-002 | Vague Ad Copy — Policy Explanation | 0.1 | 0.85 | Same rationale. Rule is clear; response should not vary across sessions. |
| INT-002 (fix examples) | Vague Ad Copy — Suggesting Alternative Headlines | 0.6 | 0.90 | Generating example headlines benefits from mild creativity. Capped to avoid off-brand suggestions. |
| INT-003 | Broken Landing Page — Diagnosis | 0.2 | 0.85 | Diagnostic checklist must be consistent. Slight variance allowed for phrasing. |
| INT-004 | Back Button Disabled — Checklist | 0.1 | 0.80 | Technical checklist. Needs to be reproducible and precise. |
| INT-005 | Language Targeting Mismatch | 0.1 | 0.85 | Policy rule is clear. Low temperature. |
| INT-006 | HTML5 Ad Malfunction — Escalation | 0.1 | 0.80 | Escalation message must be consistent and not introduce variation that confuses the advertiser. |
| INT-007 | Character / File Limit — Policy Explanation | 0.1 | 0.85 | Factual response citing specific limits. No variation needed. |
| INT-008 | General Policy Clarification | 0.2 | 0.90 | Slightly more flexibility for phrasing a helpful overview without losing accuracy. |
| Unclassified / Fallback | Graceful Degradation | 0.1 | 0.80 | Fallback response must be maximally conservative and consistent. |

---

## Special Override Rules

| Scenario | Override | Value | Trigger |
|---|---|---|---|
| Any medical or pharmaceutical mention | Temperature override | 0.05 | Flag: ADS-FLAG-MED |
| Any trademark or brand bidding question | Temperature override | 0.05 | Flag: ADS-FLAG-TM |
| Financial product compliance question | Temperature override | 0.05 | Flag: ADS-FLAG-FIN |

These overrides apply regardless of the matched intent. Sensitive regulatory topics require
maximum consistency — the model must not generate any variant of an answer that could be
interpreted as legal or medical advice.

---

## Tuning Notes

- These values were validated against the LLM judge rubric (see `llm-judge-rubric.json`)
  across 50 synthetic test conversations.
- Temperature above 0.7 is not permitted for any intent in this assistant. This assistant
  is a policy tool, not a creative copywriting tool.
- Top-P below 0.80 risks overly repetitive phrasing in longer responses. Do not go below 0.80
  except in escalation and fallback scenarios where exact phrasing consistency is required.
