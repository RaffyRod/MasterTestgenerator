import {
  analyzeProjectInfo,
  extractAcceptanceCriteria,
  extractIntelligentTitle,
  generateIntelligentItemName,
} from "@core/analysis/intelligentAnalyzer.js";

/**
 * Formats functionality type name for display
 * @param {string} type - The functionality type (e.g., 'crud', 'authentication')
 * @returns {string} - Formatted name (e.g., 'CRUD', 'Authentication')
 */
function formatFunctionalityName(type) {
  if (!type) return type;

  // Special case: CRUD should be all uppercase
  if (type.toLowerCase() === "crud") {
    return "CRUD";
  }

  // Capitalize first letter of other functionality types
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export async function generateTestPlan(
  projectInfo,
  planType = "comprehensive",
  useAIForTitle = false,
) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return null;
  }

  // Analyze project info for intelligent recommendations
  const analysis = analyzeProjectInfo(projectInfo);
  const acceptanceCriteria = extractAcceptanceCriteria(projectInfo);

  const planTypeConfig = getPlanTypeConfig(planType);

  const intelligentTitle = await extractIntelligentTitle(
    projectInfo,
    planType,
    useAIForTitle,
  );
  const plan = {
    title: `${planTypeConfig.titlePrefix}${intelligentTitle}`,
    type: planTypeConfig.name,
    objectives: generateObjectives(projectInfo, analysis, planType),
    scope: generateScope(projectInfo, analysis, planType),
    testStrategy: generateTestStrategy(projectInfo, analysis, planType),
    testItems: generateTestItems(projectInfo, acceptanceCriteria, planType),
    resources: generateResources(analysis),
    schedule: generateSchedule(analysis),
    risks: generateRisks(projectInfo, analysis),
    recommendations: analysis.recommendations || [],
    analysis: {
      complexity: analysis.complexity,
      detectedFunctionalities: analysis.detectedFunctionalities.map((f) =>
        formatFunctionalityName(f.type),
      ),
      estimatedTestCases: analysis.estimatedTestCases,
    },
  };

  return plan;
}

function getPlanTypeConfig(planType) {
  const configs = {
    functional: {
      name: "Functional Test Plan",
      titlePrefix: "Functional Test Plan - ",
      focus: "functional requirements, user stories, and business logic",
    },
    performance: {
      name: "Performance Test Plan",
      titlePrefix: "Performance Test Plan - ",
      focus:
        "system performance, load testing, stress testing, and scalability",
    },
    security: {
      name: "Security Test Plan",
      titlePrefix: "Security Test Plan - ",
      focus:
        "security vulnerabilities, authentication, authorization, and data protection",
    },
    integration: {
      name: "Integration Test Plan",
      titlePrefix: "Integration Test Plan - ",
      focus: "integration between components, APIs, and external systems",
    },
    system: {
      name: "System Test Plan",
      titlePrefix: "System Test Plan - ",
      focus: "end-to-end system functionality and user workflows",
    },
    acceptance: {
      name: "Acceptance Test Plan",
      titlePrefix: "Acceptance Test Plan - ",
      focus: "user acceptance criteria and business requirements validation",
    },
    regression: {
      name: "Regression Test Plan",
      titlePrefix: "Regression Test Plan - ",
      focus: "existing functionality verification after changes",
    },
    comprehensive: {
      name: "Comprehensive Test Plan",
      titlePrefix: "Comprehensive Test Plan - ",
      focus:
        "all aspects of testing including functional, performance, security, and integration",
    },
    shiftLeft: {
      name: "Shift-Left Test Plan",
      titlePrefix: "Shift-Left Test Plan - ",
      focus:
        "early testing in SDLC, unit tests, integration tests, and TDD practices",
    },
    shiftRight: {
      name: "Shift-Right Test Plan",
      titlePrefix: "Shift-Right Test Plan - ",
      focus:
        "production testing, monitoring, A/B testing, and user feedback validation",
    },
    continuous: {
      name: "Continuous Testing Plan",
      titlePrefix: "Continuous Testing Plan - ",
      focus:
        "CI/CD integrated testing, automated test execution, and continuous validation",
    },
    tdd: {
      name: "TDD Test Plan",
      titlePrefix: "TDD Test Plan - ",
      focus:
        "Test-Driven Development with unit tests written before implementation",
    },
    bdd: {
      name: "BDD Test Plan",
      titlePrefix: "BDD Test Plan - ",
      focus:
        "Behavior-Driven Development with Gherkin scenarios and acceptance criteria",
    },
    apiFirst: {
      name: "API-First Test Plan",
      titlePrefix: "API-First Test Plan - ",
      focus: "API contract testing, schema validation, and integration testing",
    },
    devops: {
      name: "DevOps Test Plan",
      titlePrefix: "DevOps Test Plan - ",
      focus:
        "testing in DevOps pipeline with automation, infrastructure testing, and deployment validation",
    },
  };
  return configs[planType] || configs.comprehensive;
}

