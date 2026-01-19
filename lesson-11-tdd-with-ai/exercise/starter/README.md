# Exercise: Design a TDD Strategy for a Shopping Cart Module

**Estimated Time: 12 minutes**

## Overview

Create a TDD plan for a shopping cart feature, identifying what tests AI should generate, coverage targets, and edge cases requiring human judgment.

## Scenario

Build a shopping cart handling:
- Add/remove items
- Quantity updates
- Promotional codes
- Inventory validation
- Price calculations with tax

## Your Tasks

1. **Write requirements** for 5 cart operations in `tdd-strategy.md`
2. **Identify edge cases** AI might miss
3. **Design red-green-refactor sequence**
4. **Use Claude Code** to generate tests
5. **Include sample AI-generated test** in your deliverable

## Project Structure

```
src/
├── shopping-cart.ts      # Code with intentional gaps
├── shopping-cart.test.ts # Add AI-generated tests here
└── index.ts              # Demo runner
tdd-strategy.md           # YOUR DELIVERABLE
```

## Run

```bash
npm install
npm start           # See demo with gaps
npm test            # Run tests (some fail)
npm run test:coverage
```

## Deliverable: tdd-strategy.md

Complete all sections:
- Requirements for 5 operations
- Edge cases AI might miss (5+)
- Coverage targets with rationale
- Red-green-refactor sequence
- Validation checklist
- Sample AI-generated test

## Claude Code Prompts

**Generate tests:**
```
Read the shopping cart requirements in tdd-strategy.md and generate
a comprehensive Vitest test suite with happy paths and edge cases.
```

**Find coverage gaps:**
```
After running npm run test:coverage, identify uncovered lines in
shopping-cart.ts and generate tests for those paths.
```

## Success Criteria

- [ ] All 5 cart operations have clear requirements
- [ ] 5+ edge cases identified
- [ ] Coverage targets defined
- [ ] Red-green-refactor sequence is logical
- [ ] Sample AI-generated test included
