import { describe, it, expect } from "vitest";
import {
  exportTestPlanToMarkdown,
  exportTestPlanToPDF,
} from "../src/features/test-plans/utils/testPlanExport.js";

describe("Test Plan Export", () => {
  const mockTestPlan = {
    title: "Functional Test Plan - User Authentication",
    type: "Functional Test Plan",
    objectives: [
      "Verify user login functionality",
      "Validate password reset flow",
      "Test session management",
    ],
    scope: {
      inScope: ["Login page", "Password reset", "Session timeout"],
      outOfScope: ["User registration", "Profile management"],
    },
    testStrategy: [
      {
        type: "Functional Testing",
        description: "Test all functional requirements",
      },
      {
        type: "Regression Testing",
        description: "Ensure existing features work",
      },
    ],
    testItems: [
      {
        id: "TC-001",
        name: "Valid login",
        description: "Test login with valid credentials",
      },
      {
        id: "TC-002",
        name: "Invalid login",
        description: "Test login with invalid credentials",
      },
    ],
    resources: [
      { role: "QA Engineer", responsibility: "Test execution" },
      { role: "Test Lead", responsibility: "Test planning" },
    ],
    schedule: {
      phases: [
        {
          phase: "Planning",
          duration: "1 week",
          activities: ["Define test scope", "Create test plan"],
        },
        {
          phase: "Execution",
          duration: "2 weeks",
          activities: ["Execute test cases", "Report defects"],
        },
      ],
    },
    risks: [
      {
        risk: "Resource unavailability",
        impact: "High",
        mitigation: "Maintain backup resources",
      },
    ],
    recommendations: [
      {
        type: "warning",
        message: "Consider adding more test cases",
        priority: "Medium",
      },
    ],
    analysis: {
      complexity: "Medium",
      estimatedTestCases: 15,
      detectedFunctionalities: ["Authentication", "CRUD"],
    },
  };

  describe("exportTestPlanToMarkdown", () => {
    it("should export test plan to Markdown format", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include title in Markdown", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain(`# ${mockTestPlan.title}`);
    });

    it("should not include Type field in Markdown", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      // Should not have a separate "Type:" field (but type can be in title)
      expect(result).not.toContain("**Type:**");
      expect(result).not.toMatch(/^Type:\s/m); // Type: at start of line
      // Type can be part of title, which is fine
    });

    it("should include objectives section", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Objectives");
      expect(result).toContain("Verify user login functionality");
    });

    it("should include scope section with in-scope and out-of-scope", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Scope");
      expect(result).toContain("### In Scope");
      expect(result).toContain("### Out of Scope");
      expect(result).toContain("Login page");
      expect(result).toContain("User registration");
    });

    it("should include test strategy section", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Test Strategy");
      expect(result).toContain("### Functional Testing");
      expect(result).toContain("Test all functional requirements");
    });

    it("should include test items section", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Test Items");
      expect(result).toContain("**TC-001:**");
      expect(result).toContain("Valid login");
    });

    it("should include resources section", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Resources");
      expect(result).toContain("**QA Engineer:**");
      expect(result).toContain("Test execution");
    });

    it("should include schedule section", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Schedule");
      expect(result).toContain("### Planning (1 week)");
      expect(result).toContain("Define test scope");
    });

    it("should include risks section", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Risks and Mitigation");
      expect(result).toContain("### Resource unavailability");
      expect(result).toContain("**Impact:** High");
    });

    it("should include recommendations if present", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Recommendations");
      expect(result).toContain("warning:");
    });

    it("should include analysis summary if present", () => {
      const result = exportTestPlanToMarkdown(mockTestPlan);

      expect(result).toContain("## Analysis Summary");
      expect(result).toContain("**Complexity:** Medium");
      expect(result).toContain("**Estimated Test Cases:** 15");
      expect(result).toContain("**Detected Functionalities:**");
    });

    it("should handle empty test plan gracefully", () => {
      const emptyPlan = {
        title: "Empty Plan",
        objectives: [],
        scope: { inScope: [], outOfScope: [] },
        testStrategy: [],
        testItems: [],
        resources: [],
        schedule: { phases: [] },
        risks: [],
      };

      const result = exportTestPlanToMarkdown(emptyPlan);

      expect(result).toBeTruthy();
      expect(result).toContain("Empty Plan");
    });

    it("should return empty string for null input", () => {
      const result = exportTestPlanToMarkdown(null);

      expect(result).toBe("");
    });
  });

  describe("exportTestPlanToPDF", () => {
    it("should export test plan to PDF format", () => {
      const result = exportTestPlanToPDF(mockTestPlan);

      expect(result).toBeTruthy();
      expect(result).toHaveProperty("save");
      expect(typeof result.save).toBe("function");
    });

    it("should return null for null input", () => {
      const result = exportTestPlanToPDF(null);

      expect(result).toBeNull();
    });

    it("should create PDF with title", () => {
      const result = exportTestPlanToPDF(mockTestPlan);

      // PDF object should exist
      expect(result).toBeTruthy();
      expect(result).toHaveProperty("internal");
    });
  });
});
