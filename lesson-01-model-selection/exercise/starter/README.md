# Exercise: Claude Model Selection - Support Ticket Classifier

## Objective
Build a support ticket classification system that intelligently routes requests to different Claude models based on complexity.

## Learning Goals
- Understand when to use Haiku vs Sonnet vs Opus
- Compare model performance, cost, and latency trade-offs
- Implement intelligent model routing based on task complexity

## Your Tasks

Complete the `classifier.ts` file by implementing the four test functions:

### Step 1: Haiku for Simple Classification
- Implement `testHaiku()` function
- Use Haiku model for fast, simple priority classification
- Classification only: "LOW", "MEDIUM", "HIGH", or "URGENT"

### Step 2: Sonnet for Detailed Analysis
- Implement `testSonnet()` function
- Use Sonnet for balanced quality/cost analysis
- Extract: priority, category, details, recommended action

### Step 3: Opus for Complex Reasoning
- Implement `testOpus()` function
- Use Opus for multi-factor reasoning
- Provide: summary, root cause, impact assessment, action plan

### Step 4: Compare Models
- Implement `testCompare()` function
- Run all three models on the same moderate ticket
- Compare time, tokens, and cost using the `displayComparison()` helper

## Setup

```bash
# From repo root
npm install --workspace lesson-01-model-selection/exercise/starter

# Copy environment file
cd lesson-01-model-selection/exercise/starter
cp .env.example .env

# Add your Anthropic API key if worrking locally to .env:
# ANTHROPIC_API_KEY=your-api-key-here
# IMPORTANT: This is already set up in Vocareum workspace
```

## Run

```bash
npm start
```

## Success Criteria

- [ ] Step 1 completes with Haiku model
- [ ] Step 2 completes with Sonnet model
- [ ] Step 3 completes with Opus model
- [ ] Step 4 shows comparison table
- [ ] Cost calculations are accurate
- [ ] Timing measurements are shown

## Model Guide

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| **Haiku** | Simple classification, extraction | Fast | Low |
| **Sonnet** | Balanced analysis, most common tasks | Medium | Medium |
| **Opus** | Complex reasoning, multi-factor analysis | Slower | Higher |

## Helper Functions

The `helpers.ts` file provides three utility functions:
- `calculateCost()` - Calculate API call cost from token usage
- `logStats()` - Display time, tokens, and cost for a single result
- `displayComparison()` - Display comparison table for multiple model results

## Hints

1. Use the `callClaude()` helper function to make API calls
2. Use `logStats()` to display individual test results
3. Use `displayComparison()` to show the model comparison table
4. Check `models.ts` for model IDs and pricing
5. Check `sample-tickets.ts` for test data
6. Follow the system prompts in comments for each step
7. The solution demonstrates proper model selection patterns

## Next Steps

After completing this exercise, try:
- Adding your own ticket types
- Experimenting with different system prompts
- Measuring quality differences between models
- Implementing automatic model selection based on ticket analysis
