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

## Setup

In Vocareum workspace, `ANTHROPIC_API_KEY` is already set.

For local development, create `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Run

```bash
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
