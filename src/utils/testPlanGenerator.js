import { analyzeProjectInfo, extractAcceptanceCriteria } from './intelligentAnalyzer'

export function generateTestPlan(projectInfo, planType = 'comprehensive') {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return null
  }

  // Analyze project info for intelligent recommendations
  const analysis = analyzeProjectInfo(projectInfo)
  const acceptanceCriteria = extractAcceptanceCriteria(projectInfo)

  const planTypeConfig = getPlanTypeConfig(planType)

  const plan = {
    title: `${planTypeConfig.titlePrefix}${extractPlanTitle(projectInfo)}`,
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
      detectedFunctionalities: analysis.detectedFunctionalities.map(f => f.type),
      estimatedTestCases: analysis.estimatedTestCases
    }
  }

  return plan
}

function getPlanTypeConfig(planType) {
  const configs = {
    functional: {
      name: 'Functional Test Plan',
      titlePrefix: 'Functional Test Plan - ',
      focus: 'functional requirements, user stories, and business logic'
    },
    performance: {
      name: 'Performance Test Plan',
      titlePrefix: 'Performance Test Plan - ',
      focus: 'system performance, load testing, stress testing, and scalability'
    },
    security: {
      name: 'Security Test Plan',
      titlePrefix: 'Security Test Plan - ',
      focus: 'security vulnerabilities, authentication, authorization, and data protection'
    },
    integration: {
      name: 'Integration Test Plan',
      titlePrefix: 'Integration Test Plan - ',
      focus: 'integration between components, APIs, and external systems'
    },
    system: {
      name: 'System Test Plan',
      titlePrefix: 'System Test Plan - ',
      focus: 'end-to-end system functionality and user workflows'
    },
    acceptance: {
      name: 'Acceptance Test Plan',
      titlePrefix: 'Acceptance Test Plan - ',
      focus: 'user acceptance criteria and business requirements validation'
    },
    regression: {
      name: 'Regression Test Plan',
      titlePrefix: 'Regression Test Plan - ',
      focus: 'existing functionality verification after changes'
    },
    comprehensive: {
      name: 'Comprehensive Test Plan',
      titlePrefix: 'Comprehensive Test Plan - ',
      focus: 'all aspects of testing including functional, performance, security, and integration'
    }
  }
  return configs[planType] || configs.comprehensive
}

function extractPlanTitle(projectInfo) {
  const lines = projectInfo.split('\n')
  const firstLine = lines[0]?.trim()

  if (firstLine && firstLine.length > 0) {
    return `Test Plan: ${firstLine.substring(0, 100)}`
  }

  return 'Test Plan'
}

function generateObjectives(projectInfo, analysis = null, planType = 'comprehensive') {
  const objectives = [
    'Verify that all functional requirements are met',
    'Ensure system reliability and stability',
    'Validate user acceptance criteria',
    'Identify and document defects'
  ]

  const lowerText = projectInfo.toLowerCase()

  // Performance objectives
  if (
    lowerText.includes('performance') ||
    lowerText.includes('rendimiento') ||
    (analysis && analysis.edgeCases.includes('performance'))
  ) {
    objectives.push('Validate system performance under load')
    objectives.push('Ensure response times meet specified requirements')
  }

  // Security objectives
  if (
    lowerText.includes('security') ||
    lowerText.includes('seguridad') ||
    (analysis && analysis.detectedFunctionalities.some(f => f.type === 'authentication'))
  ) {
    objectives.push('Verify security requirements and data protection')
    objectives.push('Validate authentication and authorization mechanisms')
  }

  // API objectives
  if (analysis && analysis.detectedFunctionalities.some(f => f.type === 'api')) {
    objectives.push('Validate API endpoints and integration points')
    objectives.push('Ensure proper error handling and response codes')
  }

  // Data objectives
  if (lowerText.includes('data') || lowerText.includes('database') || lowerText.includes('datos')) {
    objectives.push('Verify data integrity and persistence')
    objectives.push('Validate data validation and business rules')
  }

  // UI objectives
  if (
    lowerText.includes('ui') ||
    lowerText.includes('interface') ||
    lowerText.includes('frontend')
  ) {
    objectives.push('Validate user interface usability and accessibility')
    objectives.push('Ensure consistent user experience across different browsers and devices')
  }

  return objectives
}

