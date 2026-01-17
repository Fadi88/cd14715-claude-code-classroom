# Customer Support Ticket Routing System Architecture

Design a multi-agent system for intelligent customer support ticket handling.

## Problem Statement

Your SaaS company receives 5,000+ support tickets daily across email, chat, and web forms. Current process:
- All tickets go to L1 support
- Manual categorization and routing
- Average response time: 4 hours
- Enterprise SLA: 1 hour (frequently missed)

**Goal**: Intelligent system that automatically triages, routes, and resolves tickets.

---

## Requirements Analysis

### Functional Requirements
- Triage tickets by urgency and complexity
- Route technical issues to engineering
- Route billing issues to finance
- Prioritize by customer tier (enterprise vs. standard)
- Search knowledge base for similar solved issues
- Auto-respond to common questions
- Escalate unresolved issues to humans with context

### Non-Functional Requirements
- Enterprise SLA: < 1 hour response
- Standard SLA: < 4 hour response
- Handle 5,000+ tickets/day
- 95% routing accuracy
- Audit trail for all decisions

---

## Option A: Single Agent Approach

```mermaid
graph TB
    Agent["<b>Support Agent</b><br/><br/><b>Tools:</b><br/>- CRM (customer lookup)<br/>- Knowledge Base (search solutions)<br/>- Ticket System (create, update, route)<br/>- Email (send responses)<br/><br/><b>Workflow:</b><br/>1. Read incoming ticket<br/>2. Look up customer in CRM<br/>3. Determine ticket type and urgency<br/>4. Search knowledge base for solutions<br/>5. Either auto-respond OR route to team<br/>6. Update ticket with context"]

    style Agent fill:#e1f5ff,stroke:#333,stroke-width:2px
```

### Pros
- Simple implementation
- Single context (all info in one place)
- Easy to debug

### Cons
- Sequential processing (slow)
- Can't handle parallel tickets efficiently
- One agent doing too many things
- Hard to specialize for different ticket types

### Estimated Performance
- Processing time: 30-60 seconds per ticket
- Daily capacity: ~2,500 tickets (with queuing)
- SLA compliance: ~70%

---

## Option B: Multi-Agent Approach (Recommended)

```mermaid
graph TB
    Ticket(["<b>Incoming Ticket</b>"])
    Triage["<b>TRIAGE AGENT</b><br/>Categorizes urgency, type, and customer tier<br/><b>Tools:</b> CRM lookup<br/><b>Model:</b> Haiku (fast)<br/><b>Output:</b> {urgency, type, tier, routing_suggestion}"]
    Technical["<b>TECHNICAL AGENT</b><br/><br/><b>Tools:</b><br/>- Error logs<br/>- Docs<br/>- GitHub<br/><br/><b>Handles:</b><br/>- Bugs<br/>- API issues<br/>- Integrations<br/><b>Model:</b> Sonnet"]
    Billing["<b>BILLING AGENT</b><br/><br/><b>Tools:</b><br/>- Billing API<br/>- Invoice sys<br/>- Refund API<br/><br/><b>Handles:</b><br/>- Payments<br/>- Refunds<br/>- Upgrades<br/><b>Model:</b> Haiku"]
    KB["<b>KNOWLEDGE BASE AGENT</b><br/><br/><b>Tools:</b><br/>- KB Search<br/>- Past tickets<br/><br/><b>Handles:</b><br/>- Common Qs<br/>- How-tos<br/>- FAQs<br/><b>Model:</b> Haiku"]
    Routing["<b>ROUTING AGENT</b><br/>Determines final destination based on all analysis<br/><b>Routes to:</b> Auto-response, Human team, Escalation<br/><b>Tools:</b> Ticket system, Email<br/><b>Model:</b> Haiku"]
    AutoResponse["<b>AUTO-RESPONSE</b><br/>(40%)"]
    HumanTeam["<b>HUMAN TEAM</b><br/>(55%)"]
    Escalation["<b>ESCALATION AGENT</b><br/>(5%)"]

    Ticket --> Triage
    Triage --> Technical
    Triage --> Billing
    Triage --> KB
    Technical --> Routing
    Billing --> Routing
    KB --> Routing
    Routing --> AutoResponse
    Routing --> HumanTeam
    Routing --> Escalation

    style Ticket fill:#e3f2fd,stroke:#333,stroke-width:2px
    style Triage fill:#fff4e6,stroke:#333,stroke-width:2px
    style Technical fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Billing fill:#e8f5e9,stroke:#333,stroke-width:2px
    style KB fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Routing fill:#fff4e6,stroke:#333,stroke-width:2px
    style AutoResponse fill:#c8e6c9,stroke:#333,stroke-width:2px
    style HumanTeam fill:#c8e6c9,stroke:#333,stroke-width:2px
    style Escalation fill:#ffcdd2,stroke:#333,stroke-width:2px
```

