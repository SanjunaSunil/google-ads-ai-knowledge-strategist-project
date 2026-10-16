import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { EvaluatorPanel } from './components/EvaluatorPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { getAllEvaluations } from './lib/database'
import type { EvaluationRecord } from './types'

export default function App() {
  const [backendOk, setBackendOk] = useState<boolean | null>(null)
  const [records, setRecords] = useState<EvaluationRecord[]>([])
  const [selected, setSelected] = useState<EvaluationRecord | null>(null)

  useEffect(() => {
    fetch('/health')
      .then(r => setBackendOk(r.ok))
      .catch(() => setBackendOk(false))

    getAllEvaluations().then(setRecords)
  }, [])

  function handleNewRecord(record: EvaluationRecord) {
    setRecords(prev => [record, ...prev])
  }

  function handleDelete(id: string) {
    setRecords(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="min-h-screen bg-google-gray-light">
      <Header backendOk={backendOk} />
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EvaluatorPanel onNewRecord={handleNewRecord} />
        </div>
        <div className="lg:col-span-1">
          <HistoryPanel
            records={records}
            onSelect={setSelected}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  )
}
