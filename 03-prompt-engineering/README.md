# 03 — Prompt Engineering

This folder contains the system prompt, hyperparameter settings, and automated evaluation rubric for the Google Ads AI support assistant.

## What's here

| File | Description |
|---|---|
| `system-prompt-v1.md` | The original system prompt. Defines the assistant's role, scope, positive constraints, prohibited behaviors, output format, escalation triggers, and graceful degradation logic. |
| `system-prompt-v2.md` | Revised system prompt after incident INC-2026-EDT-001. Includes annotated change log explaining what was added and why. |
| `hyperparameter-guide.md` | Temperature and Top-P settings for each intent category, with rationale. Includes special override rules for sensitive regulatory topics. |
| `llm-judge-rubric.json` | The automated evaluation rubric used by a secondary auditor model to score every live conversation across five dimensions: Grounding, Relevance, Format Compliance, Escalation Trigger Accuracy, and Tone. |

## How it works

The system prompt is the "instructions layer" — it tells the model what it is, what it can and cannot do, and how to format every response. The two versions show how a prompt evolves after a production incident: v2.0 added a chunk freshness gate that prevents the model from citing destination policy rules from stale knowledge base chunks.

The LLM judge runs continuously in the background, scoring every live conversation. When a dimension drops below the alert threshold, it notifies the knowledge engineer. This is how incident INC-2026-EDT-001 was detected — a 9-day drop in Grounding scores triggered the alert before the issue was escalated by an advertiser.