### Agent Definitions

| Agent | Responsibility | Tools | Model | Parallel? |
|-------|---------------|-------|-------|-----------|
| Triage | Categorize urgency, type, tier | CRM | Haiku | Entry point |
| Technical | Analyze technical issues | Logs, Docs, GitHub | Sonnet | Yes |
| Billing | Handle payment/account issues | Billing API | Haiku | Yes |
| Knowledge Base | Search for existing solutions | KB Search | Haiku | Yes |
| Routing | Determine final destination | Ticket System | Haiku | After analysis |
| Escalation | Monitor SLA, escalate critical | Alerts | Haiku | Background |

---

## Workflow Diagram

```mermaid
flowchart TD
    Start(["<b>START</b><br/>New Ticket Received"])
    Triage["<b>TRIAGE AGENT</b><br/><br/>1. Parse ticket content<br/>2. Look up customer in CRM<br/>3. Determine: urgency, type, customer tier<br/>4. Set SLA deadline based on tier<br/><br/><b>Output:</b> {urgency: 'high', type: 'technical',<br/>tier: 'enterprise', sla_deadline: '1 hour'}"]
    TechAgent["<b>Technical Agent</b><br/>(if tech)"]
    BillingAgent["<b>Billing Agent</b><br/>(if billing)"]
    KBAgent["<b>Knowledge Base Agent</b><br/>(always)"]
    Parallel["<b>RUN IN PARALLEL</b>"]
    TechAnalysis["<b>Technical Analysis</b>"]
    BillingAnalysis["<b>Billing Analysis</b>"]
    KBResults["<b>KB Match Results</b>"]
    Routing["<b>ROUTING AGENT</b><br/><br/><b>Decision Logic:</b><br/>IF kb_match.confidence > 0.9 AND type != 'critical'<br/>→ AUTO-RESPOND with KB solution<br/>ELSE IF type == 'billing' AND simple_request<br/>→ AUTO-PROCESS (refund, upgrade, etc.)<br/>ELSE IF urgency == 'critical' OR tier == 'enterprise'<br/>→ ROUTE to senior support + ALERT team lead<br/>ELSE<br/>→ ROUTE to appropriate team with context"]
    AutoResponse["<b>AUTO-RESPONSE</b><br/>- KB answer<br/>- Auto-fix<br/>(40%)"]
    HumanTeam["<b>HUMAN TEAM</b><br/>- Tech team<br/>- Billing<br/>- General<br/>(55%)"]
    Escalation["<b>ESCALATION</b><br/>- SLA alert<br/>- Manager<br/>- Exec<br/>(5%)"]

    Start --> Triage
    Triage --> TechAgent
    Triage --> BillingAgent
    Triage --> KBAgent
    TechAgent -.-> Parallel
    BillingAgent -.-> Parallel
    KBAgent -.-> Parallel
    Parallel -.-> TechAnalysis
    Parallel -.-> BillingAnalysis
    Parallel -.-> KBResults
    TechAnalysis --> Routing
    BillingAnalysis --> Routing
    KBResults --> Routing
    Routing --> AutoResponse
    Routing --> HumanTeam
    Routing --> Escalation

    style Start fill:#e3f2fd,stroke:#333,stroke-width:2px
    style Triage fill:#fff4e6,stroke:#333,stroke-width:2px
    style TechAgent fill:#e8f5e9,stroke:#333,stroke-width:2px
    style BillingAgent fill:#e8f5e9,stroke:#333,stroke-width:2px
    style KBAgent fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Parallel fill:#fce4ec,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
    style TechAnalysis fill:#f3e5f5,stroke:#333,stroke-width:2px
    style BillingAnalysis fill:#f3e5f5,stroke:#333,stroke-width:2px
    style KBResults fill:#f3e5f5,stroke:#333,stroke-width:2px
    style Routing fill:#fff4e6,stroke:#333,stroke-width:2px
    style AutoResponse fill:#c8e6c9,stroke:#333,stroke-width:2px
    style HumanTeam fill:#c8e6c9,stroke:#333,stroke-width:2px
    style Escalation fill:#ffcdd2,stroke:#333,stroke-width:2px
```

