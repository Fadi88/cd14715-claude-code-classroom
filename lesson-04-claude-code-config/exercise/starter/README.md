# Exercise: Configure Claude Code for Support Ticket System

## Objective

Configure Claude Code for the intelligent support ticket routing system from Lesson 03. Create a `.claude` folder with CLAUDE.md, at least one subagent, and at least one skill.

## Learning Goals

- Write CLAUDE.md with YAML frontmatter and project instructions
- Create a specialized subagent with tool restrictions and model selection
- Define a skill that teaches Claude domain-specific knowledge
- Understand when to use CLAUDE.md vs subagents vs skills
- Test your configuration with sample tickets

## Scenario

You're building the support ticket system from Lesson 03 Exercise. Configure Claude Code to:
- Classify tickets by urgency (URGENT, HIGH, MEDIUM, LOW)
- Categorize tickets by type (technical, billing, general)
- Route tickets to appropriate teams
- Calculate SLA deadlines based on customer tier

## Your Tasks

### Step 1: Complete CLAUDE.md Configuration

Open `.claude/CLAUDE.md` and complete the TODO sections:

- [ ] Add project description in YAML frontmatter
- [ ] List available tools (bash, read, grep, glob)
- [ ] Write project overview explaining the support system
- [ ] Document the architecture (subagents and skills)
- [ ] Add usage examples showing how to analyze tickets
- [ ] Include SLA requirements (Enterprise: <1 hour, Standard: <4 hours)

**Reference**: See `demo/.claude/CLAUDE.md` for structure and style

### Step 2: Create Ticket Analyzer Subagent

Open `.claude/agents/ticket-analyzer.md` and complete it:

- [ ] Fill in YAML frontmatter (name, description, tools, model)
- [ ] Write when Claude should use this subagent
- [ ] Choose appropriate tools (Read, Grep, Glob)
- [ ] Select model (Haiku recommended for speed)
- [ ] Write analysis process steps
- [ ] Define output format (JSON structure)

**What it should do**:
- Read ticket content
- Extract key information (customer tier, issue type, urgency)
- Determine urgency level based on keywords
- Categorize by type (technical/billing/general)
- Recommend routing (engineering/finance/support)

**Reference**: See `demo/.claude/agents/web-researcher.md` for structure

### Step 3: Create Ticket Classification Skill

Open `.claude/skills/ticket-classification/SKILL.md` and complete it:

- [ ] Fill in YAML frontmatter (name, description, allowed-tools)
- [ ] Create classification matrix (urgency levels and criteria)
- [ ] List urgency keywords (URGENT, HIGH, MEDIUM, LOW indicators)
- [ ] Define category classification rules
- [ ] Provide 3 classification examples
- [ ] Document the classification process steps

**What it should teach**:
- How to classify tickets by urgency
- How to categorize by type
- Keywords that indicate urgency levels
- Examples of each classification type

**Reference**: See `demo/.claude/skills/company-analysis/SKILL.md` for structure

### Step 4: Test Your Configuration

Test with the sample tickets:

```bash
# Analyze a technical ticket (should be HIGH urgency)
claude "Analyze the ticket in sample-tickets/technical.txt"

# Analyze a billing ticket (should be MEDIUM urgency)
claude "Analyze the ticket in sample-tickets/billing.txt"

# Analyze a general ticket (should be LOW urgency)
claude "Analyze the ticket in sample-tickets/general.txt"

# Classify all tickets at once
claude "Classify all tickets in sample-tickets/ and route appropriately"
```

**Expected behavior**:
1. The `ticket-classification` skill should activate automatically
2. Claude should use the classification matrix you defined
3. The `ticket-analyzer` subagent may be invoked for detailed analysis
4. Output should include urgency, category, and routing recommendation

## Success Criteria

### CLAUDE.md
- [ ] Has valid YAML frontmatter with description and tools
- [ ] Includes project overview explaining support system
- [ ] Documents architecture (subagents and skills)
- [ ] Provides usage examples
- [ ] States SLA requirements clearly

