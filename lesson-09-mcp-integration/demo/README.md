# Demo: MCP Integration - GitHub File Summarizer

Fetch and summarize files from GitHub repositories using MCP.

## Scenario

Your team needs to quickly understand files from various GitHub repositories. Build an agent that uses the GitHub MCP server to fetch file contents and provide summaries.

## Project Structure

```
demo/
├── src/
│   ├── config/
│   │   └── mcp.config.ts       # GitHub MCP configuration
│   ├── github-summarizer.ts    # Exported function (deliverable)
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
GITHUB_TOKEN=ghp_your-github-token
```

Get your API key from https://console.anthropic.com

## Run

```bash
npm start
```

## Deliverable: github-summarizer.ts

```typescript
// Zod schema for structured output
export const GitHubFileSummarySchema = z.object({
  repo: z.string().describe("Repository in format owner/repo"),
  path: z.string().describe("File path within the repository"),
  purpose: z.string().describe("The main purpose of this file"),
  keySections: z.array(z.string()).describe("Key sections or functions"),
  patterns: z.array(z.string()).describe("Notable patterns or techniques"),
  summary: z.string().describe("Brief overall summary"),
});

export type GitHubFileSummary = z.infer<typeof GitHubFileSummarySchema>;

export async function summarizeGitHubFile(
  owner: string,
  repo: string,
  path: string
): Promise<GitHubFileSummary>
```

## Key Pattern: MCP + Structured Output

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Fetch and summarize this file...",
  options: {
    mcpServers: {
      github: {
        type: "http",
        url: "https://api.githubcopilot.com/mcp/",
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      },
    },
    allowedTools: ["mcp__github__*"],
    // Structured output with Zod schema
    outputFormat: {
      type: "json_schema",
      schema: GitHubFileSummaryJSONSchema,
    },
  },
})) {
  if (message.type === "result" && message.structured_output) {
    return GitHubFileSummarySchema.parse(message.structured_output);
  }
}
```

## MCP Tool Naming

Pattern: `mcp__<server-name>__<tool-name>`

| Tool | Description |
|------|-------------|
| `mcp__github__get_file_contents` | Fetch file content from a repo |
| `mcp__github__search_repositories` | Search for repositories |
| `mcp__github__list_commits` | Get commit history |

## Key Takeaway

MCP provides standardized access to external tools. Configure the GitHub MCP server, pass it to `query()` via `mcpServers`, and specify allowed tools with `mcp__` prefix. Combine with `outputFormat` and Zod schemas to get type-safe structured responses.

