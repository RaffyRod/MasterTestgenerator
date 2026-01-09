import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const TEST_RESULTS_DIR = "./test-results";
const REPORT_OUTPUT = "./test-results/test-report.md";

function printConsoleReport(
  results,
  totalTests,
  passedTests,
  failedTests,
  skippedTests,
  successRate,
  duration,
) {
  console.log("\n" + "=".repeat(70));
  console.log("📊 TEST EXECUTION REPORT".padStart(45));
  console.log("=".repeat(70));
  console.log(`\nGenerated: ${new Date().toLocaleString()}\n`);

  console.log("─".repeat(70));
  console.log("SUMMARY");
  console.log("─".repeat(70));
  console.log(`  Total Tests:     ${totalTests}`);
  console.log(`  ✅ Passed:       ${passedTests} (${successRate}%)`);
  console.log(`  ❌ Failed:       ${failedTests}`);
  console.log(`  ⏭️  Skipped:      ${skippedTests}`);
  console.log(`  ⏱️  Duration:      ${duration}s`);
  console.log("─".repeat(70));

  if (failedTests > 0) {
    console.log("\n❌ FAILED TESTS");
    console.log("─".repeat(70));
    results.testResults.forEach((testFile) => {
      const failedCases = testFile.assertionResults.filter(
        (test) => test.status === "failed",
      );

      if (failedCases.length > 0) {
        const fileName = testFile.name.split("/").pop() || testFile.name;
        console.log(`\n  📁 ${fileName}`);
        failedCases.forEach((testCase) => {
          console.log(`     ❌ ${testCase.title}`);
          if (testCase.failureMessages && testCase.failureMessages.length > 0) {
            testCase.failureMessages.forEach((failure) => {
              const lines = failure.split("\n").slice(0, 3);
              lines.forEach((line) => {
                if (line.trim()) {
                  console.log(`        ${line.substring(0, 60)}`);
                }
              });
            });
          }
        });
      }
    });
    console.log("─".repeat(70));
  }

  if (skippedTests > 0) {
    console.log("\n⏭️  SKIPPED TESTS");
    console.log("─".repeat(70));
    results.testResults.forEach((testFile) => {
      const skippedCases = testFile.assertionResults.filter(
        (test) => test.status === "skipped",
      );

      if (skippedCases.length > 0) {
        const fileName = testFile.name.split("/").pop() || testFile.name;
        console.log(`\n  📁 ${fileName}`);
        skippedCases.forEach((testCase) => {
          console.log(`     ⏭️  ${testCase.title}`);
        });
      }
    });
    console.log("─".repeat(70));
  }

  console.log("\n📋 TEST SUITES");
  console.log("─".repeat(70));
  results.testResults.forEach((testFile) => {
    const filePassed = testFile.status === "passed";
    const statusIcon = filePassed ? "✅" : "❌";
    const fileName = testFile.name.split("/").pop() || testFile.name;
    const fileDuration = (
      (testFile.endTime - testFile.startTime) /
      1000
    ).toFixed(2);

    console.log(`\n  ${statusIcon} ${fileName}`);
    console.log(`     Status:   ${testFile.status.toUpperCase()}`);
    console.log(`     Tests:    ${testFile.assertionResults.length}`);
    console.log(`     Duration: ${fileDuration}s`);
  });

  console.log("\n" + "=".repeat(70));
  console.log(`✅ Test report saved to: ${REPORT_OUTPUT}`);
  console.log("=".repeat(70) + "\n");
}

