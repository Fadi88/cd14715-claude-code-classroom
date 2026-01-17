# Exercise: Extended Thinking for Fraud Detection

## Objective
Build a fraud detection analyzer that uses Claude's extended thinking feature to capture reasoning trails for compliance audits.

## Learning Goals
- Enable and configure extended thinking with budget_tokens
- Extract thinking blocks from API responses
- Distinguish between "thinking" and "text" content blocks
- Capture reasoning trails for audit purposes

## Your Task

Complete the `fraud-analyzer.ts` file by implementing the `analyzeFraudRisk()` function:

### Step 1: Configure Extended Thinking
- Enable extended thinking 
- Set `max_tokens: 16000` (must be larger than budget_tokens)
- Use the model from environment variable

### Step 2: Build the Analysis Prompt
- Include transaction details (amount, merchant, location, time)
- Include customer history (typical amount, location, account age, flags)
- Ask for fraud analysis with risk level and recommendation

### Step 3: Extract Content Blocks
- Loop through `response.content`
- Capture `thinking` blocks 
- Capture `text` block as the analysis

## Setup

```bash
# From repo root
npm install --workspace lesson-02-extended-thinking/exercise/starter

# Copy environment file
cd lesson-02-extended-thinking/exercise/starter
cp .env.example .env

# Configure .env (already set in Vocareum):
# ANTHROPIC_API_KEY=your-api-key-here
# ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

## Run

```bash
npm start
```

## Success Criteria

- [ ] Extended thinking is enabled with budget_tokens
- [ ] Thinking steps are extracted from response.content
- [ ] Analysis text is captured from text blocks
- [ ] All 5 transactions are analyzed successfully
- [ ] Thinking steps count > 0 for each transaction

## Extended Thinking API Reference

| Parameter | Value | Description |
|-----------|-------|-------------|
| `thinking.type` | `"enabled"` | Enables extended thinking |
| `thinking.budget_tokens` | `10000` | Max tokens for thinking (These are billable at standard output rates) |
| `max_tokens` | `16000` | Must be > budget_tokens |



## Hints

1. Extended thinking requires `max_tokens` > `budget_tokens`
2. Use template literals to build the prompt with transaction data
3. Check `sample-transactions.ts` for the Transaction interface
5. The test runner (`index.ts`) validates your implementation


## Next Steps

After completing this exercise, try:
- Adjusting `budget_tokens` to see how it affects reasoning depth
- Adding more detailed prompts for specific fraud patterns
- Comparing thinking output between different transaction types
