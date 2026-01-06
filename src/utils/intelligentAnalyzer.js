/**
 * Intelligent Analyzer for AC and Project Information
 * Analyzes patterns and generates intelligent recommendations
 */

const FUNCTIONALITY_PATTERNS = {
  authentication: {
    keywords: ['login', 'sign in', 'authentication', 'auth', 'credentials', 'password', 'usuario', 'iniciar sesión', 'contraseña'],
    testTypes: ['Functional', 'Security'],
    priorities: { default: 'High' },
    scenarios: [
      'Valid credentials login',
      'Invalid credentials login',
      'Password reset flow',
      'Session timeout',
      'Concurrent sessions',
      'Account lockout after failed attempts'
    ]
  },
  crud: {
    keywords: ['create', 'read', 'update', 'delete', 'add', 'edit', 'remove', 'list', 'view', 'crear', 'editar', 'eliminar', 'listar'],
    testTypes: ['Functional', 'Data'],
    priorities: { default: 'High' },
    scenarios: [
      'Create new record',
      'Read/View existing record',
      'Update existing record',
      'Delete record',
      'List all records',
      'Search and filter records',
      'Bulk operations'
    ]
  },
  validation: {
    keywords: ['validate', 'verify', 'check', 'required', 'format', 'pattern', 'rule', 'validar', 'verificar', 'requerido'],
    testTypes: ['Functional', 'Validation'],
    priorities: { default: 'Medium' },
    scenarios: [
      'Valid input validation',
      'Invalid input validation',
      'Required field validation',
      'Format validation (email, phone, etc.)',
      'Boundary value testing',
      'Special characters handling'
    ]
  },
  payment: {
    keywords: ['payment', 'pay', 'transaction', 'billing', 'invoice', 'checkout', 'pago', 'transacción', 'factura'],
    testTypes: ['Functional', 'Integration'],
    priorities: { default: 'High' },
    scenarios: [
      'Successful payment processing',
      'Payment gateway integration',
      'Payment failure handling',
      'Refund processing',
      'Invoice generation',
      'Payment history'
    ]
  },
  search: {
    keywords: ['search', 'find', 'filter', 'query', 'lookup', 'buscar', 'filtrar', 'consulta'],
    testTypes: ['Functional', 'Performance'],
    priorities: { default: 'Medium' },
    scenarios: [
      'Basic search functionality',
      'Advanced search with filters',
      'Search result pagination',
      'Empty search results',
      'Search performance with large datasets',
      'Search autocomplete/suggestions'
    ]
  },
  export: {
    keywords: ['export', 'download', 'csv', 'excel', 'pdf', 'report', 'exportar', 'descargar', 'reporte'],
    testTypes: ['Functional', 'Integration'],
    priorities: { default: 'Medium' },
    scenarios: [
      'Export to CSV format',
      'Export to Excel format',
      'Export to PDF format',
      'Export with filters applied',
      'Large data export handling',
      'Export file validation'
    ]
  },
  notification: {
    keywords: ['notification', 'alert', 'email', 'sms', 'message', 'notify', 'notificación', 'alerta', 'mensaje'],
    testTypes: ['Functional', 'Integration'],
    priorities: { default: 'Medium' },
    scenarios: [
      'Email notification sending',
      'SMS notification sending',
      'In-app notification display',
      'Notification preferences',
      'Notification delivery verification'
    ]
  },
  fileUpload: {
    keywords: ['upload', 'file', 'document', 'image', 'attachment', 'subir', 'archivo', 'documento', 'imagen'],
    testTypes: ['Functional', 'Security'],
    priorities: { default: 'High' },
    scenarios: [
      'Valid file upload',
      'Invalid file type upload',
      'Large file upload handling',
      'File size limit validation',
      'Multiple file upload',
      'File upload progress tracking'
    ]
  },
  api: {
    keywords: ['api', 'endpoint', 'rest', 'graphql', 'service', 'integration', 'servicio'],
    testTypes: ['API', 'Integration'],
    priorities: { default: 'High' },
    scenarios: [
      'API endpoint availability',
      'Request/Response validation',
      'Error handling',
      'Authentication/Authorization',
      'Rate limiting',
      'API versioning'
    ]
  },
  workflow: {
    keywords: ['workflow', 'process', 'approval', 'status', 'state', 'flujo', 'proceso', 'aprobación', 'estado'],
    testTypes: ['Functional', 'Business Logic'],
    priorities: { default: 'High' },
    scenarios: [
      'Workflow initiation',
      'Status transitions',
      'Approval process',
      'Workflow completion',
      'Error recovery in workflow',
      'Parallel workflow execution'
    ]
  }
}