function generateObjectives(
  projectInfo,
  analysis = null,
  planType = "comprehensive",
) {
  const objectives = [];
  const lowerText = projectInfo.toLowerCase();
  const planTypeConfig = getPlanTypeConfig(planType);

  // Base objectives based on plan type
  switch (planType) {
    case "functional":
      objectives.push(
        "Verify that all functional requirements are met according to specifications",
      );
      objectives.push(
        "Validate user stories and business logic implementation",
      );
      objectives.push("Ensure all features work as expected");
      objectives.push("Identify functional defects and inconsistencies");
      break;
    case "performance":
      objectives.push(
        "Validate system performance under normal and peak load conditions",
      );
      objectives.push(
        "Measure and verify response times meet specified requirements",
      );
      objectives.push(
        "Identify performance bottlenecks and optimization opportunities",
      );
      objectives.push(
        "Ensure system scalability and resource utilization efficiency",
      );
      break;
    case "security":
      objectives.push(
        "Identify security vulnerabilities and potential threats",
      );
      objectives.push("Validate authentication and authorization mechanisms");
      objectives.push("Ensure data protection and privacy compliance");
      objectives.push(
        "Test for common security flaws (SQL injection, XSS, CSRF, etc.)",
      );
      break;
    case "integration":
      objectives.push("Verify integration between different system components");
      objectives.push("Validate API endpoints and data exchange");
      objectives.push("Ensure proper error handling in integration points");
      objectives.push("Test compatibility with external systems and services");
      break;
    case "system":
      objectives.push("Validate end-to-end system functionality");
      objectives.push("Test complete user workflows and scenarios");
      objectives.push("Ensure system meets business requirements");
      objectives.push("Verify system behavior in production-like environment");
      break;
    case "acceptance":
      objectives.push("Validate that system meets user acceptance criteria");
      objectives.push("Ensure business requirements are fully satisfied");
      objectives.push("Verify system is ready for production deployment");
      objectives.push("Confirm user expectations are met");
      break;
    case "regression":
      objectives.push(
        "Verify existing functionality is not broken by new changes",
      );
      objectives.push("Ensure previously fixed defects remain resolved");
      objectives.push("Validate system stability after modifications");
      objectives.push("Confirm backward compatibility is maintained");
      break;
    case "shiftLeft":
      objectives.push(
        "Detect and fix defects early in the development lifecycle",
      );
      objectives.push(
        "Implement unit tests before or alongside code implementation",
      );
      objectives.push("Validate requirements and design through early testing");
      objectives.push(
        "Reduce cost of defect resolution by catching issues early",
      );
      objectives.push(
        "Improve collaboration between developers and testers from the start",
      );
      break;
    case "shiftRight":
      objectives.push("Validate system behavior in production environment");
      objectives.push("Monitor real user interactions and system performance");
      objectives.push(
        "Collect and analyze user feedback for continuous improvement",
      );
      objectives.push("Perform A/B testing and canary deployments");
      objectives.push(
        "Ensure system reliability and performance under real-world conditions",
      );
      break;
    case "continuous":
      objectives.push("Execute automated tests continuously in CI/CD pipeline");
      objectives.push(
        "Provide immediate feedback on code quality and functionality",
      );
      objectives.push("Ensure rapid and reliable software delivery");
      objectives.push(
        "Maintain high code quality through automated validation",
      );
      objectives.push("Enable continuous integration and deployment practices");
      break;
    case "tdd":
      objectives.push(
        "Write unit tests before implementing functionality (Red-Green-Refactor)",
      );
      objectives.push("Ensure code meets requirements from the start");
      objectives.push("Maintain high test coverage and code quality");
      objectives.push(
        "Enable safe refactoring through comprehensive test suite",
      );
      objectives.push("Document expected behavior through test cases");
      break;
    case "bdd":
      objectives.push(
        "Define system behavior using natural language (Gherkin)",
      );
      objectives.push(
        "Ensure alignment between business requirements and implementation",
      );
      objectives.push(
        "Create executable specifications that serve as documentation",
      );
      objectives.push(
        "Facilitate communication between technical and non-technical stakeholders",
      );
      objectives.push(
        "Validate acceptance criteria through automated scenarios",
      );
      break;
    case "apiFirst":
      objectives.push(
        "Validate API contracts and schemas before implementation",
      );
      objectives.push("Ensure API compatibility and versioning compliance");
      objectives.push(
        "Test API endpoints for functionality, performance, and security",
      );
      objectives.push("Validate request/response formats and error handling");
      objectives.push(
        "Ensure seamless integration between API consumers and providers",
      );
      break;
    case "devops":
      objectives.push("Integrate testing seamlessly into DevOps pipeline");
      objectives.push("Automate test execution in deployment workflows");
      objectives.push("Validate infrastructure and configuration changes");
      objectives.push("Ensure rapid feedback on deployment readiness");
      objectives.push(
        "Maintain quality gates throughout the delivery pipeline",
      );
      break;
    case "comprehensive":
    default:
      objectives.push("Verify that all functional requirements are met");
      objectives.push("Ensure system reliability and stability");
      objectives.push("Validate user acceptance criteria");
      objectives.push("Identify and document defects");
      break;
  }

  // Performance objectives - more specific
  if (
    lowerText.includes("performance") ||
    lowerText.includes("rendimiento") ||
    (analysis && analysis.edgeCases.includes("performance"))
  ) {
    objectives.push(
      "Measure and validate system response times under various load conditions",
    );
    objectives.push(
      "Identify performance bottlenecks and resource utilization issues",
    );
    objectives.push("Verify system scalability and capacity limits");
    objectives.push(
      "Ensure performance metrics meet or exceed specified SLA requirements",
    );
  }

  // Security objectives - more specific
  if (
    lowerText.includes("security") ||
    lowerText.includes("seguridad") ||
    (analysis &&
      analysis.detectedFunctionalities.some((f) => f.type === "authentication"))
  ) {
    objectives.push(
      "Identify and document security vulnerabilities and potential attack vectors",
    );
    objectives.push(
      "Validate authentication mechanisms, session management, and access controls",
    );
    objectives.push(
      "Test for common security flaws (SQL injection, XSS, CSRF, authentication bypass)",
    );
    objectives.push(
      "Verify data encryption, secure transmission, and privacy compliance",
    );
    objectives.push(
      "Ensure proper error handling that does not expose sensitive information",
    );
  }

  // API objectives - more specific
  if (
    analysis &&
    analysis.detectedFunctionalities.some((f) => f.type === "api")
  ) {
    objectives.push(
      "Validate API endpoint functionality, request/response formats, and status codes",
    );
    objectives.push(
      "Test API authentication, authorization, and rate limiting mechanisms",
    );
    objectives.push(
      "Verify proper error handling, error codes, and error message formats",
    );
    objectives.push(
      "Ensure API versioning, backward compatibility, and contract compliance",
    );
    objectives.push(
      "Test API performance, response times, and concurrent request handling",
    );
  }

  // Data objectives - more specific
  if (
    lowerText.includes("data") ||
    lowerText.includes("database") ||
    lowerText.includes("datos")
  ) {
    objectives.push(
      "Verify data integrity, consistency, and referential integrity constraints",
    );
    objectives.push(
      "Validate data persistence, retrieval, and transaction handling",
    );
    objectives.push(
      "Test data validation rules, business logic, and data transformation",
    );
    objectives.push(
      "Ensure proper data backup, recovery, and data migration procedures",
    );
    objectives.push("Verify data access controls and data privacy compliance");
  }

  // UI objectives - more specific
  if (
    lowerText.includes("ui") ||
    lowerText.includes("interface") ||
    lowerText.includes("frontend")
  ) {
    objectives.push(
      "Validate user interface elements, layouts, and visual design consistency",
    );
    objectives.push(
      "Test user interactions, navigation flows, and user experience",
    );
    objectives.push(
      "Verify accessibility compliance (WCAG guidelines) and keyboard navigation",
    );
    objectives.push("Ensure responsive design and cross-browser compatibility");
    objectives.push(
      "Test UI performance, loading times, and smooth interactions",
    );
  }

  // Remove duplicates while preserving order
  const uniqueObjectives = [];
  const seen = new Set();
  objectives.forEach((obj) => {
    if (!seen.has(obj)) {
      seen.add(obj);
      uniqueObjectives.push(obj);
    }
  });

  return uniqueObjectives;
}

