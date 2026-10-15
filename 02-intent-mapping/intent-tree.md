# Intent Tree — Google Ads AI Support Assistant
## Policy Scope: Editorial and Technical Requirements (ADS-EDT-001)

This diagram maps advertiser support queries to their classified intent, knowledge chunk, and routing outcome.

```mermaid
flowchart TD
    A([Advertiser Contact\nAd Disapproved / Policy Question]) --> B{What is the\nprimary issue?}

    B --> C[Ad Text Issue]
    B --> D[Landing Page Issue]
    B --> E[Technical / Format Issue]
    B --> F[General Policy Question]

    C --> C1{Which type?}
    C1 --> C1A["Gimmicky symbols or\npunctuation in text\n(e.g. F₹€€!!, f-r-e-e)"]
    C1 --> C1B["Vague or generic\nad copy\n(e.g. 'Buy products here')"]

    C1A --> R1["INT-001\nChunk: ADS-EDT-001-C3\nRouting: Self-Serve\nTone: Empathetic"]
    C1B --> R2["INT-002\nChunk: ADS-EDT-001-C2\nRouting: Self-Serve\nTone: Empathetic"]

    D --> D1{Which type?}
    D1 --> D1A["Site down, under construction,\nor recently changed"]
    D1 --> D1B["Back button disabled\nor navigation broken"]

    D1A --> R3["INT-003\nChunk: ADS-EDT-001-C4\nRouting: Self-Serve\nEscalation: If site confirmed live"]
    D1B --> R4["INT-004\nChunk: ADS-EDT-001-C4\nRouting: Self-Serve\nTone: Direct"]

    E --> E1{Which type?}
    E1 --> E1A["HTML5 ad blank\nor malfunctioning"]
    E1 --> E1B["Language targeting\nmismatch"]
    E1 --> E1C["Character limit,\nfile size, or length exceeded"]

    E1A --> R5["INT-006\nChunk: ADS-EDT-001-C5\nRouting: Human Escalation ⚠️\nAlways escalate"]
    E1B --> R6["INT-005\nChunk: ADS-EDT-001-C5\nRouting: Self-Serve\nTone: Professional"]
    E1C --> R7["INT-007\nChunk: ADS-EDT-001-C6\nRouting: Self-Serve\nTone: Direct"]

    F --> R8["INT-008\nChunk: ADS-EDT-001-C1\nRouting: Self-Serve\nTone: Professional"]

    style R5 fill:#ff6b6b,color:#fff
    style R3 fill:#ffa94d,color:#fff
    style R1 fill:#51cf66,color:#fff
    style R2 fill:#51cf66,color:#fff
    style R4 fill:#51cf66,color:#fff
    style R6 fill:#51cf66,color:#fff
    style R7 fill:#51cf66,color:#fff
    style R8 fill:#74c0fc,color:#fff
```

## Routing Legend

| Color | Routing | Meaning |
|---|---|---|
| Green | Self-Serve | AI assistant resolves without human involvement |
| Orange | Self-Serve with Escalation Condition | AI resolves, but escalates if a specific condition is met |
| Red | Human Escalation | Always handed off to a human support agent |
| Blue | General | Informational response, no action required |

## Unknown Intent — Graceful Degradation

If no intent is matched with confidence ≥ 0.70, the system routes to this fallback path:

```mermaid
flowchart LR
    U([Unclassified Intent]) --> G1[Log intent for review]
    G1 --> G2[Return generic policy guidance\nwith ADS-EDT-001-C1]
    G2 --> G3[Offer human escalation]
    G3 --> G4[Flag for intent taxonomy update]
```