const EDGE_CASE_PATTERNS = {
  boundary: ['limit', 'maximum', 'minimum', 'range', 'boundary', 'edge', 'límite', 'máximo', 'mínimo'],
  error: ['error', 'exception', 'failure', 'invalid', 'error', 'excepción', 'fallo', 'inválido'],
  security: ['security', 'permission', 'access', 'authorization', 'role', 'seguridad', 'permiso', 'acceso', 'rol'],
  performance: ['performance', 'load', 'stress', 'concurrent', 'rendimiento', 'carga', 'concurrente'],
  compatibility: ['browser', 'device', 'mobile', 'desktop', 'navegador', 'dispositivo', 'móvil']
}

export function analyzeProjectInfo(projectInfo) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return null
  }

  const analysis = {
    detectedFunctionalities: [],
    recommendations: [],
    testTypes: new Set(),
    priorityDistribution: { High: 0, Medium: 0, Low: 0 },
    edgeCases: [],
    complexity: 'Medium',
    estimatedTestCases: 0
  }

  const lowerText = projectInfo.toLowerCase()
  const sentences = projectInfo.split(/[.!?\n]/).filter(s => s.trim().length > 0)

  // Detect functionalities
  for (const [funcType, pattern] of Object.entries(FUNCTIONALITY_PATTERNS)) {
    const matches = pattern.keywords.filter(keyword => lowerText.includes(keyword))
    if (matches.length > 0) {
      analysis.detectedFunctionalities.push({
        type: funcType,
        confidence: matches.length / pattern.keywords.length,
        keywords: matches,
        testType: pattern.testTypes[0],
        scenarios: pattern.scenarios
      })
      pattern.testTypes.forEach(tt => analysis.testTypes.add(tt))
    }
  }

  // Detect edge cases
  for (const [edgeType, keywords] of Object.entries(EDGE_CASE_PATTERNS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      analysis.edgeCases.push(edgeType)
    }
  }

  // Analyze complexity
  const wordCount = projectInfo.split(/\s+/).length
  const acCount = (projectInfo.match(/ac[:\s]/gi) || []).length
  const functionalityCount = analysis.detectedFunctionalities.length

  if (wordCount > 500 || acCount > 10 || functionalityCount > 5) {
    analysis.complexity = 'High'
  } else if (wordCount < 100 || acCount < 3 || functionalityCount < 2) {
    analysis.complexity = 'Low'
  }

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis, projectInfo)

  // Estimate test cases
  analysis.estimatedTestCases = estimateTestCases(analysis, sentences.length)

  return analysis
}

