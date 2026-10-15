# 01 — Knowledge Base

This folder contains the structured knowledge base for the Google Ads AI support assistant, built from the official Editorial and Technical Requirements policy (ADS-EDT-001).

## What's here

| File | Description |
|---|---|
| `raw/editorial-technical-requirements.md` | The original policy text, unedited. This is the source material before any structuring work. |
| `structured/editorial-technical-requirements.json` | The same policy broken into 6 discrete chunks. Each chunk covers one specific rule and is tagged with metadata for RAG retrieval. |
| `metadata-schema.json` | The JSON Schema that defines every metadata field used across all knowledge base chunks — allowed values, data types, and required fields. |

## How it works

A RAG system retrieves knowledge by filtering on metadata tags, then running a semantic search within the matching results. A query like "why was my ad disapproved for using dollar signs in the headline" would filter for `trigger_condition: gimmicky_symbols` and `intent_match: ad_disapproval`, surface chunk `ADS-EDT-001-C3`, and pass it to the AI model as context.

The structured file shows two key decisions visible in every chunk:

- **Token optimization:** The raw policy runs to ~312 words. The 6 structured chunks total ~387 tokens — but each individual chunk is 38–74 tokens, small enough to fit precisely within a single RAG retrieval slot without padding the model context with irrelevant text.
- **Trigger specificity:** Two chunks can share the same `policy_category` (e.g., both `editorial`) but have different `trigger_condition` values, so the right chunk is retrieved for the right situation.