function generateScope(
  projectInfo,
  analysis = null,
  planType = "comprehensive",
) {
  const scope = {
    inScope: [],
    outOfScope: [],
  };

  const lowerText = projectInfo.toLowerCase();
  const planTypeConfig = getPlanTypeConfig(planType);

  // Base scope based on plan type
  switch (planType) {
    case "functional":
      scope.inScope.push("All functional requirements and user stories");
      scope.inScope.push("Business logic and feature implementation");
      scope.inScope.push("User interface functionality and interactions");
      scope.outOfScope.push("Performance and load testing");
      scope.outOfScope.push("Security penetration testing");
      scope.outOfScope.push("Infrastructure and deployment testing");
      break;
    case "performance":
      scope.inScope.push("System performance under various load conditions");
      scope.inScope.push("Response time and throughput measurements");
      scope.inScope.push("Resource utilization (CPU, memory, network)");
      scope.inScope.push("Scalability and capacity planning");
      scope.outOfScope.push(
        "Functional feature testing (unless performance-related)",
      );
      scope.outOfScope.push("Security testing");
      scope.outOfScope.push("User interface design validation");
      break;
    case "security":
      scope.inScope.push("Authentication and authorization mechanisms");
      scope.inScope.push("Data encryption and protection");
      scope.inScope.push("Security vulnerabilities and threat assessment");
      scope.inScope.push("Compliance with security standards");
      scope.outOfScope.push("Performance testing");
      scope.outOfScope.push("User experience and UI design");
      scope.outOfScope.push(
        "Business logic validation (unless security-related)",
      );
      break;
    case "integration":
      scope.inScope.push("Integration between system components");
      scope.inScope.push("API endpoints and data exchange");
      scope.inScope.push("External system integrations");
      scope.inScope.push("Third-party service integrations");
      scope.outOfScope.push("Individual component unit testing");
      scope.outOfScope.push("User interface testing");
      scope.outOfScope.push("Performance testing (unless integration-related)");
      break;
    case "system":
      scope.inScope.push("End-to-end system functionality");
      scope.inScope.push("Complete user workflows");
      scope.inScope.push("System behavior in production-like environment");
      scope.inScope.push("Cross-module interactions");
      scope.outOfScope.push("Unit testing of individual components");
      scope.outOfScope.push("Code-level testing");
      scope.outOfScope.push("Infrastructure setup and configuration");
      break;
    case "acceptance":
      scope.inScope.push("User acceptance criteria validation");
      scope.inScope.push("Business requirements fulfillment");
      scope.inScope.push("User workflows and scenarios");
      scope.inScope.push("Production readiness assessment");
      scope.outOfScope.push("Technical implementation details");
      scope.outOfScope.push("Performance optimization");
      scope.outOfScope.push("Security penetration testing");
      break;
    case "regression":
      scope.inScope.push("Previously tested functionality");
      scope.inScope.push("Fixed defects verification");
      scope.inScope.push("Critical user paths");
      scope.inScope.push("Core business features");
      scope.outOfScope.push(
        "New feature testing (unless affecting existing features)",
      );
      scope.outOfScope.push("Performance testing");
      scope.outOfScope.push("Security testing");
      break;
    case "shiftLeft":
      scope.inScope.push("Unit testing during development phase");
      scope.inScope.push("Integration testing in early stages");
      scope.inScope.push("Static code analysis and code reviews");
      scope.inScope.push("Test-driven development practices");
      scope.inScope.push("Early requirement and design validation");
      scope.outOfScope.push(
        "End-to-end system testing (unless critical paths)",
      );
      scope.outOfScope.push("Production environment testing");
      scope.outOfScope.push("User acceptance testing");
      break;
    case "shiftRight":
      scope.inScope.push("Production environment testing and monitoring");
      scope.inScope.push("Real user monitoring and analytics");
      scope.inScope.push("A/B testing and feature flags validation");
      scope.inScope.push("Performance monitoring in production");
      scope.inScope.push("User feedback collection and analysis");
      scope.outOfScope.push("Unit testing (covered in development phase)");
      scope.outOfScope.push("Pre-production integration testing");
      break;
    case "continuous":
      scope.inScope.push("Automated test execution in CI/CD pipeline");
      scope.inScope.push("Continuous integration testing");
      scope.inScope.push("Automated regression testing");
      scope.inScope.push("Code quality and security scanning");
      scope.inScope.push("Automated deployment validation");
      scope.outOfScope.push("Manual exploratory testing (unless specified)");
      scope.outOfScope.push("User acceptance testing (separate process)");
      break;
    case "tdd":
      scope.inScope.push("Unit tests written before code implementation");
      scope.inScope.push("Test coverage for all new functionality");
      scope.inScope.push("Refactoring validation through test suite");
      scope.inScope.push("Code quality through test-driven design");
      scope.outOfScope.push("Integration testing (separate phase)");
      scope.outOfScope.push("End-to-end testing (separate phase)");
      break;
    case "bdd":
      scope.inScope.push("Gherkin scenario definitions and execution");
      scope.inScope.push("Acceptance criteria validation");
      scope.inScope.push("Behavior specification and documentation");
      scope.inScope.push("Cross-functional collaboration on requirements");
      scope.outOfScope.push("Low-level unit testing details");
      scope.outOfScope.push("Technical implementation specifics");
      break;
    case "apiFirst":
      scope.inScope.push("API contract and schema validation");
      scope.inScope.push("API endpoint functionality testing");
      scope.inScope.push("Request/response format validation");
      scope.inScope.push("API versioning and backward compatibility");
      scope.inScope.push("API integration and consumer testing");
      scope.outOfScope.push("UI/UX testing (unless API-related)");
      scope.outOfScope.push("Database testing (unless API-related)");
      break;
    case "devops":
      scope.inScope.push("Automated testing in CI/CD pipeline");
      scope.inScope.push("Infrastructure as Code (IaC) validation");
      scope.inScope.push("Configuration and environment testing");
      scope.inScope.push("Deployment and rollback validation");
      scope.inScope.push("Monitoring and observability testing");
      scope.outOfScope.push("Manual testing processes");
      scope.outOfScope.push("Traditional waterfall testing phases");
      break;
    case "comprehensive":
    default:
      // Use existing logic for comprehensive
      break;
  }

  // Add scope based on detected functionalities
  if (analysis) {
    analysis.detectedFunctionalities.forEach((func) => {
      switch (func.type) {
        case "authentication":
          scope.inScope.push("User authentication and authorization flows");
          break;
        case "crud":
          scope.inScope.push("Create, Read, Update, Delete operations");
          break;
        case "payment":
          scope.inScope.push("Payment processing and transaction handling");
          break;
        case "api":
          scope.inScope.push("API endpoints and backend services");
          break;
        case "fileUpload":
          scope.inScope.push("File upload and document management");
          break;
        case "search":
          scope.inScope.push("Search and filtering functionality");
          break;
        case "export":
          scope.inScope.push("Data export and reporting features");
          break;
      }
    });
  }

  // Traditional scope detection
  if (lowerText.includes("api") || lowerText.includes("backend")) {
    if (!scope.inScope.some((s) => s.includes("API"))) {
      scope.inScope.push("API endpoints and backend services");
    }
  }

  if (
    lowerText.includes("ui") ||
    lowerText.includes("frontend") ||
    lowerText.includes("interface")
  ) {
    scope.inScope.push("User interface and user experience");
  }

  if (lowerText.includes("database") || lowerText.includes("data")) {
    scope.inScope.push("Data persistence and database operations");
  }

  // Always include core functionality
  if (scope.inScope.length === 0) {
    scope.inScope.push("Core functionality as described in requirements");
  }

  // Out of scope items
  scope.outOfScope.push(
    "Third-party integrations (unless explicitly specified)",
  );

  if (
    !lowerText.includes("performance") &&
    !lowerText.includes("load") &&
    (!analysis || !analysis.edgeCases.includes("performance"))
  ) {
    scope.outOfScope.push("Performance and load testing (unless specified)");
  }

  if (
    !lowerText.includes("security") &&
    (!analysis ||
      !analysis.detectedFunctionalities.some(
        (f) => f.type === "authentication",
      ))
  ) {
    scope.outOfScope.push("Security penetration testing (unless specified)");
  }

  return scope;
}

