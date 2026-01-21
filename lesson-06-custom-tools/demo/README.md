# Demo: Custom Tools - Multiple Tools with External API Integration

Build custom tools for agents using the Claude Agent SDK.

## Scenario

An application needs agents to:
1. Calculate tax amounts and tips with proper decimal precision
2. Fetch real-time weather data from external APIs

We'll build multiple custom tools (`calculate_tax`, `calculate_tip`, and `get_weather`) in a single MCP server using `createSdkMcpServer`, demonstrating both local calculations and external API integration.

## Project Structure

```
src/
├── tax-calculator.ts       # Exported tool (deliverable)
├── tax-calculator.test.ts  # Unit tests (no API calls)
└── index.ts                # Agent integration tests
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Create `.env`:

Add your Anthropic API key if working locally to .env:
```
ANTHROPIC_API_KEY=your-key-here
```
IMPORTANT: This is already set up in Vocareum workspace

## Run

```bash
npm start
```

## Deliverable: tax-calculator.ts

```typescript
export interface TaxResult {
  subtotal: number;
  tax: number;
  total: number;
  effectiveRate: number;
  currency: string;
}

export interface TipResult {
  subtotal: number;
  tipAmount: number;
  total: number;
  tipPercentage: number;
  currency: string;
}

export interface WeatherResult {
  location: {
    latitude: number;
    longitude: number;
  };
  temperature: number;
  temperatureUnit: string;
  time: string;
}

// MCP Server with MULTIPLE tools (local calculations + external API)
export const taxToolServer: SdkMcpServer;
```

## Custom Tool Pattern

### Single Tool Server

```typescript
import { z } from "zod";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

const myToolServer = createSdkMcpServer({
  name: "my-tools",
  version: "1.0.0",
  tools: [
    tool(
      "tool_name",
      "Description of what the tool does",
      { param: z.string().describe("Parameter description") },
      async (args) => ({
        content: [{ type: "text", text: "Result" }],
      })
    ),
  ],
});
```

### Multiple Tools in One Server

```typescript
const multiToolServer = createSdkMcpServer({
  name: "utilities",
  version: "1.0.0",
  tools: [
    tool(
      "calculate",
      "Perform calculations",
      { expression: z.string() },
      async (args) => { /* ... */ }
    ),
    tool(
      "translate",
      "Translate text",
      { text: z.string(), target_lang: z.string() },
      async (args) => { /* ... */ }
    ),
    tool(
      "search_web",
      "Search the web",
      { query: z.string() },
      async (args) => { /* ... */ }
    ),
  ],
});
```

### External API Integration

Tools can call external APIs to fetch real-time data:

```typescript
tool(
  "get_weather",
  "Get current temperature for a location using coordinates",
  {
    latitude: z.number().min(-90).max(90).describe("Latitude coordinate"),
    longitude: z.number().min(-180).max(180).describe("Longitude coordinate")
  },
  async (args) => {
    try {
      // Call external API
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m&temperature_unit=fahrenheit`;

      const response = await fetch(apiUrl);

      // Handle HTTP errors
      if (!response.ok) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: true,
              message: `API error: ${response.status} ${response.statusText}`
            }, null, 2)
          }]
        };
      }

      // Parse and validate response
      const data = await response.json();

      if (!data.current || typeof data.current.temperature_2m !== "number") {
        throw new Error("Invalid API response structure");
      }

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            temperature: data.current.temperature_2m,
            temperatureUnit: "°F",
            location: { latitude: args.latitude, longitude: args.longitude }
          }, null, 2)
        }]
      };
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: true,
              type: "network",
              message: "Unable to connect to weather API"
            }, null, 2)
          }]
        };
      }

      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ error: true, message: errorMessage }, null, 2)
        }]
      };
    }
  }
)
```

**Key Patterns:**
- Use `fetch()` for HTTP requests
- Check `response.ok` for HTTP status codes
- Validate API response structure before using
- Handle network errors (TypeError with "fetch")
- Return structured error messages for debugging
- Use try-catch for comprehensive error handling

## Using Custom Tools

**CRITICAL**: Custom MCP tools require streaming input mode. You MUST use an async generator for the `prompt` parameter - a simple string will not work.

```typescript
// Create async generator for streaming input
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "Your prompt here"
    },
    parent_tool_use_id: null,  // Required: null for normal messages
    session_id: "demo-session"  // Required: unique session identifier
  };
}

for await (const message of query({
  prompt: generateMessages(),  // ✅ Must use async generator
  options: {
    mcpServers: { "my-tools": myToolServer },
    allowedTools: ["mcp__my-tools__tool_name"],
  },
})) {
  // Handle response
}
```

### Using Multiple Tools with Selective Allowance

When your server has multiple tools, you can control which tools the agent can use:

```typescript
for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: { "utilities": multiToolServer },
    // Allow only specific tools - agent CANNOT use search_web
    allowedTools: [
      "mcp__utilities__calculate",   // ✅ Allowed
      "mcp__utilities__translate",   // ✅ Allowed
      // "mcp__utilities__search_web" is NOT in the list, so NOT allowed
    ]
  },
})) {
  // Handle response - agent will choose between calculate and translate
}
```

**Key Points:**
- Tool names follow pattern: `mcp__<server_name>__<tool_name>`
- Agent automatically chooses the most appropriate tool from allowed list
- Omitting a tool from `allowedTools` prevents the agent from using it
- This is useful for security, cost control, or context-specific limitations

## Unit Testing Tools (IMPORTANT)

**Best Practice**: Always unit test your tool's business logic separately from agent integration. This allows:
- Fast iteration during development (no API calls)
- No API costs for testing logic
- Easy debugging of edge cases
- CI/CD pipeline integration

### Architecture for Testability

Extract business logic into separate exported functions that tool handlers call:

```typescript
// ❌ Hard to test - logic embedded in tool handler
tool("calculate_tax", "...", schema, async (args) => {
  // All logic here - can only test via agent
});

// ✅ Easy to test - logic in separate function
export function calculateTax(amount: number, rate: number): TaxResult | ErrorResult {
  // Business logic here - can unit test directly
}

tool("calculate_tax", "...", schema, async (args) => {
  const result = calculateTax(args.amount, args.rate);
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});
```

### Running Unit Tests

```bash
# Run unit tests (no API calls, fast)
npm run test:unit

# Run agent integration tests (requires API key)
npm run test
```

### Example Unit Test

```typescript
import { calculateTax, isError, TaxResult } from "./tax-calculator.js";

// Test business logic directly - no agent needed
test("calculates 8% tax on $100 correctly", () => {
  const result = calculateTax(100, 0.08);
  assertFalse(isError(result));
  const taxResult = result as TaxResult;
  assertEqual(taxResult.tax, 8);
  assertEqual(taxResult.total, 108);
});

// Test error handling
test("returns error for negative amount", () => {
  const result = calculateTax(-100, 0.08);
  assertTrue(isError(result));
  assertTrue(result.message.includes("greater than zero"));
});
```

See `tax-calculator.test.ts` for comprehensive examples.

## Agent Integration Tests (index.ts)

| Test | Description | Demonstrates |
|------|-------------|--------------|
| 1 | Single Tool Usage | Using one tool (calculate_tax) from the server |
| 2 | Multiple Tools | Agent chooses between calculate_tax and calculate_tip based on the task |
| 3 | External API Integration | Fetching real-time weather data from Open-Meteo API with error handling |

## Extended Thinking with Tool Use (Interleaved Thinking)

Combine extended thinking (Lesson 02) with tools (Lesson 06) for transparent reasoning during tool use.

### Run the Demo

```bash
npm run start:thinking
```

### Pattern: Interleaved Thinking

When extended thinking is enabled with tools, Claude reasons before and after tool calls:

```
User: "Calculate tax for $50,000 at 9.3%"
         ↓
[thinking] "I need to calculate the tax. Let me use the calculate_tax tool..."
         ↓
[tool_use] calculate_tax({ amount: 50000, tax_rate: 9.3 })
         ↓ (tool result returned)
[thinking] "The tax calculation shows $4,650. Let me format this clearly..."
         ↓
[text] "The tax on $50,000 at 9.3% is $4,650, for a total of $54,650."
```

### Implementation

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Enable both thinking and tools
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000,
  },
  tools: [{ name: "calculate_tax", input_schema: { ... } }],
  messages: [{ role: "user", content: "Calculate tax for $50,000 income in CA" }],
});

