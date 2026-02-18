# Exercise: MCP Integration - Code Quality Reviewer

Analyze JavaScript files for code quality using ESLint MCP.

## Scenario

Your development team submits code for review, but manual code quality checks are inconsistent. Build an agent that uses the ESLint MCP server to analyze JavaScript files and provide detailed quality reports.

## Project Structure

```
exercise/
├── src/
│   ├── config/
│   │   └── mcp.config.ts       # ESLint MCP configuration
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   ├── issues.js           # Code with common issues
│   │   └── errors.js           # Code with multiple errors
│   ├── sample-code.ts          # File paths
│   ├── code-reviewer.ts        # Exported function (deliverable)
│   └── index.ts                # Test
└── README.md
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

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL` and `GITHUB_TOKEN`.

For local development, also uncomment and fill in your credentials in `.env`:
```
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_BASE_URL=your-base-url-here
```

**Troubleshooting:**
- **`Error: ANTHROPIC_MODEL is not set`** — make sure you ran `cp .env.example .env`
- **`Error: API key not found`** — in Vocareum this is pre-configured; locally, set `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` in `.env`

## Run

```bash
# From this directory (lesson-09-mcp-integration/exercise/solution)
npm start
```

## Deliverable: code-reviewer.ts

```typescript
export async function reviewCodeFile(
  filePath: string
): Promise<CodeQualityReport>
```

## Key Pattern: MCP + Structured Output

```typescript
for await (const message of query({
  prompt: `Analyze the JavaScript file at: ${filePath}`,
  options: {
    mcpServers: {
      eslint: {
        type: "stdio",
        command: "npx",
        args: ["-y", "@eslint/mcp@latest"],
      },
    },
    allowedTools: ["mcp__eslint__lint", "Read"],
    // Structured output with Zod schema
    outputFormat: {
      type: "json_schema",
      schema: CodeQualityReportJSONSchema,
    },
  },
})) {
  if (message.type === "result" && message.structured_output) {
    return CodeQualityReportSchema.parse(message.structured_output);
  }
}
```

## Sample Code Files

| File | Description | Expected Issues |
|------|-------------|-----------------|
| clean.js | Well-written code | None |
| issues.js | Common issues | no-var, no-eval, no-console |
| errors.js | Multiple errors | no-var, no-cond-assign |

## MCP Tool

| Tool | Description |
|------|-------------|
| `mcp__eslint__lint` | Lint JavaScript files using ESLint |

## Key Takeaway

ESLint MCP enables automated code quality analysis. Pass the file path to the agent, it uses `mcp__eslint__lint` to analyze the file, and returns a type-safe structured report via `outputFormat` and Zod validation.