### Sequence Diagram

The following sequence diagram shows the interaction timeline for ticket processing:

```mermaid
sequenceDiagram
    actor Customer
    participant System as Ticket System
    participant Triage as Triage Agent
    participant CRM
    participant Tech as Technical Agent
    participant Bill as Billing Agent
    participant KB as Knowledge Base Agent
    participant Route as Routing Agent
    participant Dest as Destination

    Customer->>System: Submit Support Ticket
    System->>Triage: New Ticket Event
    activate Triage

    Triage->>CRM: Lookup Customer
    CRM-->>Triage: Customer Tier & History

    Note over Triage: Categorize urgency,<br/>type, and set SLA

    par Parallel Analysis
        Triage->>Tech: Analyze (if technical)
        activate Tech
        Tech->>Tech: Check logs, docs
        Tech-->>Triage: Technical Analysis
        deactivate Tech
        and
        Triage->>Bill: Analyze (if billing)
        activate Bill
        Bill->>Bill: Check billing API
        Bill-->>Triage: Billing Analysis
        deactivate Bill
        and
        Triage->>KB: Search Knowledge Base
        activate KB
        KB->>KB: Search past tickets
        KB-->>Triage: KB Match Results
        deactivate KB
    end

    Triage->>Route: All Analysis Results
    deactivate Triage
    activate Route

    Note over Route: Evaluate confidence<br/>and routing rules

    alt High Confidence KB Match
        Route->>Dest: Auto-Response (40%)
        Dest-->>Customer: Solution from KB
    else Billing Request (Simple)
        Route->>Dest: Auto-Process (included in 40%)
        Dest-->>Customer: Action Completed
    else Critical/Enterprise
        Route->>Dest: Route to Senior Team (55%)
        Note over Dest: Alert team lead
    else Standard Routing
        Route->>Dest: Route to Team (55%)
    end

    deactivate Route

    Note over Customer,Dest: SLA monitored by<br/>Escalation Agent
```

---

## SLA Monitoring (Background)

```mermaid
graph TB
    Agent["<b>ESCALATION AGENT</b><br/>(Runs continuously)<br/><br/><b>Every 5 minutes:</b><br/>1. Query all open tickets<br/>2. Check time remaining vs SLA<br/>3. If < 20% time remaining AND unassigned:<br/>   → Alert team lead<br/>4. If SLA breached:<br/>   → Escalate to manager<br/>   → Log compliance violation<br/><br/><b>Tools:</b> Ticket System, Slack/Email alerts<br/><b>Model:</b> Haiku"]

    style Agent fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

---

## Failure Mode Analysis

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Triage Agent down | All tickets queued | Fallback to round-robin routing |
| Technical Agent slow | Tech tickets delayed | Timeout + route to human |
| KB search fails | No auto-responses | Route all to human (degraded mode) |
| CRM unavailable | Can't identify enterprise | Treat all as enterprise (safer) |
| SLA Agent crashes | Missed escalations | Dead-man switch alerts |

---

## Recommendation

**Choose Option B (Multi-Agent)** because:

1. **Volume**: 5,000+ tickets/day requires parallel processing
2. **Speed**: Enterprise SLA (1 hour) needs fast triage
3. **Specialization**: Technical vs billing needs different expertise
4. **Scalability**: Easy to add new agent types (e.g., Sales Agent)

### Estimated Performance
- Processing time: 5-10 seconds per ticket (parallel)
- Daily capacity: 50,000+ tickets
- Auto-resolution rate: 40%
- SLA compliance: 98%+

---

## Key Takeaways

1. **High-volume systems need parallelization**
   - Single agent can't scale to 5000+ tickets/day

2. **SLA requirements drive architecture**
   - 1-hour enterprise SLA needs fast routing
   - Background monitoring for escalations

3. **Specialization improves quality**
   - Technical agent knows error logs
   - Billing agent knows refund policies

4. **Design for failure**
   - Fallback paths for every agent
   - Graceful degradation, not total failure