function generateScope(projectInfo, analysis = null, planType = 'comprehensive') {
  const scope = {
    inScope: [],
    outOfScope: []
  }

  const lowerText = projectInfo.toLowerCase()

  // Add scope based on detected functionalities
  if (analysis) {
    analysis.detectedFunctionalities.forEach(func => {
      switch (func.type) {
        case 'authentication':
          scope.inScope.push('User authentication and authorization flows')
          break
        case 'crud':
          scope.inScope.push('Create, Read, Update, Delete operations')
          break
        case 'payment':
          scope.inScope.push('Payment processing and transaction handling')
          break
        case 'api':
          scope.inScope.push('API endpoints and backend services')
          break
        case 'fileUpload':
          scope.inScope.push('File upload and document management')
          break
        case 'search':
          scope.inScope.push('Search and filtering functionality')
          break
        case 'export':
          scope.inScope.push('Data export and reporting features')
          break
      }
    })
  }

  // Traditional scope detection
  if (lowerText.includes('api') || lowerText.includes('backend')) {
    if (!scope.inScope.some(s => s.includes('API'))) {
      scope.inScope.push('API endpoints and backend services')
    }
  }

  if (
    lowerText.includes('ui') ||
    lowerText.includes('frontend') ||
    lowerText.includes('interface')
  ) {
    scope.inScope.push('User interface and user experience')
  }

  if (lowerText.includes('database') || lowerText.includes('data')) {
    scope.inScope.push('Data persistence and database operations')
  }

  // Always include core functionality
  if (scope.inScope.length === 0) {
    scope.inScope.push('Core functionality as described in requirements')
  }

  // Out of scope items
  scope.outOfScope.push('Third-party integrations (unless explicitly specified)')

  if (
    !lowerText.includes('performance') &&
    !lowerText.includes('load') &&
    (!analysis || !analysis.edgeCases.includes('performance'))
  ) {
    scope.outOfScope.push('Performance and load testing (unless specified)')
  }

  if (
    !lowerText.includes('security') &&
    (!analysis || !analysis.detectedFunctionalities.some(f => f.type === 'authentication'))
  ) {
    scope.outOfScope.push('Security penetration testing (unless specified)')
  }

  return scope
}

function generateTestStrategy(projectInfo, analysis = null, planType = 'comprehensive') {
  const strategies = []
  const lowerText = projectInfo.toLowerCase()

  // Always include functional and regression testing
  strategies.push({
    type: 'Functional Testing',
    description: 'Verify that all features work according to specifications and acceptance criteria'
  })

  strategies.push({
    type: 'Regression Testing',
    description: 'Ensure existing functionality is not broken by new changes'
  })

  // Add strategies based on detected functionalities
  if (analysis) {
    if (analysis.detectedFunctionalities.some(f => f.type === 'api')) {
      strategies.push({
        type: 'API Testing',
        description:
          'Test API endpoints, request/response validation, error handling, and integration points'
      })
    }

    if (analysis.detectedFunctionalities.some(f => f.type === 'authentication')) {
      strategies.push({
        type: 'Security Testing',
        description: 'Validate authentication, authorization, and security mechanisms'
      })
    }

    if (analysis.detectedFunctionalities.some(f => f.type === 'validation')) {
      strategies.push({
        type: 'Validation Testing',
        description: 'Test input validation, boundary conditions, and error handling'
      })
    }

    if (analysis.edgeCases.includes('performance')) {
      strategies.push({
        type: 'Performance Testing',
        description: 'Validate system performance under load and stress conditions'
      })
    }
  }

  // Traditional strategy detection
  if (lowerText.includes('integration') || lowerText.includes('integración')) {
    if (!strategies.some(s => s.type === 'Integration Testing')) {
      strategies.push({
        type: 'Integration Testing',
        description: 'Test interactions between different system components and external services'
      })
    }
  }

  if (
    lowerText.includes('ui') ||
    lowerText.includes('interface') ||
    lowerText.includes('frontend')
  ) {
    strategies.push({
      type: 'UI Testing',
      description: 'Validate user interface elements, interactions, and user experience'
    })
  }

  if (lowerText.includes('database') || lowerText.includes('data')) {
    strategies.push({
      type: 'Data Testing',
      description: 'Verify data integrity, persistence, and business rule validation'
    })
  }

  return strategies
}

function generateTestItems(projectInfo, acceptanceCriteria = null, planType = 'comprehensive') {
  const items = []

  // Use acceptance criteria if available
  if (acceptanceCriteria && acceptanceCriteria.length > 0) {
    acceptanceCriteria.forEach((ac, index) => {
      items.push({
        id: `TC-${index + 1}`,
        name: ac.text.substring(0, 100),
        description: ac.text,
        type: ac.type
      })
    })
  } else {
    // Fallback to line-based extraction
    const lines = projectInfo.split('\n').filter(line => line.trim().length > 0)
    lines.forEach((line, index) => {
      if (line.trim().length > 0) {
        items.push({
          id: `TC-${index + 1}`,
          name: line.trim().substring(0, 100),
          description: line.trim()
        })
      }
    })
  }

  if (items.length === 0) {
    items.push({
      id: 'TC-1',
      name: 'Main functionality test',
      description: 'Test the main functionality described in the project information'
    })
  }

  return items
}

