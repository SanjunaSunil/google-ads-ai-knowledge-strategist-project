# 02 — Intent Mapping

This folder defines how the AI support assistant classifies advertiser queries and routes them to the correct knowledge chunk and response path.

## What's here

| File | Description |
|---|---|
| `intent-taxonomy.json` | Machine-readable intent definitions. Each intent has example phrases, a linked knowledge chunk, a routing outcome, a confidence threshold, and a tone prescription. |
| `intent-tree.md` | A Mermaid flowchart visualizing the full intent classification tree, from first contact through to routing outcome. |
| `few-shot-dataset.jsonl` | Six training examples — one per advertiser situation — showing the exact input query and ideal AI response for each intent. |

## How it works

Before the AI generates a response, the system classifies the advertiser's query against the intent taxonomy. The matched intent determines which knowledge chunk to retrieve, what tone to use, and whether to handle the query with self-serve AI or escalate to a human agent.

The few-shot dataset teaches the model the correct format and phrasing for each intent by example. For instance, INT-006 (HTML5 ad malfunction) always routes to human escalation — the few-shot example shows the model exactly how to phrase that handoff without making the advertiser feel dismissed.

The intent tree also includes a graceful degradation path: if no intent is matched above the confidence threshold, the system falls back to a safe general response and logs the query for taxonomy review.
