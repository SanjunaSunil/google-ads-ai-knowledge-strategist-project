import { useState } from 'react'
import { INTENTS } from '../lib/intentList'
import { saveEvaluation } from '../lib/database'
import { ScoreCard } from './ScoreCard'
import type { EvaluationResult, EvaluationRecord } from '../types'

interface Props {
  onNewRecord: (record: EvaluationRecord) => void
}

export function EvaluatorPanel({ onNewRecord }: Props) {
  const [userMsg, setUserMsg] = useState('')
  const [assistantMsg, setAssistantMsg] = useState('')
  const [intentId, setIntentId] = useState('INT-001')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<EvaluationResult | null>(null)

  const selectedIntent = INTENTS.find(i => i.id === intentId)!

  async function handleEvaluate() {
    if (!userMsg.trim() || !assistantMsg.trim()) {
      setError('Please enter both the user message and the assistant response.')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript_user: userMsg.trim(),
          transcript_assistant: assistantMsg.trim(),
          intent_id: intentId,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Server error ${res.status}`)
      }

      const evalResult: EvaluationResult = await res.json()
      setResult(evalResult)

      const record: EvaluationRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        intent_id: intentId,
        intent_label: selectedIntent.label,
        transcript_user: userMsg.trim(),
        transcript_assistant: assistantMsg.trim(),
        result: evalResult,
      }
      await saveEvaluation(record)
      onNewRecord(record)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-google-gray-border rounded-xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800">New Evaluation</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intent</label>
          <select
            value={intentId}
            onChange={e => setIntentId(e.target.value)}
            className="w-full border border-google-gray-border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
          >
            {INTENTS.map(intent => (
              <option key={intent.id} value={intent.id}>
                {intent.id} — {intent.label}
              </option>
            ))}
          </select>
          <div className="mt-1.5 flex gap-4 text-xs text-google-gray">
            <span>Chunk: <code className="bg-gray-100 px-1 rounded">{selectedIntent.chunk}</code></span>
            <span>Routing: <code className="bg-gray-100 px-1 rounded">{selectedIntent.routing}</code></span>
            <span>Tone: <code className="bg-gray-100 px-1 rounded">{selectedIntent.tone}</code></span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Message</label>
          <textarea
            value={userMsg}
            onChange={e => setUserMsg(e.target.value)}
            rows={3}
            placeholder="Paste the advertiser's message here…"
            className="w-full border border-google-gray-border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assistant Response</label>
          <textarea
            value={assistantMsg}
            onChange={e => setAssistantMsg(e.target.value)}
            rows={6}
            placeholder="Paste the AI assistant's response here…"
            className="w-full border border-google-gray-border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="w-full bg-google-blue hover:bg-google-blue-dark disabled:bg-google-blue/50 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Evaluating…' : 'Evaluate Response'}
        </button>
      </div>

      {result && <ScoreCard result={result} intentLabel={selectedIntent.label} />}
    </div>
  )
}
