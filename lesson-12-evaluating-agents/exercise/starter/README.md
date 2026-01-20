# Exercise: Evaluating Agentic Systems - Sentiment Analysis

**Estimated Time: 15 minutes**

## Overview

Build evaluators to assess a sentiment analysis agent. The agent and tool are provided - your task is to implement three evaluators that verify the agent's behavior.

## Architecture

```
src/
├── sentiment-tool.ts    # Custom MCP tool (provided)
├── types.ts             # Zod schemas + test cases (provided)
├── sentiment-agent.ts   # Agent with trace capture (provided)
├── index.ts             # Evaluation runner (provided)
└── evaluators/
    └── index.ts         # YOUR IMPLEMENTATION
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
npm start    # Runs agent + evaluations (will show "Not implemented" until you complete the TODOs)
```

## Your Tasks

Implement three evaluators in `src/evaluators/index.ts`:

### 1. Tool Call Evaluator
Verify the agent called the correct tool with proper parameters.
- Check if `mcp__sentiment-analyzer__analyze_sentiment` was called
- Verify the `text` parameter was provided

### 2. Schema Validity Evaluator
Verify the output matches the Zod schema.
- Use `SentimentAnalysisSchema.safeParse()` to validate
- Check all required fields: text, sentiment, confidence, keywords, explanation

### 3. Accuracy Evaluator
Verify the detected sentiment matches the expected value.
- Compare `result.sentiment` with `testCase.expectedSentiment`
- Give partial credit for "neutral" when expecting positive/negative

## Evaluator Interface

Each evaluator returns:
```typescript
interface EvaluatorResult {
  name: string;      // e.g., "Tool Call Evaluator"
  passed: boolean;   // true if all checks pass
  score: number;     // 0 to 1 (partial credit possible)
  details: string;   // human-readable explanation
}
```

## Test Cases

| Text | Expected Sentiment |
|------|-------------------|
| "I absolutely love this product!" | positive |
| "This is terrible. Complete waste." | negative |
| "The product arrived on time." | neutral |
| "Amazing quality! Highly recommend!" | positive |
| "Broke after one day." | negative |

## Success Criteria

When your evaluators are complete:
- All 5 test cases should run
- Tool Call Evaluator should pass for each
- Schema Validity Evaluator should pass for each
- Accuracy Evaluator should pass for each (agent correctly classifies sentiment)
