# Exercise: Extended Thinking for Fraud Detection

Practice using extended thinking for compliance-grade fraud analysis.

## Scenario

A fintech company's fraud detection system flags transactions. Compliance officers need clear reasoning to approve or reject them, and regulators require audit trails.

## Project Structure

```
src/
├── fraud-analyzer.ts      # Deliverable: exported function
├── sample-transactions.ts # 5 test transactions
└── index.ts               # Tests for the deliverable
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
# From this directory (lesson-02-extended-thinking/exercise/solution)
npm start
```

## Deliverable: fraud-analyzer.ts


export async function analyzeFraudRisk(
  transaction: Transaction
): Promise<FraudAnalysis>
```

## Tests (index.ts)

| Step | Description |
|------|-------------|
| 1 | Baseline: analysis WITHOUT extended thinking |
| 2 | Test `analyzeFraudRisk()` on obvious fraud |
| 3 | Test audit trail extraction for compliance |
| 4 | Test all 5 transactions |

## 5 Test Transactions

| Transaction | Expected Risk | Reason |
|-------------|---------------|--------|
| legitimate_large | Low | Loyal customer, normal location |
| obvious_fraud | Critical | Foreign location, unusual hours, flagged account |
| ambiguous_case | Medium | Travel purchase, requires judgment |
| velocity_abuse | High | Gift cards, late night, previous flag |
| first_time_buyer | Medium | New account, high-value electronics |

## Key Takeaway

Extended thinking provides transparent reasoning for high-stakes decisions. The audit trail helps compliance teams defend decisions to regulators.

