# Company Research Agent Architecture

A multi-agent system for automating comprehensive company research.

## Problem Statement

The sales team needs to research potential customers before outreach. Currently, research is manual:
- Search company website, news, LinkedIn
- Find key decision makers
- Identify company size, funding, tech stack
- Takes 2-3 hours per company

**Goal**: Automate this into a 5-minute agent-powered process.

---

## Non-Agentic vs Agentic Approach

### Non-Agentic (Traditional)
```
User → "Research Acme Corp" → Claude → Single Response → Done

Problems:
- Can only use information in the prompt
- No ability to search for additional data
- Can't verify or cross-reference information
- Single-shot response may miss important details
```

### Agentic (Autonomous)
```
User → "Research Acme Corp" → Agent → WebSearch → Agent evaluates
                                     → Read website → Agent evaluates
                                     → Search LinkedIn → Agent evaluates
                                     → Cross-reference → Final Report

Benefits:
- Agent autonomously gathers information
- Iterates until comprehensive
- Verifies data across sources
- Follows interesting leads
```

---

## Architecture Options

### Option A: Single Agent

```mermaid
graph TB
    Agent["<b>Research Agent</b><br/><br/><b>Tools:</b> WebSearch, WebFetch, Read, Analyze<br/><br/><b>Responsibilities:</b><br/>- Search for company information<br/>- Read and extract data from websites<br/>- Find key people on LinkedIn<br/>- Analyze and compile report<br/><br/><b>Workflow:</b><br/>1. Search company name<br/>2. Read company website<br/>3. Search for funding news<br/>4. Find leadership team<br/>5. Compile comprehensive report"]

    style Agent fill:#e1f5ff,stroke:#333,stroke-width:2px
```

**Pros:**
- Simple to implement
- No coordination overhead
- Single context window

**Cons:**
- Can't parallelize searches
- One agent doing everything
- Long sequential workflow

---

### Option B: Multi-Agent (Recommended)

```mermaid
graph TB
    Orchestrator["<b>Orchestrator</b><br/>Coordinates research and compiles report"]
    WebResearcher["<b>Web Researcher Agent</b><br/><br/><b>Tools:</b><br/>- WebSearch<br/>- WebFetch<br/><br/><b>Finds:</b><br/>- Company info<br/>- Tech stack<br/>- Products"]
    PeopleFinder["<b>People Finder</b><br/><br/><b>Tools:</b><br/>- Search<br/>- WebFetch<br/><br/><b>Finds:</b><br/>- Execs<br/>- Titles<br/>- LinkedIn"]
    NewsAnalyst["<b>News Analyst</b><br/><br/><b>Tools:</b><br/>- WebSearch<br/>- Read<br/><br/><b>Finds:</b><br/>- Funding<br/>- Press<br/>- Acquisitions"]
    Report["<b>Combined Report</b><br/>from all agents"]

    Orchestrator --> WebResearcher
    Orchestrator --> PeopleFinder
    Orchestrator --> NewsAnalyst
    WebResearcher --> Report
    PeopleFinder --> Report
    NewsAnalyst --> Report

    style Orchestrator fill:#fff4e6,stroke:#333,stroke-width:2px
    style WebResearcher fill:#e8f5e9,stroke:#333,stroke-width:2px
    style PeopleFinder fill:#e8f5e9,stroke:#333,stroke-width:2px
    style NewsAnalyst fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Report fill:#f3e5f5,stroke:#333,stroke-width:2px
```

**Pros:**
- Parallel execution (faster)
- Specialized agents (better quality)
- Clear separation of concerns
- Easy to add new research areas

**Cons:**
- More complex coordination
- Multiple API calls
- Need to merge results

---

## Recommended Architecture: Multi-Agent

### Agent Definitions

| Agent | Responsibility | Tools | Model |
|-------|---------------|-------|-------|
| Orchestrator | Coordinates agents, compiles report | Task | Sonnet |
| Web Researcher | Company website, products, tech | WebSearch, WebFetch | Haiku |
| People Finder | Leadership, org structure | WebSearch, WebFetch | Haiku |
| News Analyst | Funding, press, acquisitions | WebSearch, Read | Sonnet |

### Workflow Diagram

