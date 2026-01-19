# Exercise: Structured Outputs - Meeting Notes Analyzer

Extract structured data from meeting transcripts using Zod schemas.

## Scenario

Your team records meetings but struggles to extract actionable information. Build a system that automatically identifies action items, decisions, and participants with structured, validated output.

## Project Structure

```
src/
├── meeting-analyzer.ts   # Exported function (deliverable)
├── sample-transcripts.ts # Test transcripts
└── index.ts              # Test
```

## Setup

```bash
# From repo root (shared node_modules)
npm install
```

## Authentication Setup

Choose **one** authentication method:

### Option 1: AWS Bedrock (Recommended for Vocareum)

Create `.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_SESSION_TOKEN=your-session-token
CLAUDE_CODE_USE_BEDROCK=1
ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-5-20250929-v1:0
```

Copy AWS credentials from your Vocareum workspace.

### Option 2: Direct Anthropic API

Create `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

Get your API key from https://console.anthropic.com

## Run

```bash
npm start
```

## Deliverable: meeting-analyzer.ts

```typescript
export const ActionItemSchema = z.object({
  task: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  priority: z.enum(["low", "medium", "high"]),
});

export const DecisionSchema = z.object({
  decision: z.string(),
  rationale: z.string(),
  impact: z.enum(["low", "medium", "high"]),
});

export const MeetingAnalysisSchema = z.object({
  date: z.string(),
  participants: z.array(z.string()),
  topic: z.string(),
  actionItems: z.array(ActionItemSchema),
  decisions: z.array(DecisionSchema),
  nextMeetingDate: z.string().optional(),
  summary: z.string().max(500),
});

export type ActionItem = z.infer<typeof ActionItemSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type MeetingAnalysis = z.infer<typeof MeetingAnalysisSchema>;

export async function analyzeMeeting(transcript: string): Promise<MeetingAnalysis>
```

## Expected Output

```typescript
{
  date: "2024-01-15",
  participants: ["Alice", "Bob", "Charlie"],
  topic: "Q1 Planning",
  actionItems: [
    {
      task: "Create project timeline",
      assignee: "Alice",
      dueDate: "2024-01-20",
      priority: "high"
    }
  ],
  decisions: [
    {
      decision: "Use React for frontend",
      rationale: "Team expertise and ecosystem",
      impact: "high"
    }
  ],
  nextMeetingDate: "2024-01-22",
  summary: "Team discussed Q1 priorities..."
}
```

## Key Takeaway

Structured outputs with Zod schemas ensure predictable, validated data extraction. Use `zodToJsonSchema()` to convert Zod schemas for the `outputFormat` option in `query()`.

