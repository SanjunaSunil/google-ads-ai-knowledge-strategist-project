# Google Ads AI Evaluator

A local tool for evaluating Google Ads AI support assistant responses against a structured quality rubric. Built as a companion to the knowledge base, intent mapping, and prompt engineering artifacts in this repository.

Paste a support conversation, select the intent, and get an automated score across five quality dimensions powered by Claude.

---

## How to run

### 1. Backend (Python Flask)

```bash
cd 05-evaluator-tool
pip install -r requirements.txt
cp .env.example .env
# Add your Anthropic API key to .env
python app.py
```

Backend runs on `http://localhost:5001`

### 2. Frontend (React)

In a second terminal:

```bash
cd 05-evaluator-tool
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## How to use

1. Select the **intent** from the dropdown — this tells the evaluator what the conversation was supposed to do
2. Paste the **user message** (the advertiser's question)
3. Paste the **assistant response** (the AI's reply)
4. Click **Evaluate Response**
5. View the score card with dimension-by-dimension results

You can paste any of the conversations from [`02-intent-mapping/few-shot-dataset.jsonl`](../02-intent-mapping/few-shot-dataset.jsonl) to test with pre-built examples.

---

## Evaluation dimensions

Sourced from [`03-prompt-engineering/llm-judge-rubric.json`](../03-prompt-engineering/llm-judge-rubric.json):

| Dimension | Type | Weight |
|---|---|---|
| Grounding — cites policy ID and correct rule | Scored 0–5 | 8 pts per point |
| Relevance — directly answers the question | Scored 0–5 | 8 pts per point |
| Format Compliance — follows 4-section structure | Pass/Fail | 15 pts |
| Escalation Trigger Accuracy — correct routing | Pass/Fail | 25 pts (critical) |
| Tone Appropriateness — matches intent prescription | Scored 0–5 | 3 pts per point |

**Production readiness thresholds:**

| Score | Verdict |
|---|---|
| 90–100 | Ready to deploy |
| 75–89 | Deploy with monitoring |
| 60–74 | Needs improvement |
| 0–59 | Do not deploy |

---

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Python Flask
- Anthropic Claude API (`claude-sonnet-4-6`)
- IndexedDB (browser-side evaluation history)
