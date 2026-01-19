# Demo: AI-Accelerated Test-Driven Development

**Estimated Time: 8 minutes**

## Overview

Explore how AI agents transform the TDD workflow. Claude generates comprehensive test suites from requirements, iterates through red-green-refactor cycles, and provides coverage analysis.

## Scenario

Building a **user authentication module** with:
- Email/password validation
- Password hashing
- JWT token generation
- Rate limiting (account lockout after failed attempts)

## Project Structure

```
src/
├── auth.ts           # Authentication module
├── auth.test.ts      # AI-generated test suite (30+ tests)
└── index.ts          # Demo runner
```

## AI-Accelerated TDD Workflow

```
1. Define Requirements (natural language)
         ↓
2. AI Generates Test Suite
         ↓
3. Red Phase (observe failures)
         ↓
4. Green Phase (implement to pass)
         ↓
5. Refactor (AI suggestions)
         ↓
6. Coverage Analysis & Iterate
```

## Run

```bash
npm install
npm start           # Run demo
npm test            # Run tests
npm run test:coverage
```

## Key Prompts for Claude Code

**Generate tests:**
```
Generate Vitest tests for a user authentication module that validates
email format, enforces password strength, hashes passwords, and issues
JWT tokens. Include edge cases and error scenarios.
```

**Implement to pass:**
```
This test is failing: [paste test]. Implement minimum code to pass.
```

**Analyze coverage:**
```
Coverage shows these uncovered lines: [paste]. Generate tests to cover them.
```

## Key Takeaways

1. Natural language requirements enable AI test generation
2. AI accelerates but doesn't replace human judgment
3. Red-green-refactor cycle remains essential
4. Use coverage analysis to identify gaps