function generateRecommendations(analysis, projectInfo) {
  const recommendations = []
  const lowerText = projectInfo.toLowerCase()

  // Functionality-based recommendations
  if (analysis.detectedFunctionalities.length === 0) {
    recommendations.push({
      type: 'warning',
      message: 'No specific functionalities detected. Consider adding more detailed requirements.',
      priority: 'High'
    })
  }

  // Security recommendations
  if (lowerText.includes('user') || lowerText.includes('data') || lowerText.includes('usuario') || lowerText.includes('datos')) {
    if (!analysis.detectedFunctionalities.some(f => f.type === 'authentication')) {
      recommendations.push({
        type: 'suggestion',
        message: 'Consider adding authentication and authorization test cases for user data protection.',
        priority: 'High'
      })
    }
  }

  // Edge case recommendations
  if (analysis.edgeCases.includes('boundary')) {
    recommendations.push({
      type: 'suggestion',
      message: 'Include boundary value testing for limits and ranges mentioned in requirements.',
      priority: 'Medium'
    })
  }

  if (analysis.edgeCases.includes('error')) {
    recommendations.push({
      type: 'suggestion',
      message: 'Add negative test cases for error handling scenarios.',
      priority: 'High'
    })
  }

  // Performance recommendations
  if (analysis.edgeCases.includes('performance') || lowerText.includes('load') || lowerText.includes('carga')) {
    recommendations.push({
      type: 'suggestion',
      message: 'Consider performance and load testing for the identified functionalities.',
      priority: 'Medium'
    })
  }

  // API recommendations
  if (analysis.detectedFunctionalities.some(f => f.type === 'api')) {
    recommendations.push({
      type: 'suggestion',
      message: 'Include API testing with focus on request/response validation and error codes.',
      priority: 'High'
    })
  }

  // CRUD recommendations
  if (analysis.detectedFunctionalities.some(f => f.type === 'crud')) {
    recommendations.push({
      type: 'suggestion',
      message: 'Ensure comprehensive CRUD testing including create, read, update, and delete operations.',
      priority: 'High'
    })
  }

  // Validation recommendations
  if (analysis.detectedFunctionalities.some(f => f.type === 'validation')) {
    recommendations.push({
      type: 'suggestion',
      message: 'Include positive and negative validation test cases with various input formats.',
      priority: 'High'
    })
  }

  return recommendations
}

function estimateTestCases(analysis, sentenceCount) {
  let baseCount = Math.max(sentenceCount, analysis.detectedFunctionalities.length * 3)
  
  // Add test cases based on functionalities
  analysis.detectedFunctionalities.forEach(func => {
    baseCount += func.scenarios.length
  })

  // Add edge cases
  baseCount += analysis.edgeCases.length * 2

  // Adjust for complexity
  if (analysis.complexity === 'High') {
    baseCount = Math.floor(baseCount * 1.5)
  } else if (analysis.complexity === 'Low') {
    baseCount = Math.floor(baseCount * 0.7)
  }

  return Math.max(3, baseCount)
}

export function extractAcceptanceCriteria(text) {
  const criteria = []
  const lines = text.split(/\n/)
  
  const acPatterns = [
    /^AC[:\s]+\d*[:\s]*(.+)$/i,
    /^Acceptance\s+Criteria[:\s]+\d*[:\s]*(.+)$/i,
    /^Given\s+(.+)$/i,
    /^When\s+(.+)$/i,
    /^Then\s+(.+)$/i,
    /^As\s+a\s+(.+)$/i,
    /^I\s+want\s+(.+)$/i,
    /^User\s+story[:\s]+\d*[:\s]*(.+)$/i
  ]

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return

    for (const pattern of acPatterns) {
      const match = trimmed.match(pattern)
      if (match) {
        criteria.push({
          id: criteria.length + 1,
          text: match[1].trim(),
          line: index + 1,
          type: detectACType(trimmed)
        })
        break
      }
    }

    // Also check for numbered ACs
    if (/^\d+[\.\)]\s*(.+)$/.test(trimmed)) {
      const match = trimmed.match(/^\d+[\.\)]\s*(.+)$/)
      if (match && match[1].length > 10) {
        criteria.push({
          id: criteria.length + 1,
          text: match[1].trim(),
          line: index + 1,
          type: 'requirement'
        })
      }
    }
  })

  return criteria
}

function detectACType(text) {
  const lower = text.toLowerCase()
  if (lower.startsWith('given') || lower.startsWith('dado')) return 'precondition'
  if (lower.startsWith('when') || lower.startsWith('cuando')) return 'action'
  if (lower.startsWith('then') || lower.startsWith('entonces')) return 'expected'
  if (lower.startsWith('as a') || lower.startsWith('como')) return 'user_story'
  return 'requirement'
}

