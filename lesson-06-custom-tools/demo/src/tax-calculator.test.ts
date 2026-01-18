/**
 * Unit Tests for Tax Calculator Tools
 *
 * These tests verify the business logic WITHOUT running the full agent.
 * This is essential for development workflow - you can test your tool logic
 * quickly without making API calls to Claude.
 *
 * Run with: npx tsx src/tax-calculator.test.ts
 *
 * BEST PRACTICE: Always unit test your tool's business logic separately
 * from integration testing with the agent. This allows:
 * - Fast iteration during development
 * - No API costs for testing logic
 * - Easy debugging of edge cases
 * - CI/CD pipeline integration
 */

import {
  calculateTax,
  calculateTip,
  isError,
  TaxResult,
  TipResult,
} from "./tax-calculator.js";

// -----------------------------------------------------------------------------
// Simple Test Framework (no dependencies required)
// -----------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertClose(actual: number, expected: number, tolerance: number = 0.01) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Expected true, got false");
  }
}

function assertFalse(condition: boolean, message?: string) {
  if (condition) {
    throw new Error(message || "Expected false, got true");
  }
}

// -----------------------------------------------------------------------------
// calculateTax() Unit Tests
// -----------------------------------------------------------------------------

console.log("\n" + "=".repeat(60));
console.log("UNIT TESTS: calculateTax()");
console.log("=".repeat(60) + "\n");

test("calculates 8% tax on $100 correctly", () => {
  const result = calculateTax(100, 0.08);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertEqual(taxResult.subtotal, 100);
  assertEqual(taxResult.tax, 8);
  assertEqual(taxResult.total, 108);
  assertEqual(taxResult.effectiveRate, 0.08);
  assertEqual(taxResult.currency, "USD");
});

test("calculates 8.5% tax on $150 correctly", () => {
  const result = calculateTax(150, 0.085);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertEqual(taxResult.subtotal, 150);
  assertEqual(taxResult.tax, 12.75);
  assertEqual(taxResult.total, 162.75);
});

test("handles zero tax rate", () => {
  const result = calculateTax(100, 0);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertEqual(taxResult.tax, 0);
  assertEqual(taxResult.total, 100);
});

test("handles maximum tax rate (50%)", () => {
  const result = calculateTax(100, 0.5);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertEqual(taxResult.tax, 50);
  assertEqual(taxResult.total, 150);
});

test("rounds to nearest cent by default", () => {
  // $99.99 * 0.0825 = $8.249175, should round to $8.25
  const result = calculateTax(99.99, 0.0825);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertEqual(taxResult.tax, 8.25);
  assertEqual(taxResult.total, 108.24);
});

test("preserves precision when rounding disabled", () => {
  const result = calculateTax(99.99, 0.0825, false);
  assertFalse(isError(result), "Should not return error");
  const taxResult = result as TaxResult;
  assertClose(taxResult.tax, 8.249175, 0.000001);
});

test("returns error for negative amount", () => {
  const result = calculateTax(-100, 0.08);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("greater than zero"));
});

test("returns error for zero amount", () => {
  const result = calculateTax(0, 0.08);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("greater than zero"));
});

test("returns error for negative tax rate", () => {
  const result = calculateTax(100, -0.05);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("between 0 and 0.5"));
});

test("returns error for tax rate over 50%", () => {
  const result = calculateTax(100, 0.6);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("between 0 and 0.5"));
});

test("returns error for NaN amount", () => {
  const result = calculateTax(NaN, 0.08);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("finite numbers"));
});

test("returns error for Infinity amount", () => {
  const result = calculateTax(Infinity, 0.08);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("finite numbers"));
});

// -----------------------------------------------------------------------------
// calculateTip() Unit Tests
// -----------------------------------------------------------------------------

console.log("\n" + "=".repeat(60));
console.log("UNIT TESTS: calculateTip()");
console.log("=".repeat(60) + "\n");

test("calculates 20% tip on $75 correctly", () => {
  const result = calculateTip(75, 20);
  assertFalse(isError(result), "Should not return error");
  const tipResult = result as TipResult;
  assertEqual(tipResult.subtotal, 75);
  assertEqual(tipResult.tipAmount, 15);
  assertEqual(tipResult.total, 90);
  assertEqual(tipResult.tipPercentage, 20);
  assertEqual(tipResult.currency, "USD");
});

test("calculates 15% tip on $50 correctly", () => {
  const result = calculateTip(50, 15);
  assertFalse(isError(result), "Should not return error");
  const tipResult = result as TipResult;
  assertEqual(tipResult.tipAmount, 7.5);
  assertEqual(tipResult.total, 57.5);
});

test("handles zero tip", () => {
  const result = calculateTip(100, 0);
  assertFalse(isError(result), "Should not return error");
  const tipResult = result as TipResult;
  assertEqual(tipResult.tipAmount, 0);
  assertEqual(tipResult.total, 100);
});

test("handles maximum tip (100%)", () => {
  const result = calculateTip(50, 100);
  assertFalse(isError(result), "Should not return error");
  const tipResult = result as TipResult;
  assertEqual(tipResult.tipAmount, 50);
  assertEqual(tipResult.total, 100);
});

test("rounds tip to nearest cent by default", () => {
  // $33.33 * 0.18 = $5.9994, should round to $6.00
  const result = calculateTip(33.33, 18);
  assertFalse(isError(result), "Should not return error");
  const tipResult = result as TipResult;
  assertEqual(tipResult.tipAmount, 6);
});

test("returns error for negative amount", () => {
  const result = calculateTip(-50, 20);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("greater than zero"));
});

test("returns error for negative tip percentage", () => {
  const result = calculateTip(50, -10);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("between 0 and 100"));
});

test("returns error for tip over 100%", () => {
  const result = calculateTip(50, 150);
  assertTrue(isError(result), "Should return error");
  assertTrue(result.message.includes("between 0 and 100"));
});

// -----------------------------------------------------------------------------
// isError() Helper Tests
// -----------------------------------------------------------------------------

console.log("\n" + "=".repeat(60));
console.log("UNIT TESTS: isError() helper");
console.log("=".repeat(60) + "\n");

test("identifies error results correctly", () => {
  const errorResult = { error: true as const, message: "test error" };
  assertTrue(isError(errorResult));
});

test("identifies success results correctly", () => {
  const successResult: TaxResult = {
    subtotal: 100,
    tax: 8,
    total: 108,
    effectiveRate: 0.08,
    currency: "USD",
  };
  assertFalse(isError(successResult));
});

test("handles null input", () => {
  assertFalse(isError(null));
});

test("handles undefined input", () => {
  assertFalse(isError(undefined));
});

// -----------------------------------------------------------------------------
// Test Summary
// -----------------------------------------------------------------------------

console.log("\n" + "=".repeat(60));
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60) + "\n");

if (failed > 0) {
  process.exit(1);
}
