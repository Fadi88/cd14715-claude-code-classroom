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

In Vocareum workspace, `ANTHROPIC_API_KEY` is already set in your environment.

For local development, create `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from https://console.anthropic.com

## Run

```bash
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

