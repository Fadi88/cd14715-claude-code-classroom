# Demo: Claude Model Selection

Learn when to use Haiku, Sonnet, and Opus based on task complexity.

## Scenario

A weather notification service processes thousands of alerts daily:
- Simple updates → fast, cheap processing
- Severe warnings → deeper analysis

## Project Structure

```
src/
├── index.ts        # Main demo (4 steps)
├── models.ts       # Model definitions & pricing
└── sample-alerts.ts # Test data
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — no setup needed.

For local development:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and fill in your API key and base URL

**Troubleshooting:**
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-01-model-selection/demo)
npm start
```

## What You'll See

| Step | Model | Task |
|------|-------|------|
| 1 | Haiku | Simple classification |
| 2 | Sonnet | Detailed analysis |
| 3 | Opus | Complex reasoning |
| 4 | All | Side-by-side comparison |

## Key Takeaway

| Model | Best For | Cost |
|-------|----------|------|
| Haiku | Classification, routing, yes/no | Lowest |
| Sonnet | Most production work | Balanced |
| Opus | Complex, multi-step reasoning | Highest |

Smart model routing can reduce costs by 80%+!