```mermaid
flowchart TD
    Start(["<b>START</b><br/>'Research Acme Corp'"])
    Orchestrator1["<b>ORCHESTRATOR</b><br/>Parse request, spawn sub-agents"]
    WebResearcher["<b>Web Researcher</b><br/>(PARALLEL)"]
    PeopleFinder["<b>People Finder</b><br/>(PARALLEL)"]
    NewsAnalyst["<b>News Analyst</b><br/>(PARALLEL)"]
    CompanyProfile["<b>Company Profile</b>"]
    LeadershipData["<b>Leadership Team Data</b>"]
    NewsData["<b>Funding & News Data</b>"]
    Orchestrator2["<b>ORCHESTRATOR</b><br/>Merge results, generate final report"]
    FinalReport["<b>FINAL REPORT</b><br/>- Company Overview<br/>- Leadership Team<br/>- Funding History<br/>- Tech Stack<br/>- Recent News"]

    Start --> Orchestrator1
    Orchestrator1 --> WebResearcher
    Orchestrator1 --> PeopleFinder
    Orchestrator1 --> NewsAnalyst
    WebResearcher --> CompanyProfile
    PeopleFinder --> LeadershipData
    NewsAnalyst --> NewsData
    CompanyProfile --> Orchestrator2
    LeadershipData --> Orchestrator2
    NewsData --> Orchestrator2
    Orchestrator2 --> FinalReport

    style Start fill:#e3f2fd,stroke:#333,stroke-width:2px
    style Orchestrator1 fill:#fff4e6,stroke:#333,stroke-width:2px
    style WebResearcher fill:#e8f5e9,stroke:#333,stroke-width:2px
    style PeopleFinder fill:#e8f5e9,stroke:#333,stroke-width:2px
    style NewsAnalyst fill:#e8f5e9,stroke:#333,stroke-width:2px
    style CompanyProfile fill:#f3e5f5,stroke:#333,stroke-width:2px
    style LeadershipData fill:#f3e5f5,stroke:#333,stroke-width:2px
    style NewsData fill:#f3e5f5,stroke:#333,stroke-width:2px
    style Orchestrator2 fill:#fff4e6,stroke:#333,stroke-width:2px
    style FinalReport fill:#c8e6c9,stroke:#333,stroke-width:3px
```

### Sequence Diagram

The following sequence diagram shows the interaction timeline between components:

```mermaid
sequenceDiagram
    actor User
    participant Orch as Orchestrator
    participant Web as Web Researcher
    participant People as People Finder
    participant News as News Analyst

    User->>Orch: Research "Acme Corp"
    activate Orch

    Note over Orch: Parse request and<br/>spawn agents in parallel

    par Parallel Execution
        Orch->>Web: research(companyName)
        activate Web
        and
        Orch->>People: findLeadership(companyName)
        activate People
        and
        Orch->>News: analyzeNews(companyName)
        activate News
    end

    Note over Web,News: Agents work independently

    Web-->>Orch: Company Profile Data
    deactivate Web
    People-->>Orch: Leadership Team Data
    deactivate People
    News-->>Orch: Funding & News Data
    deactivate News

    Note over Orch: Merge results and<br/>compile final report

    Orch-->>User: Comprehensive Report
    deactivate Orch
```

---

## Orchestration Pattern: Parallel with Merge

```typescript
// Orchestrator spawns all research agents in parallel
const results = await Promise.all([
  webResearcher.research(companyName),
  peopleFinder.findLeadership(companyName),
  newsAnalyst.analyzeNews(companyName)
]);

// Orchestrator merges results
const report = await orchestrator.compileReport(results);
```

This pattern is ideal when:
- Sub-tasks are independent
- Speed matters
- Results can be merged at the end

---

## Key Takeaways

1. **Agentic = Autonomy + Tools + Iteration**
   - Agents can search, read, and iterate until satisfied
   - Not just single-shot responses

2. **Single Agent for Simple Tasks**
   - When workflow is linear
   - When parallelization isn't needed

3. **Multi-Agent for Complex Tasks**
   - When you need speed (parallel execution)
   - When tasks need specialized expertise
   - When you want clear separation of concerns

4. **Orchestrator Pattern**
   - Central coordinator spawns and manages sub-agents
   - Handles merging results
   - Provides unified interface to user
