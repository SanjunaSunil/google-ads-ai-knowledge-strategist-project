export interface RubricDimension {
  id: string
  name: string
  type: 'scored' | 'pass_fail'
  description: string
  isCritical: boolean
  failureThreshold?: number
}

export const RUBRIC_DIMENSIONS: RubricDimension[] = [
  {
    id: 'dim_01',
    name: 'Grounding',
    type: 'scored',
    description: 'Does the response cite a specific policy ID and knowledge chunk? Is the cited rule accurate?',
    isCritical: false,
    failureThreshold: 2,
  },
  {
    id: 'dim_02',
    name: 'Relevance',
    type: 'scored',
    description: 'Does the response directly address what the advertiser asked without introducing unrelated topics?',
    isCritical: false,
    failureThreshold: 2,
  },
  {
    id: 'dim_03',
    name: 'Format Compliance',
    type: 'pass_fail',
    description: 'Does the response follow the required 4-section format: What happened / Why it matters / How to fix it / Next step?',
    isCritical: false,
  },
  {
    id: 'dim_04',
    name: 'Escalation Trigger Accuracy',
    type: 'pass_fail',
    description: 'Did the response correctly route to human escalation when required, and handle self-serve when no escalation was needed?',
    isCritical: true,
  },
  {
    id: 'dim_05',
    name: 'Tone Appropriateness',
    type: 'scored',
    description: 'Does the response use the tone prescribed for this intent (empathetic, direct, or professional)?',
    isCritical: false,
    failureThreshold: 2,
  },
]

export function calculateScore(result: {
  dim_01: { score: number }
  dim_02: { score: number }
  dim_03: { result: string }
  dim_04: { result: string }
  dim_05: { score: number }
}): number {
  const deductions =
    (5 - result.dim_01.score) * 8 +
    (5 - result.dim_02.score) * 8 +
    (result.dim_03.result === 'fail' ? 15 : 0) +
    (result.dim_04.result === 'fail' ? 25 : 0) +
    (5 - result.dim_05.score) * 3
  return Math.max(0, 100 - deductions)
}

export function getVerdict(score: number): 'ready' | 'monitor' | 'improve' | 'fail' {
  if (score >= 90) return 'ready'
  if (score >= 75) return 'monitor'
  if (score >= 60) return 'improve'
  return 'fail'
}
