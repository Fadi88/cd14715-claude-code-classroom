# Demo: Claude Skills - Multi-Skill Email Analysis

Build an agent that uses multiple Claude Skills for comprehensive email analysis.

## Scenario

Your team reviews emails but lacks consistent quality standards. Build an agent that uses **two skills** to analyze emails:
1. **email-etiquette**: Tone, structure, clarity, and professionalism
2. **communication-style**: Assertive, passive, aggressive, or passive-aggressive patterns

## Project Structure

```
demo/
├── .claude/
│   └── skills/
│       ├── email-etiquette/
│       │   └── SKILL.md        # Email review skill
│       └── communication-style/
│           └── SKILL.md        # Communication style skill
├── src/
│   ├── email-reviewer.ts       # Exported function (deliverable)
│   ├── sample-emails.ts        # Test emails
│   └── index.ts                # Test
└── README.md
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

## Key Pattern: Multi-Skill Usage

Claude autonomously discovers and uses multiple skills based on their descriptions:

```typescript
for await (const message of query({
  prompt: `Use the available skills to analyze this email...`,
  options: {
    cwd: PROJECT_ROOT,                    // Where .claude/skills/ lives
    settingSources: ["project"],          // Load skills from filesystem
    allowedTools: ["Skill", "Read", "Grep", "Glob"],
  },
})) { ... }
```

Claude reads the YAML frontmatter `description` in each SKILL.md to decide which skills are relevant.

## Skills

### email-etiquette

| Category | Issues |
|----------|--------|
| Tone | Too casual (slang, emojis), Too formal (archaic language) |
| Structure | Missing greeting, unclear purpose, no sign-off |
| Clarity | Vague requests, missing context |
| Grammar | Typos, incomplete sentences |

### communication-style

| Style | Characteristics |
|-------|-----------------|
| Assertive | Clear, direct, respectful "I" statements |
| Passive | Excessive hedging, over-apologizing |
| Aggressive | Blaming, demanding, dismissive |
| Passive-aggressive | Backhanded compliments, sarcasm |

## SKILL.md Frontmatter

Each skill requires YAML frontmatter with a `description` for Claude to discover it:

```yaml
---
description: "Professional email communication expert..."
---

# Email Etiquette Skill
...
```

## Key Takeaways

1. **Multiple Skills**: Store related skills in `.claude/skills/` subdirectories
2. **Skill Discovery**: Claude uses the `description` frontmatter to find relevant skills
3. **Autonomous Selection**: Claude decides which skills to invoke based on the task
4. **Consistent Analysis**: Skills provide reusable expertise across agents