function generateResources(analysis = null) {
  const resources = [
    {
      role: 'Test Lead',
      responsibility: 'Overall test planning and coordination'
    },
    {
      role: 'QA Engineer',
      responsibility: 'Test case execution and defect reporting'
    }
  ]

  // Add specialized resources based on analysis
  if (analysis) {
    if (analysis.detectedFunctionalities.some(f => f.type === 'api')) {
      resources.push({
        role: 'API Tester',
        responsibility: 'API endpoint testing and integration validation'
      })
    }

    if (analysis.detectedFunctionalities.some(f => f.type === 'authentication')) {
      resources.push({
        role: 'Security Tester',
        responsibility: 'Security and authentication testing'
      })
    }

    if (analysis.edgeCases.includes('performance')) {
      resources.push({
        role: 'Performance Tester',
        responsibility: 'Performance and load testing execution'
      })
    }
  }

  resources.push({
    role: 'Developer',
    responsibility: 'Fix defects and provide technical support'
  })

  return resources
}

function generateSchedule(analysis = null) {
  const basePhases = [
    {
      phase: 'Test Planning',
      duration: '1 week',
      activities: ['Define test strategy', 'Create test plan', 'Prepare test environment']
    },
    {
      phase: 'Test Design',
      duration: '2 weeks',
      activities: ['Create test cases', 'Review test cases', 'Prepare test data']
    },
    {
      phase: 'Test Execution',
      duration: '3 weeks',
      activities: ['Execute test cases', 'Report defects', 'Retest fixes']
    },
    {
      phase: 'Test Closure',
      duration: '1 week',
      activities: ['Final test report', 'Lessons learned', 'Archive test artifacts']
    }
  ]

  // Adjust schedule based on complexity
  if (analysis) {
    if (analysis.complexity === 'High') {
      basePhases[1].duration = '3 weeks' // More time for test design
      basePhases[2].duration = '4 weeks' // More time for execution

      // Add additional activities for complex projects
      basePhases[1].activities.push('Create detailed test scenarios', 'Prepare automation scripts')
      basePhases[2].activities.push('Execute regression tests', 'Performance testing')
    } else if (analysis.complexity === 'Low') {
      basePhases[1].duration = '1 week'
      basePhases[2].duration = '2 weeks'
    }

    // Add specialized testing phases
    if (analysis.edgeCases.includes('performance')) {
      basePhases.splice(2, 0, {
        phase: 'Performance Testing',
        duration: '1 week',
        activities: ['Load testing', 'Stress testing', 'Performance analysis']
      })
    }
  }

  return { phases: basePhases }
}

function generateRisks(projectInfo, analysis = null) {
  const risks = [
    {
      risk: 'Incomplete or unclear requirements',
      impact: 'High',
      mitigation: 'Clarify requirements with stakeholders before test execution'
    },
    {
      risk: 'Delayed delivery of test environment',
      impact: 'Medium',
      mitigation: 'Request early access to test environment and prepare backup plan'
    },
    {
      risk: 'Resource unavailability',
      impact: 'Medium',
      mitigation: 'Maintain backup resources and cross-train team members'
    }
  ]

  const lowerText = projectInfo.toLowerCase()

  // Complexity-based risks
  if (analysis && analysis.complexity === 'High') {
    risks.push({
      risk: 'High complexity may require additional testing time and resources',
      impact: 'High',
      mitigation:
        'Allocate buffer time, prioritize critical test cases, and consider test automation'
    })
  }

  if (lowerText.includes('complex') || lowerText.includes('complejo')) {
    if (!risks.some(r => r.risk.includes('complexity'))) {
      risks.push({
        risk: 'High complexity may require additional testing time',
        impact: 'High',
        mitigation: 'Allocate buffer time and prioritize critical test cases'
      })
    }
  }

  // Functionality-specific risks
  if (analysis) {
    if (analysis.detectedFunctionalities.some(f => f.type === 'payment')) {
      risks.push({
        risk: 'Payment gateway integration failures',
        impact: 'High',
        mitigation: 'Establish sandbox environment for testing, have fallback payment methods ready'
      })
    }

    if (analysis.detectedFunctionalities.some(f => f.type === 'api')) {
      risks.push({
        risk: 'API dependency and integration issues',
        impact: 'High',
        mitigation:
          'Mock external APIs for testing, establish service level agreements with API providers'
      })
    }

    if (analysis.detectedFunctionalities.some(f => f.type === 'authentication')) {
      risks.push({
        risk: 'Security vulnerabilities in authentication flow',
        impact: 'High',
        mitigation:
          'Conduct security review, implement proper encryption, and follow security best practices'
      })
    }

    if (analysis.edgeCases.includes('performance')) {
      risks.push({
        risk: 'Performance issues under load',
        impact: 'Medium',
        mitigation:
          'Conduct early performance testing, optimize critical paths, plan for scalability'
      })
    }
  }

  return risks
}
