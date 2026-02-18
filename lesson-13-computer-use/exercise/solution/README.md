# Lesson 13 Exercise Solution: Form Automation Agent

This solution demonstrates a complete implementation of a form automation agent using Claude's computer use capabilities.

## What You'll Learn

- How to configure the computer use tool with display dimensions
- The agent loop pattern for GUI automation
- Handling screenshots as visual feedback
- Formatting tool results for image vs text content
- Applying safety configurations

## Solution Overview

The solution implements:

1. **`createComputerTool()`** - Returns the properly configured computer use tool
2. **`runFormAutomationAgent()`** - Implements the full agent loop:
   - Calls Claude with the `computer-use-2025-01-24` beta
   - Processes tool_use blocks to execute GUI actions
   - Returns screenshots as base64 image content
   - Continues until end_turn or action limit reached

## Key Implementation Details

### Computer Use Tool Configuration

```typescript
function createComputerTool(): ComputerUseTool {
  return {
    type: "computer_20250124",
    name: "computer",
    display_width_px: DISPLAY_WIDTH,
    display_height_px: DISPLAY_HEIGHT,
  };
}
```

### API Call with Computer Use Beta

```typescript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 4096,
  system: systemPrompt,
  tools: tools as Anthropic.Beta.BetaTool[],
  messages,
  betas: ["computer-use-2025-01-24"],
});
```

### Screenshot Handling

```typescript
if (result.screenshot) {
  toolResults.push({
    type: "tool_result",
    tool_use_id: block.id,
    content: [{
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: result.screenshot,
      },
    }],
  });
}
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

## Running the Solution

```bash
# From this directory (lesson-13-computer-use/exercise/solution)
# Install dependencies
npm install

# Copy environment file (if not already done)
cp .env.example .env

# Run
npm start
```

## Files

```
src/
├── index.ts          # Entry point and demo runner
├── form-agent.ts     # Complete agent implementation
├── action-handlers.ts # Mock action execution
└── types.ts          # Type definitions
```

## Expected Output

```
╔════════════════════════════════════════════════════════════╗
║    Lesson 13 Exercise: Form Automation with Computer Use   ║
╚════════════════════════════════════════════════════════════╝

CONFIGURATION
--------------------------------------------------
Computer Use Tool:
  Display: 1024x768

Form Data:
  Name: Jane Developer
  Email: jane.developer@example.com
  ...

RUNNING FORM AUTOMATION AGENT
--------------------------------------------------
--- Iteration 1 ---
Action: screenshot
--- Iteration 2 ---
Action: left_click
...

RESULT
==================================================
Success: true
Actions Executed: 15
Form Submitted: true
```
