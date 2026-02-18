# Exercise: Claude Model Selection

Practice selecting Haiku, Sonnet, and Opus based on task complexity.

## Scenario

A support team handles thousands of tickets daily:
- Simple questions → fast, cheap processing
- Complex issues → deeper analysis

## Project Structure

```
src/
├── index.ts          # Main exercise (4 steps)
├── models.ts         # Model definitions & pricing
└── sample-tickets.ts # Test data
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment.

For local development, copy `.env.example` to `.env` and uncomment your credentials:
```bash
cp .env.example .env
```

**Troubleshooting:**
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-01-model-selection/exercise/solution)
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

