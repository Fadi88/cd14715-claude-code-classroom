/**
 * Fraud Analyzer with Extended Thinking
 *
 * Deliverable: analyzeFraudRisk() function that uses extended thinking
 * to analyze transactions and provide compliance-grade audit trails.
 */

import Anthropic from "@anthropic-ai/sdk";
import { Transaction } from "./sample-transactions.js";
import dotenv from "dotenv";
import { Message, Model } from "@anthropic-ai/sdk/resources";
dotenv.config();

/**
 * Ensure API response is parsed as JSON.
 * Some proxy environments (like Vocareum) may return responses as strings.
 */
function ensureParsedResponse(response: Message | string): Message {
  if (typeof response === "string") {
    return JSON.parse(response) as Message;
  }
  return response;
}

/** Initialize the Anthropic client */
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = process.env.ANTHROPIC_MODEL;
if (!model) {
  throw new Error("ANTHROPIC_MODEL is not set");
}

// -----------------------------------------------------------------------------
// Exported Types - Simple text-based output
// -----------------------------------------------------------------------------

export interface FraudAnalysis {
  transactionId: string;
  analysis: string;        // The final text response
  thinkingSteps: string[]; // Captured reasoning for audit trail
}

// -----------------------------------------------------------------------------
// Exported Function: analyzeFraudRisk()
// -----------------------------------------------------------------------------

export async function analyzeFraudRisk(transaction: Transaction): Promise<FraudAnalysis> {
  const userMessage = `Please analyze this transaction for potential fraud and compliance risk.
  
Transaction Details:
- ID: ${transaction.id}
- Amount: $${transaction.amount}
- Merchant: ${transaction.merchant}
- Category: ${transaction.category}
- Location: ${transaction.location}
- Time: ${transaction.time}

Customer History:
- Typical Transaction Amount: $${transaction.customerHistory.typicalAmount}
- Typical Location: ${transaction.customerHistory.typicalLocation}
- Account Age: ${transaction.customerHistory.accountAgeDays} days
- Previous Risk Flags: ${transaction.customerHistory.previousFlags}

Provide your final analysis in a clear structured report including:
- Overall Fraud Risk Level (LOW, MEDIUM, HIGH, or CRITICAL)
- Key indicators identified (anomalies in location, velocity, or amount)
- Specific action recommendation (e.g. approve, decline, or hold for manual verification)`;

  const rawResponse = await client.messages.create({
    model: model as Model,
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 2048,
    },
    messages: [{ role: "user", content: userMessage }],
  });

  const response = ensureParsedResponse(rawResponse as any); // Required for Vocareum platform

  const thinkingSteps: string[] = [];
  let analysis = "";

  for (const block of response.content) {
    if (block.type === "thinking") {
      thinkingSteps.push(block.thinking);
    } else if (block.type === "text") {
      analysis += block.text;
    }
  }

  return {
    transactionId: transaction.id,
    analysis,
    thinkingSteps,
  };
}