function generateTestStrategy(
  projectInfo,
  analysis = null,
  planType = "comprehensive",
) {
  const strategies = [];
  const lowerText = projectInfo.toLowerCase();

  // Strategy based on plan type
  switch (planType) {
    case "functional":
      strategies.push({
        type: "Functional Testing",
        description:
          "Verify that all features work according to specifications and acceptance criteria",
      });
      strategies.push({
        type: "User Story Validation",
        description:
          "Test each user story to ensure it meets acceptance criteria",
      });
      strategies.push({
        type: "Business Logic Testing",
        description: "Validate business rules and logic implementation",
      });
      strategies.push({
        type: "Regression Testing",
        description:
          "Ensure existing functionality is not broken by new changes",
      });
      break;
    case "performance":
      strategies.push({
        type: "Load Testing",
        description: "Test system behavior under expected load conditions",
      });
      strategies.push({
        type: "Stress Testing",
        description: "Test system limits and behavior under extreme load",
      });
      strategies.push({
        type: "Volume Testing",
        description: "Test system with large amounts of data",
      });
      strategies.push({
        type: "Scalability Testing",
        description: "Verify system can handle growth in load and data",
      });
      break;
    case "security":
      strategies.push({
        type: "Authentication Testing",
        description:
          "Validate user authentication mechanisms and password policies",
      });
      strategies.push({
        type: "Authorization Testing",
        description: "Verify access control and permission enforcement",
      });
      strategies.push({
        type: "Vulnerability Testing",
        description:
          "Identify security vulnerabilities (SQL injection, XSS, CSRF, etc.)",
      });
      strategies.push({
        type: "Data Protection Testing",
        description: "Verify data encryption, privacy, and compliance",
      });
      break;
    case "integration":
      strategies.push({
        type: "API Integration Testing",
        description:
          "Test API endpoints, request/response validation, and error handling",
      });
      strategies.push({
        type: "Component Integration",
        description: "Verify interactions between different system components",
      });
      strategies.push({
        type: "External System Integration",
        description:
          "Test integration with third-party services and external systems",
      });
      strategies.push({
        type: "Data Flow Testing",
        description:
          "Validate data exchange and transformation between systems",
      });
      break;
    case "system":
      strategies.push({
        type: "End-to-End Testing",
        description: "Test complete user workflows from start to finish",
      });
      strategies.push({
        type: "System Integration Testing",
        description: "Verify all system components work together correctly",
      });
      strategies.push({
        type: "User Acceptance Testing",
        description:
          "Validate system meets business requirements and user expectations",
      });
      strategies.push({
        type: "Production Readiness Testing",
        description: "Verify system is ready for production deployment",
      });
      break;
    case "acceptance":
      strategies.push({
        type: "User Acceptance Testing",
        description: "Validate system meets user acceptance criteria",
      });
      strategies.push({
        type: "Business Requirements Validation",
        description: "Verify all business requirements are satisfied",
      });
      strategies.push({
        type: "User Workflow Testing",
        description: "Test real-world user scenarios and workflows",
      });
      strategies.push({
        type: "Production Readiness Assessment",
        description: "Evaluate if system is ready for production use",
      });
      break;
    case "regression":
      strategies.push({
        type: "Regression Testing",
        description:
          "Ensure existing functionality is not broken by new changes",
      });
      strategies.push({
        type: "Smoke Testing",
        description:
          "Quick verification of critical functionality after changes",
      });
      strategies.push({
        type: "Sanity Testing",
        description: "Verify that specific bug fixes work correctly",
      });
      strategies.push({
        type: "Critical Path Testing",
        description: "Test most important user workflows and features",
      });
      break;
    case "shiftLeft":
      strategies.push({
        type: "Unit Testing",
        description:
          "Write and execute unit tests during development phase, ideally before code implementation (TDD)",
      });
      strategies.push({
        type: "Early Integration Testing",
        description:
          "Test component integration as soon as components are developed",
      });
      strategies.push({
        type: "Static Code Analysis",
        description:
          "Perform automated code quality and security analysis early in the development cycle",
      });
      strategies.push({
        type: "Requirement Validation",
        description:
          "Validate requirements and design through early testing and prototyping",
      });
      break;
    case "shiftRight":
      strategies.push({
        type: "Production Monitoring",
        description:
          "Monitor system behavior, performance, and errors in production environment",
      });
      strategies.push({
        type: "User Analytics Testing",
        description: "Analyze real user interactions and behavior patterns",
      });
      strategies.push({
        type: "A/B Testing",
        description:
          "Test different versions of features with real users to determine optimal solutions",
      });
      strategies.push({
        type: "Canary Deployments",
        description:
          "Gradually roll out changes to a subset of users to validate in production",
      });
      break;
    case "continuous":
      strategies.push({
        type: "CI/CD Pipeline Testing",
        description:
          "Execute automated tests in continuous integration pipeline on every code commit",
      });
      strategies.push({
        type: "Automated Regression Testing",
        description:
          "Run comprehensive regression test suite automatically to catch regressions early",
      });
      strategies.push({
        type: "Quality Gates",
        description:
          "Implement quality gates that must pass before code can be merged or deployed",
      });
      strategies.push({
        type: "Continuous Monitoring",
        description:
          "Monitor test results and code quality metrics continuously",
      });
      break;
    case "tdd":
      strategies.push({
        type: "Red-Green-Refactor Cycle",
        description:
          "Follow TDD cycle: Write failing test (Red), implement code to pass (Green), refactor (Refactor)",
      });
      strategies.push({
        type: "Unit Test Coverage",
        description:
          "Maintain high unit test coverage to ensure all code paths are tested",
      });
      strategies.push({
        type: "Test-First Development",
        description:
          "Write tests before implementation to define expected behavior and requirements",
      });
      strategies.push({
        type: "Refactoring Safety",
        description:
          "Use comprehensive test suite to safely refactor code while maintaining functionality",
      });
      break;
    case "bdd":
      strategies.push({
        type: "Gherkin Scenario Testing",
        description:
          "Define and execute test scenarios using Gherkin syntax (Given-When-Then)",
      });
      strategies.push({
        type: "Acceptance Criteria Validation",
        description:
          "Validate that acceptance criteria are met through executable specifications",
      });
      strategies.push({
        type: "Behavior Specification",
        description:
          "Use natural language scenarios to specify and validate system behavior",
      });
      strategies.push({
        type: "Cross-Functional Collaboration",
        description:
          "Facilitate communication between developers, testers, and business stakeholders",
      });
      break;
    case "apiFirst":
      strategies.push({
        type: "API Contract Testing",
        description:
          "Validate API contracts and schemas before implementation to ensure compatibility",
      });
      strategies.push({
        type: "API Endpoint Testing",
        description:
          "Test all API endpoints for functionality, request/response validation, and error handling",
      });
      strategies.push({
        type: "API Integration Testing",
        description: "Test integration between API consumers and providers",
      });
      strategies.push({
        type: "API Versioning Testing",
        description:
          "Validate backward compatibility and versioning strategies",
      });
      break;
    case "devops":
      strategies.push({
        type: "Pipeline Integration Testing",
        description: "Integrate testing seamlessly into DevOps CI/CD pipeline",
      });
      strategies.push({
        type: "Infrastructure Testing",
        description:
          "Test Infrastructure as Code (IaC) and configuration changes",
      });
      strategies.push({
        type: "Automated Deployment Testing",
        description:
          "Validate deployments and rollback procedures automatically",
      });
      strategies.push({
        type: "Observability Testing",
        description: "Test monitoring, logging, and alerting systems",
      });
      break;
    case "comprehensive":
    default:
      // Always include functional and regression testing for comprehensive
      strategies.push({
        type: "Functional Testing",
        description:
          "Verify that all features work according to specifications and acceptance criteria",
      });
      strategies.push({
        type: "Regression Testing",
        description:
          "Ensure existing functionality is not broken by new changes",
      });
      break;
  }

  // Add strategies based on detected functionalities
  if (analysis) {
    if (analysis.detectedFunctionalities.some((f) => f.type === "api")) {
      strategies.push({
        type: "API Testing",
        description:
          "Test API endpoints, request/response validation, error handling, and integration points",
      });
    }

    if (
      analysis.detectedFunctionalities.some((f) => f.type === "authentication")
    ) {
      strategies.push({
        type: "Security Testing",
        description:
          "Validate authentication, authorization, and security mechanisms",
      });
    }

    if (analysis.detectedFunctionalities.some((f) => f.type === "validation")) {
      strategies.push({
        type: "Validation Testing",
        description:
          "Test input validation, boundary conditions, and error handling",
      });
    }

    if (analysis.edgeCases.includes("performance")) {
      strategies.push({
        type: "Performance Testing",
        description:
          "Validate system performance under load and stress conditions",
      });
    }
  }

  // Traditional strategy detection - more specific
  if (lowerText.includes("integration") || lowerText.includes("integración")) {
    if (!strategies.some((s) => s.type === "Integration Testing")) {
      strategies.push({
        type: "Integration Testing",
        description:
          "Test interactions between different system components, APIs, and external services. Verify data flow, error handling, and system compatibility across integrated modules.",
      });
    }
  }

  if (
    lowerText.includes("ui") ||
    lowerText.includes("interface") ||
    lowerText.includes("frontend")
  ) {
    if (!strategies.some((s) => s.type === "UI Testing")) {
      strategies.push({
        type: "UI Testing",
        description:
          "Validate user interface elements, layouts, interactions, and user experience. Test accessibility, responsive design, cross-browser compatibility, and UI performance.",
      });
    }
  }

  if (lowerText.includes("database") || lowerText.includes("data")) {
    if (!strategies.some((s) => s.type === "Data Testing")) {
      strategies.push({
        type: "Data Testing",
        description:
          "Verify data integrity, persistence, validation rules, and business logic. Test CRUD operations, transactions, data migration, and data access controls.",
      });
    }
  }

  // Remove duplicates while preserving order
  const uniqueStrategies = [];
  const seen = new Set();
  strategies.forEach((strategy) => {
    const key = strategy.type;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueStrategies.push(strategy);
    }
  });

  return uniqueStrategies;
}