// Response contains interleaved blocks: thinking → tool_use → thinking → text
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log("Claude's reasoning:", block.thinking);
  } else if (block.type === "tool_use") {
    console.log("Tool called:", block.name, block.input);
    // Execute tool and continue conversation
  } else if (block.type === "text") {
    console.log("Final response:", block.text);
  }
}
```

### Preserving Thinking Blocks

**IMPORTANT**: When continuing with tool results, include the thinking block:

```typescript
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: { type: "enabled", budget_tokens: 10000 },
  tools: [calculateTaxTool],
  messages: [
    { role: "user", content: "Calculate tax..." },
    // Include BOTH thinking and tool_use blocks
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{ type: "tool_result", tool_use_id: "...", content: "..." }] },
  ],
});
```

### Use Cases

- **Audit trails**: See exactly why Claude chose specific tools
- **Complex calculations**: Multi-step reasoning with verification
- **Debugging**: Understand tool selection decisions
- **Compliance**: Document AI decision-making process

## Key Takeaways

1. **Multiple Tools**: Create servers with multiple related tools using the `tools` array
2. **Tool Naming**: Tools are exposed as `mcp__<server_name>__<tool_name>` (e.g., `mcp__financial-tools__calculate_tax`)
3. **Selective Allowance**: Use `allowedTools` to control which tools the agent can access
4. **Agent Choice**: When multiple tools are allowed, the agent automatically chooses the most appropriate one
5. **Type Safety**: Zod schemas provide runtime validation and TypeScript type inference
6. **Streaming Input**: Custom MCP tools REQUIRE async generators for the `prompt` parameter
7. **External API Integration**: Tools can call external APIs using `fetch()` with proper error handling
8. **Error Handling**: Handle HTTP errors, network failures, and response validation separately
9. **Real-world Patterns**: Mix local computation tools (tax, tip) with external data tools (weather)
10. **Unit Testing**: Extract business logic into testable functions for fast, API-free testing during development
11. **Interleaved Thinking**: Combine extended thinking with tools to see Claude's reasoning during tool selection and result processing

