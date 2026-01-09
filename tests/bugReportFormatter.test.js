import { describe, it, expect } from "vitest";
import { formatBugReport } from "../src/features/bug-reports/utils/bugReportFormatter.js";

describe("Bug Report Formatter", () => {
  const mockBugData = {
    title: "App fails on reload",
    description: "The application fails when reloading the main page",
    priority: "High",
    severity: "Critical",
    stepsToReproduce:
      "1. Navigate to the main page\n2. Reload the page\n3. Observe the error",
    expectedResult: "The page should reload successfully",
    actualResult: "The page shows an error message",
    environment: "Production",
    browser: "Chrome",
    operatingSystem: "Windows",
    version: "1.0.0",
    additionalInfo: "This happens only when user is logged off",
  };

  const mockEvidenceFiles = [
    { name: "screenshot.png" },
    { name: "error-log.txt" },
  ];

  describe("formatBugReport", () => {
    it("should format bug report in Jira format", () => {
      const result = formatBugReport(mockBugData, mockEvidenceFiles, "jira");

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain(mockBugData.title);
      expect(result).toContain("**Description:**");
      expect(result).toContain("**Steps to Reproduce:**");
      expect(result).toContain("**Expected Result:**");
      expect(result).toContain("**Actual Result:**");
    });

    it("should format bug report in Markdown format", () => {
      const result = formatBugReport(
        mockBugData,
        mockEvidenceFiles,
        "markdown",
      );

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain(mockBugData.title);
      expect(result).toContain("## Description");
      expect(result).toContain("## Steps to Reproduce");
    });

    it("should format bug report in Plain format", () => {
      const result = formatBugReport(mockBugData, mockEvidenceFiles, "plain");

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain(mockBugData.title);
      expect(result).toContain("DESCRIPTION");
      expect(result).toContain("STEPS TO REPRODUCE");
    });

    it("should default to Jira format when format is not specified", () => {
      const result = formatBugReport(mockBugData, mockEvidenceFiles);

      expect(result).toBeTruthy();
      expect(result).toContain("**Description:**");
    });

    it("should handle empty evidence files", () => {
      const result = formatBugReport(mockBugData, [], "jira");

      expect(result).toBeTruthy();
      // When no evidence files, the Evidence section may not appear or show "No evidence files attached"
      // The important thing is that it doesn't crash
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include evidence file names in the report", () => {
      const result = formatBugReport(mockBugData, mockEvidenceFiles, "jira");

      expect(result).toContain("screenshot.png");
      expect(result).toContain("error-log.txt");
    });

    it("should format steps correctly in Jira format", () => {
      const result = formatBugReport(mockBugData, [], "jira");

      // Steps should be formatted as numbered list (1., 2., 3., etc.)
      expect(result).toContain("1. Navigate");
      expect(result).toContain("2. Reload");
      expect(result).toContain("3. Observe");
    });

    it("should not include Type field in the report", () => {
      const result = formatBugReport(mockBugData, [], "jira");

      // Should not contain "Type:" field
      expect(result).not.toContain("Type:");
      expect(result).not.toContain("**Type:**");
    });

    it("should handle missing optional fields gracefully", () => {
      const minimalBugData = {
        title: "Test bug",
        description: "Test description",
        priority: "Medium",
        severity: "Low",
        stepsToReproduce: "Step 1",
        expectedResult: "Expected",
        actualResult: "Actual",
      };

      const result = formatBugReport(minimalBugData, [], "jira");

      expect(result).toBeTruthy();
      expect(result).toContain("Test bug");
      expect(result).toContain("Test description");
    });

    it("should clean HTML tags from content", () => {
      const bugDataWithHTML = {
        ...mockBugData,
        description: "<h2>Test</h2><p>Description with HTML</p>",
      };

      const result = formatBugReport(bugDataWithHTML, [], "jira");

      expect(result).not.toContain("<h2>");
      expect(result).not.toContain("<p>");
      expect(result).not.toContain("</h2>");
      expect(result).not.toContain("</p>");
    });

    it("should format code blocks correctly in Jira format", () => {
      const bugDataWithCode = {
        ...mockBugData,
        actualResult: "Error: Cannot read property 'name' of null",
      };

      const result = formatBugReport(bugDataWithCode, [], "jira");

      // Code-like errors should be wrapped in {code} tags
      expect(result).toContain("{code}");
    });
  });
});