function generateTestItems(
  projectInfo,
  acceptanceCriteria = null,
  planType = "comprehensive",
) {
  const items = [];
  const planTypeConfig = getPlanTypeConfig(planType);

  const prefixMap = {
    performance: "PT",
    security: "ST",
    integration: "IT",
    system: "SYS",
    acceptance: "AT",
    regression: "RT",
    shiftLeft: "SL",
    shiftRight: "SR",
    continuous: "CT",
    tdd: "TDD",
    bdd: "BDD",
    apiFirst: "API",
    devops: "DO",
  };
  const prefix = prefixMap[planType] || "TC";

  const typePrefixes = {
    performance: "Performance",
    security: "Security",
    integration: "Integration",
    shiftLeft: "Shift-Left",
    shiftRight: "Shift-Right",
    continuous: "Continuous",
    tdd: "TDD",
    bdd: "BDD",
    apiFirst: "API",
    devops: "DevOps",
  };

  // Use acceptance criteria if available
  if (acceptanceCriteria && acceptanceCriteria.length > 0) {
    acceptanceCriteria.forEach((ac, index) => {
      // Use intelligent name generation
      const itemName = generateIntelligentItemName(ac.text, planType, index);
      const itemDescription =
        ac.text.length > 200 ? `${ac.text.substring(0, 200)}...` : ac.text;

      items.push({
        id: `${prefix}-${index + 1}`,
        name: itemName,
        description: itemDescription,
        type: ac.type,
      });
    });
  } else {
    // Fallback to line-based extraction with intelligent naming
    const lines = projectInfo
      .split("\n")
      .filter((line) => line.trim().length > 0);
    lines.forEach((line, index) => {
      if (line.trim().length > 0) {
        const itemName = generateIntelligentItemName(
          line.trim(),
          planType,
          index,
        );
        const description =
          line.trim().length > 200
            ? `${line.trim().substring(0, 200)}...`
            : line.trim();

        items.push({
          id: `${prefix}-${index + 1}`,
          name: itemName,
          description: description,
        });
      }
    });
  }

  if (items.length === 0) {
    const defaultNames = {
      performance: "Performance test",
      security: "Security test",
      integration: "Integration test",
      shiftLeft: "Shift-Left unit test",
      shiftRight: "Shift-Right production test",
      continuous: "Continuous integration test",
      tdd: "TDD unit test",
      bdd: "BDD scenario test",
      apiFirst: "API contract test",
      devops: "DevOps pipeline test",
    };
    const defaultName = defaultNames[planType] || "Main functionality test";
    items.push({
      id: `${prefix}-1`,
      name: defaultName,
      description: `Test the main functionality described in the project information (${planTypeConfig.name})`,
    });
  }

  return items;
}

