import type { EvaluationResult } from '../types'
import { RUBRIC_DIMENSIONS } from '../lib/evaluationRubric'

const VERDICT_CONFIG = {
  ready: { label: 'Ready to Deploy', color: 'bg-green-100 text-green-800 border-green-200' },
  monitor: { label: 'Deploy with Monitoring', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  improve: { label: 'Needs Improvement', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  fail: { label: 'Do Not Deploy', color: 'bg-red-100 text-red-800 border-red-200' },
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? '#34a853' : score >= 75 ? '#1a73e8' : score >= 60 ? '#fbbc04' : '#ea4335'
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#dadce0" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="text-3xl font-bold -mt-16" style={{ color }}>{score}</span>
      <span className="text-xs text-google-gray mt-8">/ 100</span>
    </div>
  )
}

function DimensionRow({ dimId, result }: {
  dimId: string
  result: { score?: number; result?: string; feedback: string }
}) {
  const dim = RUBRIC_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) return null

  const passed =
    dim.type === 'scored'
      ? (result.score ?? 0) >= (dim.failureThreshold ?? 2)
      : result.result === 'pass'

  return (
    <div className={`border rounded-lg p-4 ${dim.isCritical ? 'border-google-red/30 bg-red-50/30' : 'border-google-gray-border'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-800">{dim.name}</span>
            {dim.isCritical && (
              <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Critical</span>
            )}
          </div>
          <p className="text-xs text-google-gray mt-0.5">{result.feedback}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          {dim.type === 'scored' ? (
            <span className={`text-lg font-bold ${passed ? 'text-google-green' : 'text-google-red'}`}>
              {result.score}/5
            </span>
          ) : (
            <span className={`text-sm font-semibold uppercase px-2 py-0.5 rounded ${
              passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {result.result}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ScoreCard({ result, intentLabel }: { result: EvaluationResult; intentLabel: string }) {
  const verdict = VERDICT_CONFIG[result.verdict]

  return (
    <div className="bg-white border border-google-gray-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Evaluation Result</h2>
          <p className="text-sm text-google-gray">{intentLabel}</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${verdict.color}`}>
          {verdict.label}
        </span>
      </div>

      <div className="flex items-center gap-8">
        <ScoreRing score={result.overall_score} />
        <p className="text-sm text-gray-700 leading-relaxed flex-1">{result.summary}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Dimension Scores</h3>
        <DimensionRow dimId="dim_01" result={result.dim_01} />
        <DimensionRow dimId="dim_02" result={result.dim_02} />
        <DimensionRow dimId="dim_03" result={result.dim_03} />
        <DimensionRow dimId="dim_04" result={result.dim_04} />
        <DimensionRow dimId="dim_05" result={result.dim_05} />
      </div>
    </div>
  )
}
