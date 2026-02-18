# Exercise: Claude Skills - JavaScript Code Reviewer

Build an agent that reviews JavaScript files using a Claude Skill.

## Scenario

Your team needs consistent code reviews across projects. Build an agent that uses a JavaScript code review skill to analyze files for quality issues, bugs, and security vulnerabilities.

## Project Structure

```
exercise/
├── .claude/
│   └── skills/
│       └── js-code-review/
│           └── SKILL.md        # Code review skill
├── src/
│   ├── sample-code/
│   │   ├── clean.js            # Well-written code
│   │   └── issues.js           # Code with problems
│   ├── js-reviewer.ts          # Exported function (deliverable)
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

In Vocareum workspace, `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` are **already configured** in your environment — the `.env` file only needs to provide `ANTHROPIC_MODEL`.

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
# From this directory (lesson-08-claude-skills/exercise/solution)
npm start
```

## Deliverable: js-reviewer.ts

```typescript
export interface CodeReviewResult {
  filename: string;
  raw: string;
}

export async function reviewJavaScriptFile(
  filePath: string
): Promise<CodeReviewResult>
```

## Key Pattern: Using Skills with Agent SDK

```typescript
for await (const message of query({
  prompt: "Review this JavaScript file...",
  options: {
    cwd: PROJECT_ROOT,                    // Where .claude/skills/ lives
    settingSources: ["project"],          // Load skills from filesystem
    allowedTools: ["Skill", "Read", "Grep", "Glob"],
  },
})) { ... }
```

## Skill: js-code-review

The skill teaches the agent to check for:

| Category | Issues |
|----------|--------|
| Quality | `var` usage, console.log, unused variables, magic numbers |
| Bugs | Loose equality `==`, missing await, null access |
| Security | eval(), innerHTML, hardcoded secrets |
| Style | Arrow functions, destructuring, async/await |

## Key Takeaway

Skills extend Claude with reusable expertise. Use `settingSources: ["project"]` to load skills from `.claude/skills/` and the `Skill` tool to apply them. Skills can only use Read, Grep, and Glob tools.

