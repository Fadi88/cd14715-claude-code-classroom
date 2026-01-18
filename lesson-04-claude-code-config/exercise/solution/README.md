# Solution: Claude Code Configuration for Support Ticket System

This is the complete solution for the lesson-04 exercise.

## What This Solution Demonstrates

### Configuration Structure
```
solution/.claude/
├── CLAUDE.md                          # Project configuration
├── settings.json                      # Permission settings
├── agents/
│   ├── ticket-analyzer.md            # Ticket triage subagent
│   └── kb-searcher.md                # Knowledge base search subagent
└── skills/
    ├── ticket-classification/
    │   └── SKILL.md                  # Classification methodology
    └── sla-calculation/
        ├── SKILL.md                  # SLA calculation rules
        └── examples.md               # SLA examples
```

### Complete Implementation

**1. CLAUDE.md** - Project configuration
- YAML frontmatter with description and tools
- Project overview and architecture
- Usage examples
- SLA requirements
- System instructions

**2. Subagents** (2 total)
- `ticket-analyzer`: Fast triage using Haiku
- `kb-searcher`: Search knowledge base for solutions (bonus)

**3. Skills** (2 total)
- `ticket-classification`: How to classify and categorize tickets
- `sla-calculation`: How to calculate SLA deadlines (bonus)

**4. Security**
- `settings.json`: Permission restrictions for safety

## Key Design Decisions

### Model Selection
- **ticket-analyzer**: Haiku (fast, cost-effective for simple classification)
- **kb-searcher**: Haiku (quick KB lookups)

### Tool Restrictions
- **ticket-analyzer**: Read, Grep, Glob only (no web access needed)
- **kb-searcher**: Read, Grep only (focused on local KB search)

### Skill Descriptions
Made descriptions specific to trigger automatically:
- "classify support tickets" → triggers ticket-classification
- "calculate SLA" → triggers sla-calculation

## Classification Matrix (from Solution)

| Level | Response Time | Criteria |
|-------|--------------|----------|
| **URGENT** | Immediate | System down, security breach, data loss, production broken |
| **HIGH** | < 1 hour (Enterprise) | Core feature broken, errors affecting customers |
| **MEDIUM** | < 4 hours (Standard) | Feature degraded, workaround available |
| **LOW** | < 24 hours | Questions, minor bugs, feature requests |

## Sample Ticket Results

### Technical Ticket (sample-tickets/technical.txt)
**Expected Classification:**
- Urgency: HIGH (production issue, enterprise customer, 5000 users affected)
- Category: technical (500 errors, database connection timeout)
- Routing: engineering (requires code/infrastructure fix)
- SLA: < 1 hour (enterprise customer)

### Billing Ticket (sample-tickets/billing.txt)
**Expected Classification:**
- Urgency: MEDIUM (billing question, no immediate business impact)
- Category: billing (invoice charge question)
- Routing: finance (billing inquiry)
- SLA: < 4 hours (standard customer)

### General Ticket (sample-tickets/general.txt)
**Expected Classification:**
- Urgency: LOW (how-to question, not urgent)
- Category: general (feature question about export)
- Routing: support (check KB first, then L1 support)
- SLA: < 24 hours (standard customer)

## How It Works

When you run:
```bash
claude "Analyze the ticket in sample-tickets/technical.txt"
```

**Behind the scenes:**
1. **Skill activates**: `ticket-classification` loads (description matches)
2. **File read**: Claude reads the ticket file
3. **Classification**: Applies urgency matrix and category rules
4. **Subagent delegates** (optional): May invoke `ticket-analyzer` for structured analysis
5. **Output**: Returns classification with urgency, category, routing, and SLA

## Bonus Features in Solution

### Additional Subagent: kb-searcher.md
Searches knowledge base for existing solutions before routing to humans.

**Purpose**: Reduce ticket volume by finding auto-resolve opportunities

### Additional Skill: sla-calculation
Calculates exact SLA deadlines based on:
- Customer tier (Enterprise vs Standard)
- Ticket urgency
- Business hours vs 24/7 support
- Time zones

**Includes**: `examples.md` with detailed SLA scenarios

### Security: settings.json
Restricts permissions to prevent dangerous operations:
```json
{
  "permissions": {
    "allow": ["Read(sample-tickets/**)", "Bash(grep:*)", "Bash(find:*)"],
    "deny": ["Read(.env)", "Read(secrets/**)", "WebFetch"]
  }
}
```

## Learning Outcomes

By studying this solution, you should understand:

1. **YAML Frontmatter** - How to structure configuration metadata
2. **Clear Descriptions** - Writing descriptions that trigger correctly
3. **Tool Selection** - Choosing minimal necessary tools for security
4. **Model Selection** - Using Haiku for fast, simple tasks
5. **Skill Structure** - Teaching methodology with examples
6. **Progressive Disclosure** - Breaking complex skills into multiple files
7. **Permission Control** - Restricting dangerous operations

## Comparison to Starter

| Aspect | Starter | Solution |
|--------|---------|----------|
| CLAUDE.md | TODOs | Complete with all sections |
| Subagents | 1 template | 2 complete (ticket-analyzer, kb-searcher) |
| Skills | 1 template | 2 complete (classification, SLA calc) |
| Settings | None | settings.json with permissions |
| Examples | TODOs | 3 complete examples per skill |

## Testing the Solution

```bash
# Single ticket analysis
claude "Analyze sample-tickets/technical.txt"
# Expected: HIGH urgency, technical category, engineering routing

claude "Analyze sample-tickets/billing.txt"
# Expected: MEDIUM urgency, billing category, finance routing

claude "Analyze sample-tickets/general.txt"
# Expected: LOW urgency, general category, support routing

# Batch processing
claude "Classify all tickets in sample-tickets/ and prioritize by SLA"
# Should analyze all three and rank by urgency/deadline

# SLA calculation
claude "Calculate SLA deadline for an enterprise technical ticket submitted at 2pm"
# Should return deadline time based on 1-hour SLA
```

## Next Steps

After reviewing this solution:

1. **Compare** your starter implementation with this solution
2. **Identify gaps** - What did you miss or implement differently?
3. **Test thoroughly** - Run all example commands
4. **Extend** - Try adding:
   - Another subagent for auto-responses
   - A skill for escalation rules
   - More sample tickets (urgent security issues, etc.)
5. **Prepare for SDK** - Lessons 5-10 show how to implement this programmatically

## Files Included

### Required (matching exercise requirements)
- ✅ `.claude/CLAUDE.md` - Complete project configuration
- ✅ `.claude/agents/ticket-analyzer.md` - Complete subagent
- ✅ `.claude/skills/ticket-classification/SKILL.md` - Complete skill

### Bonus (demonstrates advanced patterns)
- ➕ `.claude/agents/kb-searcher.md` - Additional subagent
- ➕ `.claude/skills/sla-calculation/SKILL.md` - Additional skill
- ➕ `.claude/skills/sla-calculation/examples.md` - Progressive disclosure
- ➕ `.claude/settings.json` - Permission control

## Key Takeaways

This solution demonstrates:
- **Architecture translation**: Lesson 03 design → Lesson 04 configuration
- **Security first**: Minimal tool access, permission restrictions
- **Clear triggers**: Specific descriptions that activate correctly
- **Best practices**: Model selection, progressive disclosure, examples
- **Real-world ready**: Production-quality configuration structure
