# Lesson 13 Exercise: Form Automation Agent

In this exercise, you'll implement a form automation agent using Claude's computer use capabilities. The agent will fill out a web form by clicking fields, typing text, and submitting the form.

## Learning Objectives

- Configure the computer use tool with proper type and dimensions
- Implement the agent loop for GUI automation
- Handle different tool result types (screenshots vs text)
- Apply the conversation pattern for multi-turn tool use

## Your Task

Open `src/form-agent.ts` and implement the following TODOs:

### TODO 1: `createComputerTool()`

Return a `ComputerUseTool` object with:
- `type`: Must be exactly `"computer_20250124"`
- `name`: Must be `"computer"`
- `display_width_px`: Use `DISPLAY_WIDTH` constant
- `display_height_px`: Use `DISPLAY_HEIGHT` constant

### TODO 2: `runFormAutomationAgent()`

Implement the agent loop:

#### TODO 2a: Make the API Call
Call `client.beta.messages.create` with:
```typescript
{
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 4096,
  system: systemPrompt,
  tools: tools as Anthropic.Beta.BetaTool[],
  messages,
  betas: ["computer-use-2025-01-24"],  // Required for computer use!
}
```

#### TODO 2b: Format Tool Results
When processing actions, format the result based on type:

For screenshots (when `result.screenshot` exists):
```typescript
{
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
}
```

For other actions:
```typescript
{
  type: "tool_result",
  tool_use_id: block.id,
  content: result.output || result.error || "Action completed",
  is_error: !result.success,
}
```

#### TODO 2c: Append Messages
Add both the assistant response and tool results to continue the conversation:
```typescript
messages.push({ role: "assistant", content: response.content });
messages.push({ role: "user", content: toolResults });
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run (will show demo mode if no API key)
npm start
```

## Hints

1. The `betas` array is required for computer use - without it, the API won't recognize the computer tool
2. Screenshots must be returned as image content for Claude to "see" the result
3. The agent loop continues until `stop_reason === "end_turn"` or no tool calls are made
4. Always push both the assistant response and tool results to maintain conversation context

## Expected Behavior

When complete, running `npm start` should:
1. Display the configuration
2. Start the agent loop
3. Show each action being executed
4. Report the final result with action count

## Files

```
src/
├── index.ts          # Entry point (no changes needed)
├── form-agent.ts     # YOUR IMPLEMENTATION HERE
├── action-handlers.ts # Pre-built action execution
└── types.ts          # Type definitions
```