function generateResources(analysis = null) {
  const resources = [
    {
      role: "Test Lead",
      responsibility: "Overall test planning and coordination",
    },
    {
      role: "QA Engineer",
      responsibility: "Test case execution and defect reporting",
    },
  ];

  // Add specialized resources based on analysis
  if (analysis) {
    if (analysis.detectedFunctionalities.some((f) => f.type === "api")) {
      resources.push({
        role: "API Tester",
        responsibility: "API endpoint testing and integration validation",
      });
    }

    if (
      analysis.detectedFunctionalities.some((f) => f.type === "authentication")
    ) {
      resources.push({
        role: "Security Tester",
        responsibility: "Security and authentication testing",
      });
    }

    if (analysis.edgeCases.includes("performance")) {
      resources.push({
        role: "Performance Tester",
        responsibility: "Performance and load testing execution",
      });
    }
  }

  resources.push({
    role: "Developer",
    responsibility: "Fix defects and provide technical support",
  });

  return resources;
}

function generateSchedule(analysis = null) {
  const basePhases = [
    {
      phase: "Test Planning",
      duration: "1 week",
      activities: [
        "Define test strategy",
        "Create test plan",
        "Prepare test environment",
      ],
    },
    {
      phase: "Test Design",
      duration: "2 weeks",
      activities: [
        "Create test cases",
        "Review test cases",
        "Prepare test data",
      ],
    },
    {
      phase: "Test Execution",
      duration: "3 weeks",
      activities: ["Execute test cases", "Report defects", "Retest fixes"],
    },
    {
      phase: "Test Closure",
      duration: "1 week",
      activities: [
        "Final test report",
        "Lessons learned",
        "Archive test artifacts",
      ],
    },
  ];

  // Adjust schedule based on complexity
  if (analysis) {
    if (analysis.complexity === "High") {
      basePhases[1].duration = "3 weeks"; // More time for test design
      basePhases[2].duration = "4 weeks"; // More time for execution

      // Add additional activities for complex projects
      basePhases[1].activities.push(
        "Create detailed test scenarios",
        "Prepare automation scripts",
      );
      basePhases[2].activities.push(
        "Execute regression tests",
        "Performance testing",
      );
    } else if (analysis.complexity === "Low") {
      basePhases[1].duration = "1 week";
      basePhases[2].duration = "2 weeks";
    }

    // Add specialized testing phases
    if (analysis.edgeCases.includes("performance")) {
      basePhases.splice(2, 0, {
        phase: "Performance Testing",
        duration: "1 week",
        activities: ["Load testing", "Stress testing", "Performance analysis"],
      });
    }
  }

  return { phases: basePhases };
}

