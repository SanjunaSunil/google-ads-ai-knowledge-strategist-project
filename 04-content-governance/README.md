# 04 — Content Governance

This folder contains the process artifacts that govern how the AI support assistant is maintained, updated, and corrected over time.

## What's here

| File | Description |
|---|---|
| `launch-readiness-checklist.md` | A gated checklist for rolling out any policy update or new Google Ads feature. Covers all six components: knowledge base, intent taxonomy, system prompt, few-shot dataset, evaluation, and stakeholder sign-off. |
| `incident-report-template.md` | A reusable blank template for documenting AI hallucination or quality incidents. |
| `incident-report-example.md` | A fully worked incident report for INC-2026-EDT-001 — the stale destination policy chunk that caused the assistant to give incorrect advice about display URL subdomains. |

## How it works

Content governance ensures the AI system stays accurate as Google Ads policies and products evolve.

The launch readiness checklist is used whenever a policy changes or a new feature ships. It enforces a specific update sequence — knowledge base first, then intent taxonomy, then system prompt — because later components depend on earlier ones being correct. Skipping steps is how incidents happen.

The incident report documents what went wrong, exactly which component caused it, what was patched, and how the patch was verified. The example report shows the full lifecycle from detection (LLM judge alert) through root cause analysis to resolution and prevention. The system prompt v2.0 in folder 03 is the direct output of this incident.
