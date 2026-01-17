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




Create `.env`:


 Add your Anthropic API key if worrking locally to .env:
```
ANTHROPIC_API_KEY=your-key-here
```
 IMPORTANT: This is already set up in Vocareum workspace

## Run

```bash
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