function generateMarkdownReport() {
  try {
    const resultsPath = join(TEST_RESULTS_DIR, "results.json");

    if (!existsSync(resultsPath)) {
      console.warn(
        "⚠️  Test results file not found. Run tests with CI=true first:",
      );
      console.warn("   CI=true pnpm test:run");
      return { success: false, failedTests: 0 };
    }

    const results = JSON.parse(readFileSync(resultsPath, "utf-8"));

    const totalTests = results.numTotalTests || 0;
    const passedTests = results.numPassedTests || 0;
    const failedTests = results.numFailedTests || 0;
    const skippedTests = results.numSkippedTests || 0;

    let duration = "N/A";
    if (results.startTime && results.endTime) {
      duration = ((results.endTime - results.startTime) / 1000).toFixed(2);
    } else if (results.testResults && results.testResults.length > 0) {
      const totalDuration = results.testResults.reduce((sum, file) => {
        return sum + (file.endTime - file.startTime);
      }, 0);
      duration = (totalDuration / 1000).toFixed(2);
    }

    const successRate =
      totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

    let report = `# Test Execution Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `---\n\n`;

    report += `## Summary\n\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Tests | ${totalTests} |\n`;
    report += `| ✅ Passed | ${passedTests} |\n`;
    report += `| ❌ Failed | ${failedTests} |\n`;
    report += `| ⏭️ Skipped | ${skippedTests} |\n`;
    report += `| ⏱️ Duration | ${duration}s |\n`;
    report += `| 📊 Success Rate | ${successRate}% |\n\n`;

    if (failedTests > 0) {
      report += `## ❌ Failed Tests\n\n`;

      results.testResults.forEach((testFile) => {
        const failedCases = testFile.assertionResults.filter(
          (test) => test.status === "failed",
        );

        if (failedCases.length > 0) {
          report += `### ${testFile.name}\n\n`;

          failedCases.forEach((testCase) => {
            report += `#### ❌ ${testCase.title}\n\n`;

            if (
              testCase.failureMessages &&
              testCase.failureMessages.length > 0
            ) {
              testCase.failureMessages.forEach((failure) => {
                report += `\`\`\`\n${failure}\n\`\`\`\n\n`;
              });
            }

            if (testCase.failureDetails) {
              report += `**Details:** ${testCase.failureDetails}\n\n`;
            }
          });
        }
      });
    }

    if (skippedTests > 0) {
      report += `## ⏭️ Skipped Tests\n\n`;

      results.testResults.forEach((testFile) => {
        const skippedCases = testFile.assertionResults.filter(
          (test) => test.status === "skipped",
        );

        if (skippedCases.length > 0) {
          report += `### ${testFile.name}\n\n`;
          skippedCases.forEach((testCase) => {
            report += `- ${testCase.title}\n`;
          });
          report += `\n`;
        }
      });
    }

    report += `## 📋 Test Suites\n\n`;

    results.testResults.forEach((testFile) => {
      const filePassed = testFile.status === "passed";
      const statusIcon = filePassed ? "✅" : "❌";
      const fileName = testFile.name.split("/").pop() || testFile.name;

      report += `### ${statusIcon} ${fileName}\n\n`;
      report += `- **Status:** ${testFile.status}\n`;
      report += `- **Tests:** ${testFile.assertionResults.length}\n`;
      report += `- **Duration:** ${(testFile.endTime - testFile.startTime) / 1000}s\n\n`;

      if (testFile.assertionResults.length > 0) {
        report += `**Test Cases:**\n\n`;
        testFile.assertionResults.forEach((testCase) => {
          const caseIcon =
            testCase.status === "passed"
              ? "✅"
              : testCase.status === "failed"
                ? "❌"
                : "⏭️";
          report += `- ${caseIcon} ${testCase.title} (${testCase.duration || 0}ms)\n`;
        });
        report += `\n`;
      }
    });

    report += `---\n\n`;
    report += `*Report generated automatically by CI*\n`;

    mkdirSync(TEST_RESULTS_DIR, { recursive: true });
    writeFileSync(REPORT_OUTPUT, report, "utf-8");

    printConsoleReport(
      results,
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      successRate,
      duration,
    );

    return { success: true, failedTests };
  } catch (error) {
    console.error("Error generating test report:", error);
    return { success: false, error: error.message };
  }
}

const result = generateMarkdownReport();
process.exit(result.failedTests > 0 ? 1 : 0);
