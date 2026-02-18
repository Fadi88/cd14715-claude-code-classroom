# Solution: Evaluating Agentic Systems - Sentiment Analysis

Complete solution with all evaluators implemented.

## Architecture

```
src/
├── sentiment-tool.ts    # Custom MCP tool (Lesson 6 pattern)
├── types.ts             # Zod schemas + test cases (Lesson 7 pattern)
├── sentiment-agent.ts   # Agent with trace capture
├── index.ts             # Evaluation runner
└── evaluators/
    └── index.ts         # 3 evaluators implemented
```

## Authentication Setup

Copy `.env.example` to `.env` (required in all environments):
```bash
cp .env.example .env
```

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-12-evaluating-agents/exercise/solution)
npm install
npm start    # Run sentiment agent with evaluations
```

## Evaluators Implemented

| Evaluator | What It Checks | Scoring |
|-----------|----------------|---------|
| **Tool Call** | Agent called `analyze_sentiment` with text param | 0-1 based on correctness |
| **Schema Validity** | Output matches SentimentAnalysisSchema | 0-1 based on field validity |
| **Accuracy** | Detected sentiment matches expected | 1=match, 0.5=neutral, 0=opposite |

## Key Patterns

### Agent Trace Capture
```typescript
export interface AgentTrace {
  toolCalls: Array<{ name: string; input: Record<string, unknown> }>;
  result: SentimentAnalysis | null;
}
```

### Evaluator Structure
```typescript
export interface EvaluatorResult {
  name: string;
  passed: boolean;
  score: number; // 0 to 1
  details: string;
}
```

### Running Evaluators
```typescript
const report = runEvaluators(trace, testCase);
// report.overallPassed, report.overallScore
```
