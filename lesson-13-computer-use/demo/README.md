# Lesson 13 Demo: Computer Use Capabilities

This demo introduces Claude's computer use feature for GUI automation, covering the architecture, safety considerations, and implementation patterns.

## Learning Objectives

- Understand computer use architecture and the screenshot-action loop
- Learn safety requirements including sandboxing and access controls
- See how to configure the computer use tool with the Anthropic SDK
- Explore coordinate scaling for different display resolutions

## Key Concepts

### Computer Use Architecture

Claude's computer use works through a visual feedback loop:

1. **Screenshot** - Claude receives a screenshot of the virtual display
2. **Analysis** - Claude identifies UI elements and determines actions
3. **Action** - Claude returns pixel coordinates for mouse/keyboard actions
4. **Execution** - Actions are executed in the sandboxed environment
5. **Repeat** - New screenshot taken to verify and continue

### Available Actions

| Action | Description | Parameters |
|--------|-------------|------------|
| `screenshot` | Capture current display | None |
| `left_click` | Single left click | `coordinate: [x, y]` |
| `right_click` | Right click | `coordinate: [x, y]` |
| `double_click` | Double click | `coordinate: [x, y]` |
| `middle_click` | Middle button click | `coordinate: [x, y]` |
| `mouse_move` | Move cursor | `coordinate: [x, y]` |
| `type` | Type text | `text: string` |
| `key` | Press key/combo | `text: "ctrl+s"` |
| `scroll` | Scroll at position | `coordinate`, `direction`, `amount` |
| `left_click_drag` | Drag operation | `startCoordinate`, `endCoordinate` |
| `wait` | Pause execution | `duration: number` (seconds) |

### Safety Requirements

Computer use requires strict sandboxing:

```typescript
const DEFAULT_SAFETY_CONFIG = {
  useVirtualMachine: true,    // Run in VM
  useDocker: true,            // Or Docker container
  maxActionsPerSession: 100,  // Limit actions
  requireConfirmationFor: ["login", "payment", "delete", "submit"],
  logAllActions: true,        // Audit trail
  screenshotOnError: true,    // Debug captures
};
```

### Display Configuration

For optimal performance, keep display resolution within limits:
- Maximum 1568 pixels on longest edge
- Maximum 1,150,000 total pixels
- Use scaling for high-resolution displays

## Running the Demo

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run the demo
npm start
```

## Code Structure

```
src/
├── index.ts              # Demo entry point
├── types.ts              # Action types and tool definitions
├── action-handlers.ts    # Mock action implementations
└── computer-use-client.ts # Agent loop and tool configuration
```

## Tool Configuration

```typescript
// Computer use tool definition
const computerTool = {
  type: "computer_20250124",
  name: "computer",
  display_width_px: 1024,
  display_height_px: 768,
  display_number: 1,
};

// API call with computer use beta
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  tools: [computerTool, bashTool, textEditorTool],
  messages,
  betas: ["computer-use-2025-01-24"],
});
```

## Production Considerations

This demo uses mock implementations. For production:

1. **Use the official quickstart**: https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo
2. **Run in Docker** with Xvfb virtual display
3. **Implement actual action handlers** using xdotool or similar
4. **Add network restrictions** to limit accessible domains
5. **Enable comprehensive logging** for security audits

## Related Resources

- [Computer Use Documentation](https://docs.anthropic.com/en/docs/agents-and-tools/computer-use)
- [Computer Use Quickstart](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)
- [OSWorld Benchmark](https://os-world.github.io/)
