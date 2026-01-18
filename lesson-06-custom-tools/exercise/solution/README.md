# Exercise: Custom Tools - API Validator

Build a custom tool that validates API responses and checks SLA compliance.

## Scenario

Your engineering team needs to validate that API responses match expected schemas, measure latency, and detect breaking changes. Build a custom MCP tool for API validation.

## Project Structure

```
src/
├── api-validator.ts       # Exported tool (deliverable)
├── api-validator.test.ts  # Unit tests (no API calls)
└── index.ts               # Agent integration tests
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

## Deliverable: api-validator.ts

```typescript
export interface ValidationResult {
  success: boolean;
  statusCode: number;
  latencyMs: number;
  schemaValid: boolean;
  schemaErrors: string[] | null;
  performanceIssues: {
    exceedsSLA: boolean;
    slaThresholdMs: number;
    actualLatencyMs: number;
  };
  breakingChanges: string[] | null;
  warnings: string[];
}

export const apiValidatorServer: SdkMcpServer;
```

## Tool Schema

```typescript
const validateApiSchema = {
  apiUrl: z.url(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  expectedFields: z.array(z.string()),
  maxLatencyMs: z.number().positive(),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.string().optional(),
};
```

## Validation Checks

| Check | Description |
|-------|-------------|
| Status Code | 2xx = success |
| Expected Fields | Breaking change if missing |
| Extra Fields | Warning for data leakage |
| Latency | Compare against SLA threshold |

## Usage with Agent

```typescript
for await (const message of query({
  prompt: "Validate the API at ...",
  options: {
    mcpServers: {
      "api-validator": apiValidatorServer,
    },
    allowedTools: ["mcp__api-validator__validate_api_response"],
  },
})) { ... }
```

## Unit Testing (Best Practice)

Always unit test your tool's business logic separately from agent integration:

```bash
# Run unit tests (no API calls, fast)
npm run test:unit

# Run agent integration tests (requires API key)
npm run test
```

The `validateApiResponse` function is exported separately so it can be tested without running the agent. See `api-validator.test.ts` for comprehensive unit tests covering:
- Successful responses with all expected fields
- Missing fields (breaking changes)
- Extra fields (warnings)
- HTTP errors (404, 500)
- SLA violations
- Network errors
- Invalid JSON responses

## Key Takeaway

Custom tools extend agent capabilities with domain-specific logic. Use `createSdkMcpServer` and `tool()` helper to create MCP-compatible tools that agents can use. **Extract business logic into testable functions** for fast, API-free testing during development.

