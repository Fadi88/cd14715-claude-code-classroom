# Exercise: MCP Integration - Code Quality Reviewer

Analyze JavaScript files for code quality using ESLint MCP.

## Objective

Complete `src/code-reviewer.ts` to implement `reviewCodeFile()`, which uses the ESLint MCP server to lint JavaScript files and return a structured quality report.

## Learning Goals

- Configure and connect to an MCP server in the Agent SDK
- Use the async generator input mode required for MCP/streaming
- Handle MCP server connection status from `init` messages
- Return structured output using Zod schemas

## Project Structure

```
src/
├── config/
│   └── mcp.config.ts       # ESLint MCP configuration (provided)
├── sample-code/
│   ├── clean.js            # Well-written code
│   ├── issues.js           # Code with common issues
│   └── errors.js           # Code with multiple errors
├── sample-code.ts          # File paths (provided)
├── code-reviewer.ts        # YOUR IMPLEMENTATION (has TODOs)
└── index.ts                # Test runner (do not modify)
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
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

## Your Tasks

Complete the three TODOs in `src/code-reviewer.ts`:

### TODO 1: Implement `generateMessages()` async generator

MCP servers require streaming input mode. Implement the generator:

```typescript
async function* generateMessages(userMessage: string) {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: userMessage },
    parent_tool_use_id: null,
    session_id: "code-review-session",
  };
}
```

### TODO 2: Call `query()` with MCP configuration

Use the imported `mcpServersConfig` and `eslintTools` from `mcp.config.ts`:

```typescript
for await (const message of query({
  prompt: generateMessages(userMessage),
  options: {
    mcpServers: mcpServersConfig,
    model,
    allowedTools: [...eslintTools, 'Read'],
    outputFormat: {
      type: "json_schema",
      schema: CodeQualityReportJSONSchema,
    },
  },
})) {
  // handle messages (TODO 3)
}
```

### TODO 3: Handle the message stream

Check for three message types:

```typescript
// 1. MCP server connection status
if (message.type === "init") {
  // check mcpServers connection status, throw if "failed"
}

// 2. Tool use logging
if (message.type === "assistant") {
  // log tool_use blocks for visibility
}

// 3. Structured result
if (message.type === "result" && message.subtype === "success" && message.structured_output) {
  return CodeQualityReportSchema.parse(message.structured_output);
}
```

## Run

```bash
# From this directory (lesson-09-mcp-integration/exercise/starter)
npm start
```

## Success Criteria

- [ ] All 3 sample files are analyzed (clean.js, issues.js, errors.js)
- [ ] `clean.js` gets a high quality score (80+)
- [ ] `issues.js` and `errors.js` have issues detected with correct severity
- [ ] Each report includes `filename`, `qualityScore`, `issues`, `summary`, `categories`, `recommendations`
- [ ] MCP server connection confirmed before analysis

## MCP Tool

| Tool | Description |
|------|-------------|
| `mcp__eslint__lint` | Lint JavaScript files using ESLint |

## Key Takeaway

MCP servers connect agents to external tools via a standardized protocol. Use the async generator input mode for streaming compatibility, check the `init` message for server status, and combine with `outputFormat` for type-safe structured results.