### Subagent (ticket-analyzer.md)
- [ ] Has valid YAML frontmatter with all fields
- [ ] Name matches description context
- [ ] Tools are appropriate (Read, Grep, Glob)
- [ ] Model is specified (Haiku recommended)
- [ ] System prompt explains analysis process
- [ ] Defines clear output format

### Skill (ticket-classification/SKILL.md)
- [ ] Has valid YAML frontmatter
- [ ] Description triggers on ticket classification requests
- [ ] Includes classification matrix with urgency levels
- [ ] Lists keywords for each urgency level
- [ ] Provides category classification rules
- [ ] Includes at least 3 examples
- [ ] Defines step-by-step process

### Testing
- [ ] Technical ticket classified as HIGH urgency
- [ ] Billing ticket classified as MEDIUM urgency
- [ ] General ticket classified as LOW urgency
- [ ] All tickets show correct category
- [ ] Routing recommendations are appropriate

## File Structure

```
exercise/starter/
├── README.md                           (this file)
├── .claude/
│   ├── CLAUDE.md                      ⬅ TODO: Complete
│   ├── agents/
│   │   └── ticket-analyzer.md         ⬅ TODO: Complete
│   └── skills/
│       └── ticket-classification/
│           └── SKILL.md               ⬅ TODO: Complete
└── sample-tickets/
    ├── technical.txt                  ✅ Provided
    ├── billing.txt                    ✅ Provided
    └── general.txt                    ✅ Provided
```

## Classification Reference

### Urgency Levels

| Level | Response Time | Criteria |
|-------|--------------|----------|
| **URGENT** | Immediate | System down, security breach, data loss |
| **HIGH** | < 1 hour | Core feature broken, enterprise customer |
| **MEDIUM** | < 4 hours | Feature degraded, workaround available |
| **LOW** | < 24 hours | Questions, minor bugs, feature requests |

### Ticket Categories

- **Technical**: Errors, bugs, API issues, integrations, performance
- **Billing**: Payments, invoices, refunds, subscriptions, pricing
- **General**: How-to questions, account settings, feature inquiries

### Routing Destinations

- **Engineering**: Technical issues requiring code fixes
- **Finance**: Billing, payment, and subscription issues
- **Support**: General questions and how-to help
- **Escalation**: URGENT issues or SLA breaches

## Tips

### CLAUDE.md
- Keep it concise - detailed instructions go in skills
- Use YAML frontmatter for structured configuration
- Include usage examples so users know how to interact

### Subagent
- Choose Haiku for fast, simple tasks like classification
- Restrict tools to minimum needed (security best practice)
- Write clear "when to use me" description
- Define structured output format (JSON recommended)

### Skill
- Make the description specific so it triggers correctly
- Include examples for each classification type
- Use tables for classification matrices (easy to scan)
- Teach the "how" not just the "what"

## Authentication

If testing locally:
```bash
export ANTHROPIC_API_KEY=your-key-here
```

**IMPORTANT**: This is already set up in Vocareum workspace.

## Common Mistakes to Avoid

❌ **Don't**:
- Leave YAML frontmatter empty or invalid
- Make subagent descriptions too vague
- Grant unnecessary tool access to subagents
- Forget to include examples in skills
- Write skill descriptions that don't match usage

✅ **Do**:
- Use clear, specific descriptions
- Restrict subagent tools appropriately
- Include concrete examples
- Test with all sample tickets
- Reference demo files for structure

## Next Steps

After completing your configuration:
1. Compare with the solution in `exercise/solution/`
2. Test with additional ticket scenarios
3. Try adding another subagent (e.g., `kb-searcher`)
4. Try adding another skill (e.g., `sla-calculation`)

## Reference

- Demo configuration: `demo/.claude/`
- Claude Code docs: https://code.claude.com/docs
- Solution (after attempt): `exercise/solution/`
