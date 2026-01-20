# Demo: Evaluating Agentic Systems - Tip Calculator

**Estimated Time: 10 minutes**

## Overview

Demonstrates how to evaluate an agent using three evaluators:
1. **Tool Call Evaluator** - Verify the agent called the correct tool with correct parameters
2. **Schema Validity Evaluator** - Verify output matches the Zod schema
3. **Calculation Accuracy Evaluator** - Verify the math is correct

## Architecture

```
src/
├── tip-calculator.ts    # Custom MCP tool (Lesson 6 pattern)
├── types.ts             # Zod schemas + test cases (Lesson 7 pattern)
├── tip-agent.ts         # Agent with trace capture
├── index.ts             # Evaluation runner
└── evaluators/
    └── index.ts         # 3 evaluators
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
npm start    # Run tip calculator agent with evaluations
```

## Key Concepts

### Agent Trace Capture

The agent captures tool calls and results for evaluation:

```typescript
export interface AgentTrace {
  toolCalls: Array<{ name: string; input: Record<string, unknown> }>;
  result: TipAnalysis | null;
}
```

### Evaluator Structure

Each evaluator returns a standardized result:

```typescript
interface EvaluatorResult {
  name: string;      // Evaluator name
  passed: boolean;   // Did it pass?
  score: number;     // 0 to 1 (partial credit)
  details: string;   // Human-readable explanation
}
```

### Running Evaluators

```typescript
const trace = await analyzeTip(bill, tip, split);
const report = runEvaluators(trace, testCase);

console.log(`Overall Score: ${report.overallScore * 100}%`);
console.log(`All Passed: ${report.overallPassed}`);
```

## Evaluators Explained

| Evaluator | What It Checks | Partial Scores |
|-----------|----------------|----------------|
| **Tool Call** | Correct tool + parameters | 0.25=wrong tool, 0.5=missing params, 0.75=wrong values |
| **Schema Validity** | All Zod fields valid | Score = valid fields / total fields |
| **Calculation Accuracy** | tip, total, perPerson match expected | Score = correct calcs / 3 |

## Test Cases

| Bill | Tip % | Split | Expected Tip | Expected Total |
|------|-------|-------|--------------|----------------|
| $50 | 15% | 1 | $7.50 | $57.50 |
| $120 | 20% | 4 | $24.00 | $144.00 |
| $85.50 | 18% | 2 | $15.39 | $100.89 |

## Key Takeaway

Evaluators enable systematic assessment of agent behavior. By capturing traces (tool calls + outputs), you can verify:
- The agent uses tools correctly
- Outputs conform to schemas
- Results are accurate

This pattern scales to any agent - define test cases, capture traces, and run evaluators.
