/**
 * Unit Tests for API Validator Tool
 *
 * These tests verify the validation logic WITHOUT running the full agent.
 * This is essential for development workflow - you can test your tool logic
 * quickly without making API calls to Claude.
 *
 * Run with: npx tsx src/api-validator.test.ts
 *
 * BEST PRACTICE: Always unit test your tool's business logic separately
 * from integration testing with the agent. This allows:
 * - Fast iteration during development
 * - No API costs for testing logic
 * - Easy debugging of edge cases
 * - CI/CD pipeline integration
 */

import { validateApiResponse, ValidationResult } from "./api-validator.js";

// -----------------------------------------------------------------------------
// Simple Test Framework (no dependencies required)
// -----------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name: string, fn: () => Promise<void> | void) {
  return Promise.resolve(fn())
    .then(() => {
      console.log(`  ✓ ${name}`);
      passed++;
    })
    .catch((error) => {
      console.log(`  ✗ ${name}`);
      console.log(`    Error: ${error instanceof Error ? error.message : error}`);
      failed++;
    });
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
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

function assertIncludes(array: string[] | null, item: string, message?: string) {
  if (!array || !array.some((i) => i.includes(item))) {
    throw new Error(message || `Expected array to include "${item}", got ${JSON.stringify(array)}`);
  }
}

// -----------------------------------------------------------------------------
// Mock fetch for controlled testing
// -----------------------------------------------------------------------------

// Store original fetch
const originalFetch = globalThis.fetch;

// Helper to create mock responses
function mockFetch(response: {
  status?: number;
  ok?: boolean;
  json?: () => Promise<unknown>;
  delay?: number;
}) {
  globalThis.fetch = async () => {
    if (response.delay) {
      await new Promise((resolve) => setTimeout(resolve, response.delay));
    }
    return {
      status: response.status ?? 200,
      ok: response.ok ?? (response.status ?? 200) >= 200 && (response.status ?? 200) < 300,
      json: response.json ?? (async () => ({})),
    } as Response;
  };
}

// Helper to mock network errors
function mockFetchError(errorMessage: string) {
  globalThis.fetch = async () => {
    throw new Error(errorMessage);
  };
}

// Restore original fetch
function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// -----------------------------------------------------------------------------
// Tests: Successful Responses
// -----------------------------------------------------------------------------

async function runTests() {
  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: validateApiResponse() - Success Cases");
  console.log("=".repeat(60) + "\n");

  await test("validates successful response with all expected fields", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1, name: "Test", email: "test@example.com" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name", "email"],
      1000
    );

    assertTrue(result.success, "Should be successful");
    assertEqual(result.statusCode, 200);
    assertTrue(result.schemaValid, "Schema should be valid");
    assertEqual(result.schemaErrors, null);
    assertEqual(result.breakingChanges, null);
  });

  await test("detects extra fields as warnings", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1, name: "Test", secretField: "leaked" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name"],
      1000
    );

    assertTrue(result.success, "Should still be successful");
    assertTrue(result.warnings.length > 0, "Should have warnings");
    assertIncludes(result.warnings, "secretField", "Should warn about extra field");
  });

  // -----------------------------------------------------------------------------
  // Tests: Breaking Changes
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: validateApiResponse() - Breaking Changes");
  console.log("=".repeat(60) + "\n");

  await test("detects missing required fields as breaking changes", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1 }), // Missing 'name' and 'email'
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name", "email"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertFalse(result.schemaValid, "Schema should be invalid");
    assertTrue(result.breakingChanges !== null, "Should have breaking changes");
    assertIncludes(result.breakingChanges, "name", "Should report missing 'name'");
    assertIncludes(result.breakingChanges, "email", "Should report missing 'email'");
  });

  await test("detects single missing field", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1, name: "Test" }), // Missing 'email'
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id", "name", "email"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertTrue(result.breakingChanges !== null, "Should have breaking changes");
    assertEqual(result.breakingChanges?.length, 1, "Should have exactly one breaking change");
    assertIncludes(result.breakingChanges, "email", "Should report missing 'email'");
  });

  // -----------------------------------------------------------------------------
  // Tests: HTTP Errors
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: validateApiResponse() - HTTP Errors");
  console.log("=".repeat(60) + "\n");

  await test("handles 404 Not Found", async () => {
    mockFetch({
      status: 404,
      ok: false,
      json: async () => ({ error: "Not found" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/999"),
      "GET",
      ["id"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertEqual(result.statusCode, 404);
    assertTrue(result.schemaErrors !== null, "Should have schema errors");
    assertIncludes(result.schemaErrors, "404", "Should report 404 error");
  });

  await test("handles 500 Internal Server Error", async () => {
    mockFetch({
      status: 500,
      ok: false,
      json: async () => ({ error: "Internal error" }),
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertEqual(result.statusCode, 500);
    assertIncludes(result.schemaErrors, "500", "Should report 500 error");
  });

  // -----------------------------------------------------------------------------
  // Tests: SLA / Performance
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: validateApiResponse() - SLA / Performance");
  console.log("=".repeat(60) + "\n");

  await test("passes when response is within SLA", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1 }),
      delay: 50, // 50ms delay
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id"],
      1000 // 1000ms SLA
    );

    assertFalse(result.performanceIssues.exceedsSLA, "Should not exceed SLA");
    assertEqual(result.performanceIssues.slaThresholdMs, 1000);
  });

  await test("detects SLA violation", async () => {
    mockFetch({
      status: 200,
      json: async () => ({ id: 1 }),
      delay: 200, // 200ms delay
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id"],
      100 // 100ms SLA - will be exceeded
    );

    assertTrue(result.performanceIssues.exceedsSLA, "Should exceed SLA");
    assertTrue(result.performanceIssues.actualLatencyMs >= 200, "Should record actual latency");
    assertTrue(result.warnings.length > 0, "Should have warning about SLA");
  });

  // -----------------------------------------------------------------------------
  // Tests: Network Errors
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: validateApiResponse() - Network Errors");
  console.log("=".repeat(60) + "\n");

  await test("handles network errors gracefully", async () => {
    mockFetchError("Failed to fetch");

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id"],
      1000
    );

    assertFalse(result.success, "Should not be successful");
    assertEqual(result.statusCode, 0, "Status code should be 0 for network errors");
    assertTrue(result.schemaErrors !== null, "Should have schema errors");
    assertIncludes(result.schemaErrors, "Network error", "Should report network error");
    assertIncludes(result.warnings, "could not reach", "Should have warning about endpoint");
  });

  // -----------------------------------------------------------------------------
  // Tests: Invalid JSON
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log("UNIT TESTS: validateApiResponse() - Invalid JSON");
  console.log("=".repeat(60) + "\n");

  await test("handles non-JSON responses", async () => {
    mockFetch({
      status: 200,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const result = await validateApiResponse(
      new URL("https://api.example.com/users/1"),
      "GET",
      ["id"],
      1000
    );

    assertTrue(result.schemaErrors !== null, "Should have schema errors");
    assertIncludes(result.schemaErrors, "not valid JSON", "Should report JSON parsing error");
  });

  // Restore fetch after tests
  restoreFetch();

  // -----------------------------------------------------------------------------
  // Test Summary
  // -----------------------------------------------------------------------------

  console.log("\n" + "=".repeat(60));
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(60) + "\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
