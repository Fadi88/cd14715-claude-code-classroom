# Exercise: Claude Agent SDK - Contract Standardizer

Build an agent to standardize vendor contracts for legal review.

## Objective

Implement `standardizeContract()` in `src/contract-standardizer.ts` using the Claude Agent SDK. The agent reads a contract file, extracts key terms, and writes a standardized output file.

## Learning Goals

- Use `query()` from the Claude Agent SDK
- Pass `allowedTools: ["Read", "Write"]` to let the agent read and write files
- Iterate over `query()` results to extract the agent's raw output
- Handle errors from the agent

## Project Structure

```
src/
├── contracts/               # Input contract files
│   ├── saas.txt
│   ├── consulting.txt
│   ├── vendor.txt
│   └── email.txt
├── standardized/            # Output (agent writes here)
├── contract-standardizer.ts # YOUR IMPLEMENTATION (has TODOs)
├── sample-contracts.ts      # Contract file paths
└── index.ts                 # Test runner (do not modify)
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

Complete the three TODOs in `src/contract-standardizer.ts`:

### TODO 1: Call the agent with `query()`

Use `query()` to run the agent with file tools:

```typescript
for await (const message of query({
  prompt: contractStandardizerPrompt(inputPath, outputPath),
  options: {
    model,
    allowedTools: ["Read", "Write"],
  },
})) {
  // handle messages
}
```

### TODO 2: Capture the raw result

Inside the loop, check for a successful result message:

```typescript
if (message.type === "result" && message.subtype === "success") {
  raw = message.result;
}
```

### TODO 3: Catch errors

Wrap the implementation in a try/catch and re-throw with:

```
"Failed to standardize contract: {original message}"
```

## Run

```bash
# From this directory (lesson-05-agent-sdk/exercise/starter)
npm start
```

## Success Criteria

- [ ] All 4 contracts are processed without errors
- [ ] Standardized files appear in `src/standardized/`
- [ ] Each output follows the standardized format (Parties, Term, Financial Terms, etc.)
- [ ] `raw` field is populated in the returned object

## Agent Tools

| Tool | Purpose |
|------|---------|
| Read | Read contract files from `contracts/` folder |
| Write | Write standardized output to `standardized/` folder |

## Key Takeaway

The Claude Agent SDK handles the tool execution loop automatically. You call `query()` with `allowedTools`, iterate the results, and the agent reads and writes files on its own.