import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateTestPlan } from "../src/features/test-plans/generators/testPlanGenerator.js";

describe("Test Plan Generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateTestPlan", () => {
    it("should generate a test plan for valid project info", async () => {
      const projectInfo =
        "User login functionality with email and password authentication";

      const result = await generateTestPlan(projectInfo, "functional", false);

      expect(result).toBeTruthy();
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("objectives");
      expect(result).toHaveProperty("scope");
      expect(result).toHaveProperty("testStrategy");
      expect(result).toHaveProperty("testItems");
      expect(result).toHaveProperty("resources");
      expect(result).toHaveProperty("schedule");
      expect(result).toHaveProperty("risks");
    });

    it("should return null for empty project info", async () => {
      const result = await generateTestPlan("", "functional", false);

      expect(result).toBeNull();
    });

    it("should return null for null project info", async () => {
      const result = await generateTestPlan(null, "functional", false);

      expect(result).toBeNull();
    });

    it("should generate plan with correct type", async () => {
      const projectInfo = "Payment processing system";

      const functionalPlan = await generateTestPlan(
        projectInfo,
        "functional",
        false,
      );
      const performancePlan = await generateTestPlan(
        projectInfo,
        "performance",
        false,
      );

      expect(functionalPlan.type).toBe("Functional Test Plan");
      expect(performancePlan.type).toBe("Performance Test Plan");
    });

    it("should generate title without Type prefix in the title itself", async () => {
      const projectInfo = "User authentication system";

      const result = await generateTestPlan(projectInfo, "functional", false);

      expect(result.title).toBeTruthy();
      // Title should start with the plan type prefix
      expect(result.title).toContain("Functional Test Plan -");
      // But should not have "Type:" in the title
      expect(result.title).not.toContain("Type:");
    });

    it("should generate objectives based on plan type", async () => {
      const projectInfo = "Security testing for login system";

      const securityPlan = await generateTestPlan(
        projectInfo,
        "security",
        false,
      );

      expect(securityPlan.objectives.length).toBeGreaterThan(0);
      // Security plan should have security-related objectives
      const objectivesText = securityPlan.objectives.join(" ").toLowerCase();
      expect(
        objectivesText.includes("security") ||
          objectivesText.includes("vulnerability") ||
          objectivesText.includes("authentication"),
      ).toBe(true);
    });

    it("should generate scope with in-scope and out-of-scope items", async () => {
      const projectInfo = "E-commerce checkout process";

      const result = await generateTestPlan(projectInfo, "functional", false);

      expect(result.scope).toHaveProperty("inScope");
      expect(result.scope).toHaveProperty("outOfScope");
      expect(Array.isArray(result.scope.inScope)).toBe(true);
      expect(Array.isArray(result.scope.outOfScope)).toBe(true);
      expect(result.scope.inScope.length).toBeGreaterThan(0);
    });

    it("should generate test strategy items", async () => {
      const projectInfo = "API integration testing";

      const result = await generateTestPlan(projectInfo, "integration", false);

      expect(result.testStrategy.length).toBeGreaterThan(0);
      expect(result.testStrategy[0]).toHaveProperty("type");
      expect(result.testStrategy[0]).toHaveProperty("description");
    });

    it("should generate test items", async () => {
      const projectInfo = "User registration and login flow";

      const result = await generateTestPlan(projectInfo, "functional", false);

      expect(result.testItems.length).toBeGreaterThan(0);
      expect(result.testItems[0]).toHaveProperty("id");
      expect(result.testItems[0]).toHaveProperty("name");
    });

    it("should generate resources", async () => {
      const projectInfo = "Mobile app testing";

      const result = await generateTestPlan(projectInfo, "functional", false);

      expect(result.resources.length).toBeGreaterThan(0);
      expect(result.resources[0]).toHaveProperty("role");
      expect(result.resources[0]).toHaveProperty("responsibility");
    });

    it("should generate schedule with phases", async () => {
      const projectInfo = "End-to-end testing";

      const result = await generateTestPlan(projectInfo, "system", false);

      expect(result.schedule).toHaveProperty("phases");
      expect(Array.isArray(result.schedule.phases)).toBe(true);
      expect(result.schedule.phases.length).toBeGreaterThan(0);
      expect(result.schedule.phases[0]).toHaveProperty("phase");
      expect(result.schedule.phases[0]).toHaveProperty("duration");
      expect(result.schedule.phases[0]).toHaveProperty("activities");
    });

    it("should generate risks", async () => {
      const projectInfo = "Critical system testing";

      const result = await generateTestPlan(projectInfo, "functional", false);

      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.risks[0]).toHaveProperty("risk");
      expect(result.risks[0]).toHaveProperty("impact");
      expect(result.risks[0]).toHaveProperty("mitigation");
    });

    it("should include analysis summary", async () => {
      const projectInfo = "Complex multi-module application";

      const result = await generateTestPlan(
        projectInfo,
        "comprehensive",
        false,
      );

      expect(result.analysis).toBeTruthy();
      expect(result.analysis).toHaveProperty("complexity");
      expect(result.analysis).toHaveProperty("estimatedTestCases");
      expect(result.analysis).toHaveProperty("detectedFunctionalities");
    });

    it("should use AI for title when useAIForTitle is true", async () => {
      const projectInfo = "The app is failing after reloading the main page";

      // Mock console.warn to suppress AI warnings
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      // Mock fetch for AI calls
      global.fetch = vi
        .fn()
        .mockRejectedValue(new Error("AI not available in tests"));

      const result = await generateTestPlan(projectInfo, "functional", true);

      expect(result).toBeTruthy();
      expect(result.title).toBeTruthy();
      // Should still generate a title even if AI fails (fallback)
      expect(result.title.length).toBeGreaterThan(0);

      consoleWarnSpy.mockRestore();
    });

    it("should default to comprehensive plan type", async () => {
      const projectInfo = "General application testing";

      const result = await generateTestPlan(projectInfo, "invalid-type", false);

      // Should default to comprehensive
      expect(result.type).toBe("Comprehensive Test Plan");
    });
  });
});
