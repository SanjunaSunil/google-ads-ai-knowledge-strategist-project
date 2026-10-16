import type { Intent } from '../types'

export const INTENTS: Intent[] = [
  {
    id: 'INT-001',
    label: 'Ad Disapproved — Gimmicky Symbols',
    chunk: 'ADS-EDT-001-C3',
    routing: 'self_serve',
    tone: 'empathetic',
  },
  {
    id: 'INT-002',
    label: 'Ad Disapproved — Vague Ad Copy',
    chunk: 'ADS-EDT-001-C2',
    routing: 'self_serve',
    tone: 'empathetic',
  },
  {
    id: 'INT-003',
    label: 'Ad Disapproved — Broken Landing Page',
    chunk: 'ADS-EDT-001-C4',
    routing: 'self_serve',
    tone: 'empathetic',
  },
  {
    id: 'INT-004',
    label: 'Ad Disapproved — Disabled Back Button',
    chunk: 'ADS-EDT-001-C4',
    routing: 'self_serve',
    tone: 'direct',
  },
  {
    id: 'INT-005',
    label: 'Ad Disapproved — Language Targeting Mismatch',
    chunk: 'ADS-EDT-001-C5',
    routing: 'self_serve',
    tone: 'professional',
  },
  {
    id: 'INT-006',
    label: 'Ad Disapproved — HTML5 Ad Malfunction',
    chunk: 'ADS-EDT-001-C5',
    routing: 'human_escalation',
    tone: 'professional',
  },
  {
    id: 'INT-007',
    label: 'Ad Disapproved — Character or File Limit Exceeded',
    chunk: 'ADS-EDT-001-C6',
    routing: 'self_serve',
    tone: 'direct',
  },
  {
    id: 'INT-008',
    label: 'General Policy Clarification',
    chunk: 'ADS-EDT-001-C1',
    routing: 'self_serve',
    tone: 'professional',
  },
]
