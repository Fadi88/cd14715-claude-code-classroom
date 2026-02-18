# Exercise: Multi-Agent Orchestration - Sales Opportunity Qualifier

Coordinate specialized subagents for comprehensive sales qualification.

## Objective

Complete `src/sales-qualifier.ts` to implement `qualifyOpportunity()`, which uses an orchestrator agent to coordinate three specialized subagents (researcher, analyzer, scorer) and produce a structured sales briefing.

## Learning Goals

- Define subagents with `AgentDefinition` (description, prompt, tools, model)
- Use the async generator input mode for streaming compatibility
- Give the orchestrator `Task` in `allowedTools` to invoke subagents
- Combine multi-agent output with structured outputs via Zod

## Project Structure

```
src/
├── sales-qualifier.ts    # YOUR IMPLEMENTATION (has TODOs)
├── sample-prospects.ts   # Test data (provided)
└── index.ts              # Test runner (do not modify)
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

Complete the four TODOs in `src/sales-qualifier.ts`:

### TODO 1: Implement `generateMessages()` async generator

Required for streaming compatibility with subagents:

```typescript
async function* generateMessages(userMessage: string) {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: userMessage },
    parent_tool_use_id: null,
    session_id: "sales-qualifier-session",
  };
}
```

### TODO 2: Fill in the subagent definitions

Each subagent in the `subagents` object needs a `description` and `prompt`. The structure is already in place — add meaningful values:

```typescript
"company-researcher": {
  description: "Research specialist that gathers company intelligence",
  prompt: "You are a company research specialist. Gather: company size, industry, tech stack, recent news, estimated revenue.",
  tools: ["WebSearch"],
  model: "sonnet",
},
```

Do the same for `"competitive-analyzer"` and `"qualification-scorer"`.

### TODO 3: Call `query()` with subagents

Use the orchestrator prompt and register the subagents:

```typescript
for await (const message of query({
  prompt: generateMessages(orchestratorPrompt),
  options: {
    allowedTools: ["Task"],
    agents: subagents,
    model: "sonnet",
    outputFormat: {
      type: "json_schema",
      schema: SalesBriefingJSONSchema,
    },
    maxTurns: 15,
  },
})) {
  // handle messages (TODO 4)
}
```

### TODO 4: Handle the message stream

```typescript
// Log Task invocations
if (message.type === "assistant") {
  const content = message.message?.content;
  if (Array.isArray(content)) {
    for (const block of content) {
      if (block.type === "tool_use" && block.name === "Task") {
        console.log(`[Subagent]: ${JSON.stringify(block.input)}`);
      }
    }
  }
}

// Return structured result
if (message.type === "result" && message.subtype === "success" && message.structured_output) {
  return SalesBriefingSchema.parse(message.structured_output);
}
```

## Run

```bash
# From this directory (lesson-10-multi-agent-orchestration/exercise/starter)
npm start
```

## Success Criteria

- [ ] All 3 sample prospects are qualified (TechCorp, GrowthStartup, LocalBiz)
- [ ] Each briefing includes `companyProfile`, `competitiveAnalysis`, `qualification`, `recommendation`, `talkingPoints`
- [ ] Task tool invocations are logged showing subagent calls
- [ ] TechCorp → "Pursue", GrowthStartup → "Nurture" or "Pursue", LocalBiz → "Pursue"

## Architecture

```
qualifyOpportunity(company, contact)
     ↓
ORCHESTRATOR (allowedTools: ["Task"])
     ↓
     ├─→ company-researcher (WebSearch) ─→ Profile ──┐
     ├─→ competitive-analyzer ───────────→ Position ─┤
     └─→ qualification-scorer ───────────→ BANT ─────┤
                                                      ↓
                                                SALES BRIEFING
```

## Key Takeaway

The `agents` parameter registers subagents, and `Task` in `allowedTools` lets the orchestrator invoke them. Each subagent runs independently with its own tools and model — the orchestrator coordinates their outputs into a final result.
