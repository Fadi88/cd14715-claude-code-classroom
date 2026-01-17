# Demo: Extended Thinking for Root Cause Analysis

Learn how extended thinking improves complex multi-step analysis.

## Scenario

An e-commerce platform has a sudden drop in checkout conversions. The ops team needs to investigate the root cause by correlating logs, changes, and user reports.

## Project Structure

```
src/
├── incident-analyzer.ts  # Exported function
├── sample-incidents.ts   # Test data
└── index.ts              # Tests for the function
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Create `.env`:

Add your Anthropic API key if working locally to .env:
```
ANTHROPIC_API_KEY=your-key-here
```
IMPORTANT: This is already set up in Vocareum workspace

## Run

```bash
npm start
```

## Exported Function: incident-analyzer.ts

```typescript
export interface IncidentAnalysis {
   analysis: string;          // The final text response
   thinkingSteps: string[];   // Captured reasoning for audit trail
}

export async function analyzeIncident(
  incidentReport: string
): Promise<IncidentAnalysis>
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Baseline: analysis WITHOUT extended thinking |
| 2 | Test `analyzeIncident()` on checkout drop |
| 3 | Test audit trail extraction for stakeholders |
| 4 | Test all incidents |

## Budget Guidelines

| Task Type | Budget |
|-----------|--------|
| Quick triage | 5,000 tokens |
| Root cause analysis | 10,000-15,000 tokens |
| Complex investigations | 15,000-20,000 tokens |

## Key Takeaway

Extended thinking provides transparent reasoning that can be audited and explained to stakeholders. Use it for complex analysis where decisions have significant impact.