export function generateIntelligentTestCases(projectInfo, format = 'stepByStep', analysis = null) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return []
  }

  if (!analysis) {
    analysis = analyzeProjectInfo(projectInfo)
  }

  const testCases = []
  const acceptanceCriteria = extractAcceptanceCriteria(projectInfo)
  const sentences = projectInfo.split(/[.!?\n]/).filter(s => s.trim().length > 10)

  // Generate test cases from AC
  acceptanceCriteria.forEach((ac, index) => {
    const functionality = findMatchingFunctionality(ac.text, analysis.detectedFunctionalities)
    const testCase = createTestCaseFromAC(ac, functionality, format, index + 1)
    if (testCase) {
      testCases.push(testCase)
    }
  })

  // Generate test cases from detected functionalities
  analysis.detectedFunctionalities.forEach((func, index) => {
    func.scenarios.forEach((scenario, sIndex) => {
      const testCase = createTestCaseFromScenario(scenario, func, format, testCases.length + 1)
      if (testCase && !testCases.some(tc => tc.title.toLowerCase() === testCase.title.toLowerCase())) {
        testCases.push(testCase)
      }
    })
  })

  // Generate test cases from sentences if no AC found
  if (testCases.length === 0 && sentences.length > 0) {
    sentences.slice(0, Math.min(10, sentences.length)).forEach((sentence, index) => {
      const functionality = findMatchingFunctionality(sentence, analysis.detectedFunctionalities)
      const testCase = createTestCaseFromSentence(sentence, functionality, format, index + 1)
      if (testCase) {
        testCases.push(testCase)
      }
    })
  }

  // Add edge case test cases
  analysis.edgeCases.forEach((edgeCase, index) => {
    const testCase = createEdgeCaseTest(edgeCase, format, testCases.length + 1)
    if (testCase) {
      testCases.push(testCase)
    }
  })

  // Ensure minimum test cases
  if (testCases.length === 0) {
    testCases.push(createDefaultTestCase(projectInfo, format))
  }

  // Limit to reasonable number
  return testCases.slice(0, Math.min(50, analysis.estimatedTestCases || 20))
}

function findMatchingFunctionality(text, functionalities) {
  const lowerText = text.toLowerCase()
  let bestMatch = null
  let bestScore = 0

  functionalities.forEach(func => {
    const score = func.keywords.filter(kw => lowerText.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = func
    }
  })

  return bestMatch
}

function createTestCaseFromAC(ac, functionality, format, id) {
  const priority = functionality?.priorities?.default || determinePriority(ac.text)
  const testType = functionality?.testType || 'Functional'

  return {
    id,
    title: generateTitleFromAC(ac.text),
    priority,
    type: testType,
    preconditions: generatePreconditions(ac.text, functionality),
    steps: format === 'gherkin' 
      ? generateGherkinFromAC(ac.text, ac.type)
      : generateStepsFromAC(ac.text, ac.type),
    expectedResult: generateExpectedResult(ac.text, ac.type),
    source: 'acceptance_criteria'
  }
}

function createTestCaseFromScenario(scenario, functionality, format, id) {
  return {
    id,
    title: scenario,
    priority: functionality.priorities?.default || 'Medium',
    type: functionality.testTypes[0],
    preconditions: generatePreconditions(scenario, functionality),
    steps: format === 'gherkin'
      ? generateGherkinFromText(scenario)
      : generateStepsFromText(scenario),
    expectedResult: generateExpectedResult(scenario, 'scenario'),
    source: 'functionality_pattern'
  }
}

function createTestCaseFromSentence(sentence, functionality, format, id) {
  return {
    id,
    title: extractTitle(sentence),
    priority: functionality?.priorities?.default || determinePriority(sentence),
    type: functionality?.testType || 'Functional',
    preconditions: generatePreconditions(sentence, functionality),
    steps: format === 'gherkin'
      ? generateGherkinFromText(sentence)
      : generateStepsFromText(sentence),
    expectedResult: generateExpectedResult(sentence, 'sentence'),
    source: 'sentence_analysis'
  }
}

