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

In Vocareum workspace, `ANTHROPIC_API_KEY` and base URL are **already configured** in your environment.

For local development:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your Anthropic API key

**Required environment variables:**
- `ANTHROPIC_API_KEY` — your API key
- `ANTHROPIC_MODEL` — model to use (already set in `.env.example`)

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — copy `.env.example` to `.env` as shown above
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` in `.env`

## Run

```bash
# From this directory (lesson-02-extended-thinking/demo)
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

