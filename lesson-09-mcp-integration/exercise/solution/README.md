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

Choose **one** authentication method:

### Option 1: AWS Bedrock (Recommended for Vocareum)

Create `.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_SESSION_TOKEN=your-session-token
CLAUDE_CODE_USE_BEDROCK=1
ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0
```

Copy AWS credentials from your Vocareum workspace.

### Option 2: Direct Anthropic API

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
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

## Key Pattern: Using ESLint MCP

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
  },
})) { ... }
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

ESLint MCP enables automated code quality analysis. Pass the file path to the agent, it uses `mcp__eslint__lint` to analyze the file, and returns a structured report with issues, scores, and recommendations.