function createEdgeCaseTest(edgeCase, format, id) {
  const edgeCaseTemplates = {
    boundary: {
      title: 'Boundary Value Testing',
      steps: format === 'gherkin'
        ? 'Given A System With Defined Limits\nWhen Testing Boundary Values\nThen System Should Handle Limits Correctly'
        : '1. Identify boundary values\n2. Test minimum value\n3. Test maximum value\n4. Test values just outside boundaries',
      expected: 'System correctly handles boundary conditions'
    },
    error: {
      title: 'Error Handling Validation',
      steps: format === 'gherkin'
        ? 'Given An Invalid Input Condition\nWhen System Processes The Input\nThen Appropriate Error Message Should Be Displayed'
        : '1. Provide invalid input\n2. Submit the input\n3. Verify error message is displayed\n4. Verify system state is maintained',
      expected: 'System displays appropriate error message and maintains stability'
    },
    security: {
      title: 'Security and Access Control',
      steps: format === 'gherkin'
        ? 'Given A User With Limited Permissions\nWhen Attempting Restricted Action\nThen Access Should Be Denied'
        : '1. Login with limited permissions\n2. Attempt restricted action\n3. Verify access is denied\n4. Verify appropriate error message',
      expected: 'Access is properly restricted based on user permissions'
    }
  }

  const template = edgeCaseTemplates[edgeCase] || {
    title: `${edgeCase} Testing`,
    steps: '1. Setup test condition\n2. Execute action\n3. Verify result',
    expected: 'Expected behavior is verified'
  }

  return {
    id,
    title: template.title,
    priority: 'High',
    type: 'Edge Case',
    preconditions: 'System is ready and configured',
    steps: template.steps,
    expectedResult: template.expected,
    source: 'edge_case'
  }
}

function generateTitleFromAC(text) {
  // Remove AC prefix
  let title = text.replace(/^AC[:\s]+\d*[:\s]*/i, '')
  title = title.replace(/^Acceptance\s+Criteria[:\s]+\d*[:\s]*/i, '')
  
  // Clean up common prefixes
  title = title.replace(/^(Given|When|Then|As a|I want|User story)[:\s]+/i, '')
  
  // Capitalize and limit length
  title = title.trim()
  if (title.length > 80) {
    title = title.substring(0, 77) + '...'
  }
  
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function generatePreconditions(text, functionality) {
  const preconditions = []
  const lowerText = text.toLowerCase()

  // User-related preconditions
  if (lowerText.includes('user') || lowerText.includes('usuario')) {
    if (lowerText.includes('login') || lowerText.includes('authenticated')) {
      preconditions.push('User is logged in with valid credentials')
    } else {
      preconditions.push('User account exists in the system')
    }
  }

  // Data-related preconditions
  if (lowerText.includes('data') || lowerText.includes('datos') || lowerText.includes('record')) {
    preconditions.push('Test data is available in the system')
  }

  // Functionality-specific preconditions
  if (functionality) {
    switch (functionality.type) {
      case 'payment':
        preconditions.push('Payment gateway is configured and accessible')
        break
      case 'fileUpload':
        preconditions.push('File upload feature is enabled')
        break
      case 'api':
        preconditions.push('API endpoint is available and accessible')
        break
    }
  }

  return preconditions.length > 0 ? preconditions.join('; ') : 'System is ready and accessible'
}

function generateGherkinFromAC(text, acType) {
  const lowerText = text.toLowerCase()
  
  if (acType === 'precondition' || lowerText.startsWith('given')) {
    return `Given ${capitalizeTitleCase(text.replace(/^(Given|Dado)[:\s]+/i, '').trim())}\nWhen The User Performs The Required Action\nThen The Expected Result Should Be Achieved`
  }
  
  if (acType === 'action' || lowerText.startsWith('when')) {
    const action = text.replace(/^(When|Cuando)[:\s]+/i, '').trim()
    return `Given The System Is In A Valid State\nWhen ${capitalizeTitleCase(action)}\nThen The Expected Result Should Be Achieved`
  }
  
  if (acType === 'expected' || lowerText.startsWith('then')) {
    const expected = text.replace(/^(Then|Entonces)[:\s]+/i, '').trim()
    return `Given The System Is In A Valid State\nWhen The User Performs The Required Action\nThen ${capitalizeTitleCase(expected)}`
  }

  return generateGherkinFromText(text)
}

function generateGherkinFromText(text) {
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0)
  const steps = []

  if (sentences.length >= 3) {
    steps.push(`Given ${capitalizeTitleCase(sentences[0].trim())}`)
    steps.push(`When ${capitalizeTitleCase(sentences[1].trim())}`)
    steps.push(`Then ${capitalizeTitleCase(sentences[2].trim())}`)
  } else if (sentences.length === 2) {
    steps.push(`Given The System Is In A Valid State`)
    steps.push(`When ${capitalizeTitleCase(sentences[0].trim())}`)
    steps.push(`Then ${capitalizeTitleCase(sentences[1].trim())}`)
  } else {
    steps.push(`Given The System Is In A Valid State`)
    steps.push(`When ${capitalizeTitleCase(text.trim())}`)
    steps.push(`Then The Expected Result Should Be Achieved`)
  }

  return steps.join('\n')
}

