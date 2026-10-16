export interface Intent {
  id: string
  label: string
  chunk: string
  routing: 'self_serve' | 'human_escalation'
  tone: 'empathetic' | 'direct' | 'professional'
}

export interface ScoredDimension {
  score: number
  feedback: string
}

export interface PassFailDimension {
  result: 'pass' | 'fail'
  feedback: string
}

export interface EvaluationResult {
  dim_01: ScoredDimension
  dim_02: ScoredDimension
  dim_03: PassFailDimension
  dim_04: PassFailDimension
  dim_05: ScoredDimension
  overall_score: number
  verdict: 'ready' | 'monitor' | 'improve' | 'fail'
  summary: string
}

export interface EvaluationRecord {
  id: string
  timestamp: number
  intent_id: string
  intent_label: string
  transcript_user: string
  transcript_assistant: string
  result: EvaluationResult
}
