/**
 * Exercise: Claude Model Selection
 *
 * Scenario: A support team handles thousands of tickets daily.
 * Simple questions need fast responses; complex issues need deeper analysis.
 *
 * This exercise reinforces how to pick the right model for different tasks.
 */

import Anthropic from "@anthropic-ai/sdk";
import { MODELS, ModelKey } from "./models.js";
import { calculateCost, logStats, displayComparison, ensureParsedResponse } from "./helpers.js";
import { Message, Model } from "@anthropic-ai/sdk/resources";
import { TICKETS } from "./sample-tickets.js";
import dotenv from "dotenv";
dotenv.config();

/**Initialize the Anthropic client */
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});


// -----------------------------------------------------------------------------
// Helper: Call Claude and return the response with usage stats
// -----------------------------------------------------------------------------

async function callClaude(modelKey: ModelKey, system: string, userMessage: string) {
  const model = MODELS[modelKey];
  const start = Date.now();

  // TODO: Call Claude with the model and system prompt
  const rawResponse = await client.messages.create({
    model: model.id as Model,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMessage }],
  });

  const response = ensureParsedResponse(rawResponse as any); // Required for Vocareum platform

  const end = Date.now();
  const inputTokens = response.usage?.input_tokens || 0;
  const outputTokens = response.usage?.output_tokens || 0;

  const cost = calculateCost(inputTokens, outputTokens, model);

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  return { text, inputTokens, outputTokens, ms: end - start, cost };
}

// -----------------------------------------------------------------------------
// Step 1: Haiku - Fast classification for simple tickets
// -----------------------------------------------------------------------------

async function testHaiku() {
  console.log(`\n---  Haiku for Simple Classification ---\n`);

  // TODO: Define system prompt
  // Goal: Classify support ticket priority as: LOW, MEDIUM, HIGH, or URGENT
  const system = `Classify support ticket priority as LOW, MEDIUM, HIGH, or URGENT.
    Use these rules:
    - LOW: How-to questions, password resets, documentation requests.
    - MEDIUM: General inquiries, minor billing questions.
    - HIGH: Account lockout (non-password related), functional bugs.
    - URGENT: System outages, data corruption, or security breaches.
    Respond with ONLY the single word priority label.`;

  // TODO: Call Claude with Haiku model
  const result = await callClaude("haiku", system, TICKETS.simple);

  // TODO: Display results
  console.log(`Tciket: ${TICKETS.simple}`);
  console.log(`Result: ${result.text}`);
  logStats(result);

  console.log(`\n💡 Haiku is perfect for simple tasks - fast and cheap!`);
}

// -----------------------------------------------------------------------------
// Step 2: Sonnet - Balanced analysis for moderate tickets
// -----------------------------------------------------------------------------

async function testSonnet() {
  console.log("\n---  Sonnet for Detailed Analysis ---\n");

  const system = `You are an expert customer support analyst. Analyze the provided support ticket and output a structured assessment containing:

1. **Priority Level**: Classify as LOW, MEDIUM, HIGH, or URGENT, followed by a brief 1-sentence justification.
2. **Issue Category**: Determine the department or area (e.g., Billing, Account Access, Technical Bug, Feature Request).
3. **Key Details**: A bulleted list of all critical facts extracted from the ticket (such as user email, dates, transaction amounts, and specific problems).
4. **Recommended Action**: Step-by-step instructions for the support agent on how to handle and resolve the ticket.

Format your response clearly using Markdown headers for each section.`;

  const result = await callClaude("sonnet", system, TICKETS.moderate);

  console.log(`Ticket: ${TICKETS.moderate}`);
  console.log(`Result:\n${result.text}`);
  logStats(result);

  console.log(`\n💡 Sonnet balances quality and cost - great for most tasks!`);
}

// -----------------------------------------------------------------------------
// Step 3: Opus - Complex reasoning for multi-issue tickets
// -----------------------------------------------------------------------------

async function testOpus() {
  console.log("\n---  Opus for Complex Reasoning ---\n");

  const system = `You are a Senior Enterprise Support Director. Conduct a comprehensive, multi-factor analysis of this critical enterprise customer issue. Provide:

1. **Executive Summary**: A high-level overview of the account status, overall risk, and business impact.
2. **Root Cause Analysis (RCA)**: Separate hypotheses for each of the 4 reported issues (API, Data Sync, Performance, Billing).
3. **Impact Assessment**: Analyze the technical impact (system health) and business impact (retention risk/contract renewal).
4. **Prioritized Action Plan**: A step-by-step resolution plan with clear team ownership (e.g., Engineering, Billing, Account Manager) and timelines.

Encourage thorough, exhaustive reasoning and structured detail.`;

  const result = await callClaude("opus", system, TICKETS.complex);

  console.log(`Ticket:\n${TICKETS.complex}`);
  console.log(`Result:\n${result.text}`);
  logStats(result);

  console.log(`\n💡 Opus excels at complex, multi-factor reasoning!`);
}

// -----------------------------------------------------------------------------
// Step 4: Compare all models on the same task
// -----------------------------------------------------------------------------

async function testCompare() {
  console.log("\n---  Model Comparison ---\n");

  const system = "Analyze the support ticket and provide exactly three outputs: 1. Priority (LOW/MEDIUM/HIGH/URGENT), 2. Main issue, 3. One recommended action. Keep it very concise.";

  const results: any[] = [];
  const modelsToCompare: ModelKey[] = ["haiku", "sonnet", "opus"];
  
  for (const mKey of modelsToCompare) {
    console.log(`Running comparison for model: ${mKey}...`);
    const res = await callClaude(mKey, system, TICKETS.moderate);
    results.push({
      model: mKey,
      ms: res.ms,
      inputTokens: res.inputTokens,
      outputTokens: res.outputTokens,
      cost: res.cost
    });
  }

  displayComparison(results);
  // Note: displayComparison() function handles the table formatting

  console.log("\n💡 Pick the right model for the job!");
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("  EXERCISE: Claude Model Selection");
  console.log("  Scenario: Customer Support Ticket System");
  console.log("=".repeat(60));

  // TODO: Uncomment each step as you complete it
  await testHaiku();
  await testSonnet();
  await testOpus();
  await testCompare();
}

main().catch(console.error);