function generateStepsFromAC(text, acType) {
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5)
  
  if (sentences.length === 0) {
    return generateStepsFromText(text)
  }

  return sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n')
}

function generateStepsFromText(text) {
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5)
  
  if (sentences.length > 0) {
    return sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n')
  }

  // Fallback steps
  return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
}

function generateExpectedResult(text, source) {
  const lowerText = text.toLowerCase()

  // Extract from "should" or "debe" statements
  const shouldMatch = text.match(/(?:should|debe|must|debe)\s+(.+?)(?:\.|$)/i)
  if (shouldMatch) {
    return shouldMatch[1].trim()
  }

  // Extract from "then" statements
  if (source === 'expected' || lowerText.startsWith('then')) {
    const thenMatch = text.match(/(?:Then|Entonces)[:\s]+(.+?)(?:\.|$)/i)
    if (thenMatch) {
      return thenMatch[1].trim()
    }
  }

  // Functionality-specific expected results
  if (lowerText.includes('login') || lowerText.includes('authenticate')) {
    return 'User is successfully authenticated and redirected to dashboard'
  }

  if (lowerText.includes('create') || lowerText.includes('add')) {
    return 'New record is successfully created and displayed in the system'
  }

  if (lowerText.includes('update') || lowerText.includes('edit')) {
    return 'Record is successfully updated with new information'
  }

  if (lowerText.includes('delete') || lowerText.includes('remove')) {
    return 'Record is successfully deleted from the system'
  }

  if (lowerText.includes('validate') || lowerText.includes('verify')) {
    return 'Validation is performed correctly and appropriate feedback is provided'
  }

  return 'Operation completes successfully and expected behavior is verified'
}

function determinePriority(text) {
  const lowerText = text.toLowerCase()
  const highPriorityKeywords = ['critical', 'urgent', 'must', 'blocker', 'security', 'payment', 'crítico', 'urgente', 'debe', 'seguridad', 'pago']
  const lowPriorityKeywords = ['nice to have', 'optional', 'enhancement', 'opcional', 'mejora']

  if (highPriorityKeywords.some(kw => lowerText.includes(kw))) {
    return 'High'
  }

  if (lowPriorityKeywords.some(kw => lowerText.includes(kw))) {
    return 'Low'
  }

  return 'Medium'
}

function extractTitle(text) {
  // Remove common prefixes
  let title = text.replace(/^(AC|Acceptance Criteria|Given|When|Then|As a|I want)[:\s]+\d*[:\s]*/i, '')
  title = title.trim()

  // Take first sentence or first 80 characters
  const firstSentence = title.split(/[.!?]/)[0]
  if (firstSentence.length > 10 && firstSentence.length < 80) {
    title = firstSentence
  } else {
    title = title.substring(0, 80)
  }

  return title.charAt(0).toUpperCase() + title.slice(1) + (title.length >= 80 ? '...' : '')
}

function createDefaultTestCase(projectInfo, format) {
  return {
    id: 1,
    title: 'Test Case: ' + projectInfo.substring(0, 50),
    priority: 'Medium',
    type: 'Functional',
    preconditions: 'System is ready',
    steps: format === 'gherkin'
      ? 'Given The System Is In A Valid State\nWhen The User Performs The Required Action\nThen The Expected Result Should Be Achieved'
      : '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result',
    expectedResult: 'Operation completes successfully',
    source: 'default'
  }
}

function capitalizeTitleCase(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

