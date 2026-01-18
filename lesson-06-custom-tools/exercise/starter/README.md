# Exercise: Custom Tools - API Validator

## Objective

Build a custom MCP tool that validates API responses, measures latency, and checks for SLA compliance.

## Learning Goals

- Create custom tools using `createSdkMcpServer` and `tool()` helper
- Define tool schemas with Zod for input validation
- Make HTTP requests with `fetch()` and handle errors
- Return structured results from custom tools
- Understand the `mcp__<server>__<tool>` naming convention

## Scenario

Your engineering team needs to validate that API responses match expected schemas, measure latency, and detect breaking changes. Build a custom MCP tool that an agent can use to perform these validations automatically.

## Your Tasks

Complete the `api-validator.ts` file by implementing the validation logic and tool server.

### Step 1: Create Fetch Options

Build the `fetchOptions` object for the HTTP request:
- Set the HTTP method
- Merge default headers with optional custom headers
- Include body only for POST/PUT requests

### Step 2: Make the HTTP Request

Use `fetch()` to call the API:
- Capture the response and status code
- Calculate latency (time between start and response)

### Step 3: Parse Response JSON

Safely parse the response body:
- Use try/catch around `response.json()`
- Track parsing errors in `schemaErrors`

### Step 4: Check Expected Fields

Validate that all expected fields exist:
- Compare response fields against expected fields
- Missing fields are "breaking changes"

### Step 5: Detect Extra Fields

Find unexpected fields in the response:
- Fields not in `expectedFields` are potential data leakage
- Add these as warnings

### Step 6: Validate Status Code

Check HTTP status code:
- 2xx codes are success
- Other codes are errors

### Step 7: Check SLA Performance

Compare actual latency against threshold:
- If latency exceeds `maxLatencyMs`, it's an SLA violation
- Add warning for SLA violations

### Step 8: Return ValidationResult

Build and return the complete result object with all validation findings.

### Step 9: Handle Network Errors

Catch and handle fetch failures:
- Return appropriate error information
- Include helpful warning messages

### Step 10: Create the Tool Server

Wire up the validation function as an MCP tool:
- Use `createSdkMcpServer` to create the server
- Use `tool()` helper to define the tool
- Export as `apiValidatorServer`

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Create `.env` (copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Anthropic API key if working locally:
```
ANTHROPIC_API_KEY=your-key-here
```

**IMPORTANT**: This is already set up in Vocareum workspace.

## Run

```bash
npm start
```

## Success Criteria

- [ ] Tool server exports `apiValidatorServer`
- [ ] Tool validates API responses successfully
- [ ] Missing expected fields detected as breaking changes
- [ ] Extra fields detected as warnings
- [ ] HTTP errors properly reported
- [ ] SLA violations detected when latency exceeds threshold
- [ ] Network errors handled gracefully
- [ ] All three tests pass

## Project Structure

```
src/
├── api-validator.ts  # YOUR IMPLEMENTATION (deliverable)
└── index.ts          # Agent integration tests (complete - do not modify)
```

## Deliverable Interface

Your `api-validator.ts` must export:

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

## Tool Schema Reference

The tool accepts these parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiUrl` | URL | The API endpoint to validate |
| `method` | enum | HTTP method (GET, POST, PUT, DELETE) |
| `expectedFields` | string[] | Fields that must exist in response |
| `maxLatencyMs` | number | SLA threshold in milliseconds |
| `headers` | object | Optional custom headers |
| `body` | string | Optional request body for POST/PUT |

## Validation Checks

| Check | Result Field | Description |
|-------|--------------|-------------|
| Status Code | `success`, `schemaErrors` | 2xx = success |
| Expected Fields | `breakingChanges` | Missing = breaking change |
| Extra Fields | `warnings` | Unexpected = data leakage warning |
| Latency | `performanceIssues` | Compare against SLA threshold |

## Hints

1. Use `Date.now()` before and after fetch to measure latency
2. Check `response.ok` or status code range for HTTP success
3. Use `Object.keys(responseData)` to get actual response fields
4. Remember to handle both HTTP errors and network errors differently
5. The tool handler must return `{ content: [{ type: "text", text: "..." }] }`
6. Use `JSON.stringify(result, null, 2)` for readable output
7. Check the demo's `tax-calculator.ts` for implementation patterns

## Key Patterns from Demo

```typescript
// Creating a tool server
export const myServer = createSdkMcpServer({
  name: "server-name",
  version: "1.0.0",
  tools: [
    tool(
      "tool_name",
      "Tool description",
      { param: z.string() },  // Zod schema
      async (args) => ({
        content: [{ type: "text", text: JSON.stringify(result) }]
      })
    )
  ]
});
```

## Bonus: Unit Testing Your Tool

**Best Practice**: Extract your validation logic into a separate exported function so you can unit test it without running the agent:

```typescript
// Export the validation function for testing
export async function validateApiResponse(...): Promise<ValidationResult> {
  // Your validation logic here
}

// Tool handler calls the exported function
tool("validate_api_response", "...", schema, async (args) => {
  const result = await validateApiResponse(...);
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});
```

Then create `api-validator.test.ts` to test your validation logic directly:

```bash
# Run unit tests (no API calls, fast iteration)
npm run test:unit

# Run agent integration tests (requires API key)
npm run test
```

See the solution for comprehensive unit test examples.

## Next Steps

After completing this exercise:
- Add support for response body validation against JSON Schema
- Implement retry logic for transient failures
- Add support for authentication (API keys, OAuth tokens)
- Create additional tools in the same server (e.g., health check, load test)
