# Configuring Claude Code for Multi-Agent Systems

Learn how to configure Claude Code using `.claude/CLAUDE.md`, subagents, and skills.

## Overview

This demo shows how to translate the multi-agent architecture from Lesson 03 (Company Research System) into a working Claude Code configuration. You'll learn the practical implementation of agentic design patterns.

## Scenario

Implement the company research system from Lesson 03 using Claude Code's configuration features:
- Set up project-level Claude Code configuration
- Create specialized subagents with focused responsibilities
- Define skills that teach domain-specific knowledge
- Configure tool access and permissions

## What You'll Learn

- **CLAUDE.md**: Project configuration with YAML frontmatter and instructions
- **Subagents**: Specialized AI assistants with their own context and tools
- **Skills**: Domain knowledge that Claude automatically applies
- **Configuration hierarchy**: Project vs user-level settings
- **Tool restrictions**: Limiting what agents can do for security

## Architecture Implementation

From Lesson 03 design to Lesson 04 implementation:

| Lesson 03 (Design) | Lesson 04 (Implementation) |
|-------------------|----------------------------|
| Architecture diagram | `.claude/CLAUDE.md` |
| Web Researcher Agent | `.claude/agents/web-researcher.md` |
| People Finder Agent | `.claude/agents/people-finder.md` |
| Analysis methodology | `.claude/skills/company-analysis/SKILL.md` |

## Project Structure

```
demo/
├── .claude/
│   ├── CLAUDE.md                           # Main project configuration
│   ├── agents/
│   │   ├── web-researcher.md              # Subagent: Web research
│   │   └── people-finder.md               # Subagent: People research
│   └── skills/
│       └── company-analysis/
│           └── SKILL.md                    # Skill: Research methodology
└── README.md
```

## File Breakdown

### `.claude/CLAUDE.md` - Project Configuration

**Purpose**: Main configuration that defines:
- Project description for Claude
- Available tools
- How the system works
- Usage examples

**Key sections**:
- YAML frontmatter (description, tools)
- Architecture overview
- System instructions
- Usage examples

### `.claude/agents/web-researcher.md` - Subagent

**Purpose**: Specialized agent for web research

**Configuration**:
- `name`: `web-researcher`
- `description`: When Claude should use it
- `tools`: WebFetch, WebSearch, Read, Grep, Glob
- `model`: Haiku (fast and cost-effective)

**Responsibilities**:
- Gather company information
- Extract product details
- Find tech stack
- Collect recent news

### `.claude/agents/people-finder.md` - Subagent

**Purpose**: Specialized agent for leadership research

**Configuration**:
- `name`: `people-finder`
- `description`: When to find company leaders
- `tools`: WebFetch, WebSearch, Read, Grep, Glob
- `model`: Haiku (fast and cost-effective)

**Responsibilities**:
- Find company founders
- Identify executive team
- Research organizational structure
- Compile leadership information

### `.claude/skills/company-analysis/SKILL.md` - Skill

**Purpose**: Teaches Claude how to conduct company research

**What it teaches**:
- Research methodology (3 phases)
- Standard report format
- Quality checklist
- Search patterns that work
- When to delegate to subagents

**How it works**: Claude automatically applies this skill when the user asks to research a company.

## Using the Configuration

### Setup

This demo is read-only (no code to install). The `.claude` folder configures how Claude Code would work if run in this directory.

### Example Usage (Conceptual)

If you were running Claude Code in this directory:

```bash
# Claude would use the company-analysis skill and delegate to subagents
claude "Research Anthropic"

# Output would include:
# 1. Company overview (from web-researcher)
# 2. Leadership team (from people-finder)
# 3. Structured report (from company-analysis skill)
```

### Behind the Scenes

When you ask Claude to research a company:

1. **Skill activates**: `company-analysis` skill loads because description matches
2. **Claude plans**: Follows the methodology in the skill
3. **Delegates work**:
   - Spawns `web-researcher` subagent for company data
   - Spawns `people-finder` subagent for leadership
4. **Synthesizes**: Combines results using report format from skill
5. **Delivers**: Returns comprehensive report to user

## Key Concepts

### CLAUDE.md vs Subagents vs Skills

| Feature | CLAUDE.md | Subagents | Skills |
|---------|-----------|-----------|--------|
| **Purpose** | Project setup | Specialized tasks | Domain knowledge |
| **When used** | Every conversation | Claude delegates | Claude chooses |
| **Context** | Shared with main | Separate context | Shared with main |
| **Tools** | Sets defaults | Specific restrictions | Can suggest tools |
| **Example** | "This is a research project" | "Search the web for company info" | "Here's how to structure a report" |

### YAML Frontmatter

Both CLAUDE.md and agent files use YAML frontmatter:

```yaml
---
name: agent-name              # Subagents only
description: "What it does"   # Required for subagents
tools: Read, Grep, Glob       # Optional
model: haiku                  # Optional (sonnet, haiku, opus)
---
```

### Tool Restrictions

Subagents can have limited tools for security:

- **web-researcher**: WebFetch, WebSearch (needs internet access)
- **code-reviewer** (in other projects): Only Read, Grep, Glob (read-only)

### Model Selection

Choose the right model for each subagent:

- **Haiku**: Fast, cost-effective (web-researcher, people-finder)
- **Sonnet**: Balanced quality and cost (most tasks)
- **Opus**: Complex reasoning (rare, expensive)

## Configuration Best Practices

### CLAUDE.md Tips

✅ **Do**:
- Start with a clear description in YAML frontmatter
- Include usage examples
- Document your architecture
- Link to relevant skills/subagents

❌ **Don't**:
- Overload with too many instructions (use skills instead)
- Forget to list available tools
- Include sensitive information

### Subagent Tips

✅ **Do**:
- Give each subagent a single, clear purpose
- Choose the right model (Haiku for simple tasks)
- Restrict tools to minimum needed
- Write clear "when to use me" descriptions

❌ **Don't**:
- Create subagents that do too many things
- Grant unnecessary tool access
- Use expensive models for simple tasks

### Skill Tips

✅ **Do**:
- Teach methodology, not just facts
- Include examples and templates
- Use progressive disclosure (link to additional files)
- Make descriptions specific to trigger correctly

❌ **Don't**:
- Put everything in one huge SKILL.md
- Write vague descriptions
- Include outdated information

## Authentication Setup

If running Claude Code locally:

```bash
export ANTHROPIC_API_KEY=your-key-here
```

**IMPORTANT**: This is already set up in Vocareum workspace.

## Comparison to Lesson 03

### Lesson 03: Design Phase
- Drew architecture diagrams
- Defined agent responsibilities
- Planned workflow sequences
- Analyzed trade-offs

### Lesson 04: Implementation Phase
- Created actual configuration files
- Implemented subagents as `.md` files
- Defined skills with YAML frontmatter
- Made design decisions executable

## Key Takeaways

1. **CLAUDE.md is your project's AI configuration** - Tells Claude about your project
2. **Subagents handle specialized tasks** - Separate context, focused tools
3. **Skills teach domain knowledge** - Automatically applied when relevant
4. **Configuration is hierarchical** - Project > User > Plugin
5. **Design translates to code** - Lesson 03 architecture → Lesson 04 config

## Next Steps

In the exercise, you'll create your own `.claude` folder for the support ticket system from Lesson 03, including:
- Your own CLAUDE.md configuration
- At least one subagent for ticket analysis
- At least one skill for ticket classification

Later lessons (5-10) will show how to implement these patterns programmatically using the Claude Agent SDK.
