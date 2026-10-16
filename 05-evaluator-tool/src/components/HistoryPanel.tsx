import type { EvaluationRecord } from '../types'
import { deleteEvaluation } from '../lib/database'

const VERDICT_COLOR: Record<string, string> = {
  ready: 'bg-green-100 text-green-700',
  monitor: 'bg-blue-100 text-blue-700',
  improve: 'bg-yellow-100 text-yellow-700',
  fail: 'bg-red-100 text-red-700',
}

interface Props {
  records: EvaluationRecord[]
  onSelect: (record: EvaluationRecord) => void
  onDelete: (id: string) => void
}

export function HistoryPanel({ records, onSelect, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <div className="bg-white border border-google-gray-border rounded-xl p-6 text-center text-sm text-google-gray">
        No evaluations yet. Run your first evaluation to see results here.
      </div>
    )
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    await deleteEvaluation(id)
    onDelete(id)
  }

  return (
    <div className="bg-white border border-google-gray-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-google-gray-border">
        <h3 className="text-sm font-semibold text-gray-700">Evaluation History</h3>
      </div>
      <ul className="divide-y divide-google-gray-border">
        {records.map(record => (
          <li
            key={record.id}
            onClick={() => onSelect(record)}
            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-google-gray-light transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{record.intent_label}</p>
              <p className="text-xs text-google-gray mt-0.5">
                {new Date(record.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${VERDICT_COLOR[record.result.verdict]}`}>
                {record.result.overall_score}
              </span>
              <button
                onClick={e => handleDelete(e, record.id)}
                className="text-google-gray hover:text-google-red transition-colors text-xs"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
