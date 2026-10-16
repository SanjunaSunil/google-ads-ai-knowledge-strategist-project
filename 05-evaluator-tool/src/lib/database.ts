import { openDB, type IDBPDatabase } from 'idb'
import type { EvaluationRecord } from '../types'

const DB_NAME = 'google-ads-evaluator'
const STORE_NAME = 'evaluations'
const DB_VERSION = 1

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp')
      }
    },
  })
}

export async function saveEvaluation(record: EvaluationRecord): Promise<void> {
  const db = await getDb()
  await db.put(STORE_NAME, record)
}

export async function getAllEvaluations(): Promise<EvaluationRecord[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex(STORE_NAME, 'timestamp')
  return all.reverse()
}

export async function deleteEvaluation(id: string): Promise<void> {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}