function generateRisks(projectInfo, analysis = null) {
  const risks = [
    {
      risk: "Incomplete or unclear requirements",
      impact: "High",
      mitigation:
        "Clarify requirements with stakeholders before test execution",
    },
    {
      risk: "Delayed delivery of test environment",
      impact: "Medium",
      mitigation:
        "Request early access to test environment and prepare backup plan",
    },
    {
      risk: "Resource unavailability",
      impact: "Medium",
      mitigation: "Maintain backup resources and cross-train team members",
    },
  ];

  const lowerText = projectInfo.toLowerCase();

  // Complexity-based risks
  if (analysis && analysis.complexity === "High") {
    risks.push({
      risk: "High complexity may require additional testing time and resources",
      impact: "High",
      mitigation:
        "Allocate buffer time, prioritize critical test cases, and consider test automation",
    });
  }

  if (lowerText.includes("complex") || lowerText.includes("complejo")) {
    if (!risks.some((r) => r.risk.includes("complexity"))) {
      risks.push({
        risk: "High complexity may require additional testing time",
        impact: "High",
        mitigation: "Allocate buffer time and prioritize critical test cases",
      });
    }
  }

  // Functionality-specific risks
  if (analysis) {
    if (analysis.detectedFunctionalities.some((f) => f.type === "payment")) {
      risks.push({
        risk: "Payment gateway integration failures",
        impact: "High",
        mitigation:
          "Establish sandbox environment for testing, have fallback payment methods ready",
      });
    }

    if (analysis.detectedFunctionalities.some((f) => f.type === "api")) {
      risks.push({
        risk: "API dependency and integration issues",
        impact: "High",
        mitigation:
          "Mock external APIs for testing, establish service level agreements with API providers",
      });
    }

    if (
      analysis.detectedFunctionalities.some((f) => f.type === "authentication")
    ) {
      risks.push({
        risk: "Security vulnerabilities in authentication flow",
        impact: "High",
        mitigation:
          "Conduct security review, implement proper encryption, and follow security best practices",
      });
    }

    if (analysis.edgeCases.includes("performance")) {
      risks.push({
        risk: "Performance issues under load",
        impact: "Medium",
        mitigation:
          "Conduct early performance testing, optimize critical paths, plan for scalability",
      });
    }
  }

  return risks;
}
