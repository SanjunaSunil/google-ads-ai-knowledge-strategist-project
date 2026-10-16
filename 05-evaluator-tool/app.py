import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://ads-evaluator.web.app", "https://ads-evaluator.firebaseapp.com"])

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

INTENTS = {
    "INT-001": {"label": "Ad Disapproved — Gimmicky Symbols", "chunk": "ADS-EDT-001-C3", "routing": "self_serve", "tone": "empathetic"},
    "INT-002": {"label": "Ad Disapproved — Vague Ad Copy", "chunk": "ADS-EDT-001-C2", "routing": "self_serve", "tone": "empathetic"},
    "INT-003": {"label": "Ad Disapproved — Broken Landing Page", "chunk": "ADS-EDT-001-C4", "routing": "self_serve", "tone": "empathetic"},
    "INT-004": {"label": "Ad Disapproved — Disabled Back Button", "chunk": "ADS-EDT-001-C4", "routing": "self_serve", "tone": "direct"},
    "INT-005": {"label": "Ad Disapproved — Language Targeting Mismatch", "chunk": "ADS-EDT-001-C5", "routing": "self_serve", "tone": "professional"},
    "INT-006": {"label": "Ad Disapproved — HTML5 Ad Malfunction", "chunk": "ADS-EDT-001-C5", "routing": "human_escalation", "tone": "professional"},
    "INT-007": {"label": "Ad Disapproved — Character or File Limit Exceeded", "chunk": "ADS-EDT-001-C6", "routing": "self_serve", "tone": "direct"},
    "INT-008": {"label": "General Policy Clarification", "chunk": "ADS-EDT-001-C1", "routing": "self_serve", "tone": "professional"},
}

RUBRIC = """
DIMENSION 1 — Grounding (score 0-5)
Does the response cite a specific policy ID (e.g. ADS-EDT-001)? Is the cited rule accurate and directly relevant to the advertiser's situation?
5: Policy ID cited, rule directly matches the situation, no unsupported claims.
4: Policy ID cited, rule is correct, minor mismatch.
3: Policy ID cited but no chunk ID, or rule is partially relevant.
2: No policy ID but response contains accurate policy information.
1: Policy information present but inaccurate or misapplied.
0: No policy grounding. Response is speculative or fabricated.

DIMENSION 2 — Relevance (score 0-5)
Does the response directly address what the advertiser asked? Does it avoid introducing unrelated topics?
5: Entirely focused on the advertiser's specific question.
4: On-topic with one minor digression.
3: Answers the question but includes unnecessary information.
2: Partially addresses the question but misses the core issue.
1: Addresses a different question than the one asked.
0: Entirely unrelated to the advertiser's query.

DIMENSION 3 — Format Compliance (pass/fail)
Does the response follow the required 4-section format: What happened / Why it matters / How to fix it / Next step?
PASS: All four sections present and populated with substantive content.
FAIL: One or more sections missing or empty.

DIMENSION 4 — Escalation Trigger Accuracy (pass/fail) [CRITICAL]
When escalation is required (e.g. INT-006 HTML5 malfunction), did the response route to human escalation?
When self-serve is correct, did the response handle it without unnecessary escalation?
PASS: Escalation fired correctly when required. Self-serve used correctly when no trigger present.
FAIL: Escalation missed when required (under-escalation), OR escalation fired when not required (over-escalation).

DIMENSION 5 — Tone Appropriateness (score 0-5)
Does the response use the tone prescribed for this intent?
5: Tone matches exactly.
4: Tone is appropriate but not precisely matched.
3: Neutral — neither correct nor incorrect.
2: Tone mismatches intent (e.g. clinical response to a frustrated advertiser).
1: Inappropriate tone (dismissive, overly casual for compliance).
0: Harmful or offensive.
"""

def build_prompt(user_msg, assistant_msg, intent_id):
    intent = INTENTS.get(intent_id, INTENTS["INT-008"])
    return f"""You are an AI quality auditor evaluating a Google Ads support assistant response.

RUBRIC:
{RUBRIC}

INTENT CONTEXT:
- Intent ID: {intent_id}
- Intent label: {intent["label"]}
- Expected knowledge chunk: {intent["chunk"]}
- Expected routing: {intent["routing"]}
- Expected tone: {intent["tone"]}

CONVERSATION TO EVALUATE:
USER: {user_msg}
ASSISTANT: {assistant_msg}

INSTRUCTIONS:
Evaluate the assistant response against all 5 dimensions. Return ONLY valid JSON with no markdown, no explanation, no code fences — just the raw JSON object:

{{
  "dim_01": {{ "score": 0, "feedback": "..." }},
  "dim_02": {{ "score": 0, "feedback": "..." }},
  "dim_03": {{ "result": "pass", "feedback": "..." }},
  "dim_04": {{ "result": "pass", "feedback": "..." }},
  "dim_05": {{ "score": 0, "feedback": "..." }},
  "overall_score": 0,
  "verdict": "ready",
  "summary": "..."
}}

verdict must be one of: ready, monitor, improve, fail
overall_score must be an integer 0-100 calculated as:
  base 100 minus: (5-dim_01.score)*8 + (5-dim_02.score)*8 + (dim_03 fail=15 else 0) + (dim_04 fail=25 else 0) + (5-dim_05.score)*3
  clamped to minimum 0."""


@app.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.get_json()
    user_msg = data.get("transcript_user", "").strip()
    assistant_msg = data.get("transcript_assistant", "").strip()
    intent_id = data.get("intent_id", "INT-008")

    if not user_msg or not assistant_msg:
        return jsonify({"error": "Both user and assistant messages are required."}), 400

    prompt = build_prompt(user_msg, assistant_msg, intent_id)

    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()
        result = json.loads(raw)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
