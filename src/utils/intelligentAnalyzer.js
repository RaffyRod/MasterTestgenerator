/**
 * Intelligent Analyzer for AC and Project Information
 * Analyzes patterns and generates intelligent recommendations
 */

import testCasePatterns from '../data/patterns/test-case-patterns.json'

const FUNCTIONALITY_PATTERNS = {
  authentication: {
    keywords: [
      'login',
      'sign in',
      'authentication',
      'auth',
      'credentials',
      'password',
      'usuario',
      'iniciar sesión',
      'contraseña'
    ],
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
    keywords: [
      'create',
      'read',
      'update',
      'delete',
      'add',
      'edit',
      'remove',
      'list',
      'view',
      'crear',
      'editar',
      'eliminar',
      'listar'
    ],
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
    keywords: [
      'validate',
      'verify',
      'check',
      'required',
      'format',
      'pattern',
      'rule',
      'validar',
      'verificar',
      'requerido'
    ],
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
    keywords: [
      'payment',
      'pay',
      'transaction',
      'billing',
      'invoice',
      'checkout',
      'pago',
      'transacción',
      'factura'
    ],
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
    keywords: [
      'export',
      'download',
      'csv',
      'excel',
      'pdf',
      'report',
      'exportar',
      'descargar',
      'reporte'
    ],
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
    keywords: [
      'notification',
      'alert',
      'email',
      'sms',
      'message',
      'notify',
      'notificación',
      'alerta',
      'mensaje'
    ],
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
    keywords: [
      'upload',
      'file',
      'document',
      'image',
      'attachment',
      'subir',
      'archivo',
      'documento',
      'imagen'
    ],
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
    keywords: [
      'workflow',
      'process',
      'approval',
      'status',
      'state',
      'flujo',
      'proceso',
      'aprobación',
      'estado'
    ],
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
  boundary: [
    'limit',
    'maximum',
    'minimum',
    'range',
    'boundary',
    'edge',
    'límite',
    'máximo',
    'mínimo'
  ],
  error: ['error', 'exception', 'failure', 'invalid', 'error', 'excepción', 'fallo', 'inválido'],
  security: [
    'security',
    'permission',
    'access',
    'authorization',
    'role',
    'seguridad',
    'permiso',
    'acceso',
    'rol'
  ],
  performance: [
    'performance',
    'load',
    'stress',
    'concurrent',
    'rendimiento',
    'carga',
    'concurrente'
  ],
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
  if (
    lowerText.includes('user') ||
    lowerText.includes('data') ||
    lowerText.includes('usuario') ||
    lowerText.includes('datos')
  ) {
    if (!analysis.detectedFunctionalities.some(f => f.type === 'authentication')) {
      recommendations.push({
        type: 'suggestion',
        message:
          'Consider adding authentication and authorization test cases for user data protection.',
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
  if (
    analysis.edgeCases.includes('performance') ||
    lowerText.includes('load') ||
    lowerText.includes('carga')
  ) {
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
      message:
        'Ensure comprehensive CRUD testing including create, read, update, and delete operations.',
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
    /^As\s+a\s+(.+)$/i,
    /^I\s+want\s+(.+)$/i,
    /^User\s+story[:\s]+\d*[:\s]*(.+)$/i
  ]

  // Track Gherkin lines to group them together
  let gherkinGroup = []
  let gherkinStartIndex = -1

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) {
      // Empty line: if we have a Gherkin group, finalize it
      if (gherkinGroup.length > 0) {
        criteria.push({
          id: criteria.length + 1,
          text: gherkinGroup.join('\n'),
          line: gherkinStartIndex + 1,
          type: 'gherkin'
        })
        gherkinGroup = []
        gherkinStartIndex = -1
      }
      return
    }

    // Check for Gherkin keywords (Given, When, Then, And, But)
    const gherkinMatch = trimmed.match(
      /^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+(.+)$/i
    )
    if (gherkinMatch) {
      if (gherkinGroup.length === 0) {
        gherkinStartIndex = index
      }
      gherkinGroup.push(trimmed)
      return // Don't process as separate AC
    }

    // If we have a Gherkin group and hit a non-Gherkin line, finalize the group
    if (gherkinGroup.length > 0) {
      criteria.push({
        id: criteria.length + 1,
        text: gherkinGroup.join('\n'),
        line: gherkinStartIndex + 1,
        type: 'gherkin'
      })
      gherkinGroup = []
      gherkinStartIndex = -1
    }

    // Check for other AC patterns
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

  // Finalize any remaining Gherkin group
  if (gherkinGroup.length > 0) {
    criteria.push({
      id: criteria.length + 1,
      text: gherkinGroup.join('\n'),
      line: gherkinStartIndex + 1,
      type: 'gherkin'
    })
  }

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

export function generateIntelligentTestCases(
  projectInfo,
  format = 'stepByStep',
  analysis = null,
  testsPerAC = 1
) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return []
  }

  if (!analysis) {
    analysis = analyzeProjectInfo(projectInfo)
  }

  // Ensure analysis is valid
  if (!analysis) {
    // Fallback: create a default test case
    return [createDefaultTestCase(projectInfo, format)]
  }

  const testCases = []
  const acceptanceCriteria = extractAcceptanceCriteria(projectInfo)
  const sentences = projectInfo.split(/[.!?\n]/).filter(s => s.trim().length > 10)

  // Validate testsPerAC
  const validTestsPerAC = Math.max(1, Math.min(5, parseInt(testsPerAC) || 1))

  // Generate test cases from AC
  if (acceptanceCriteria.length > 0) {
    acceptanceCriteria.forEach((ac, acIndex) => {
      const functionality = findMatchingFunctionality(ac.text, analysis.detectedFunctionalities)

      // Generate multiple test cases per AC if requested
      for (let tcIndex = 0; tcIndex < validTestsPerAC; tcIndex++) {
        const testCase = createTestCaseFromAC(
          ac,
          functionality,
          format,
          testCases.length + 1,
          tcIndex,
          validTestsPerAC
        )
        if (testCase) {
          testCases.push(testCase)
        }
      }
    })
  } else {
    // Generate test cases from detected functionalities only if no ACs found
    if (analysis.detectedFunctionalities && analysis.detectedFunctionalities.length > 0) {
      // Limit to validTestsPerAC per functionality
      analysis.detectedFunctionalities
        .slice(0, Math.ceil(10 / validTestsPerAC))
        .forEach((func, index) => {
          if (func && func.scenarios && Array.isArray(func.scenarios)) {
            const scenariosToUse = func.scenarios.slice(0, validTestsPerAC)
            scenariosToUse.forEach((scenario, sIndex) => {
              const testCase = createTestCaseFromScenario(
                scenario,
                func,
                format,
                testCases.length + 1
              )
              if (
                testCase &&
                !testCases.some(tc => tc.title.toLowerCase() === testCase.title.toLowerCase())
              ) {
                testCases.push(testCase)
              }
            })
          }
        })
    }

    // Generate test cases from sentences if no AC found and no functionalities
    if (testCases.length === 0 && sentences.length > 0) {
      const sentencesToUse = sentences.slice(0, validTestsPerAC)
      sentencesToUse.forEach((sentence, index) => {
        const functionality = findMatchingFunctionality(sentence, analysis.detectedFunctionalities)
        const testCase = createTestCaseFromSentence(sentence, functionality, format, index + 1)
        if (testCase) {
          testCases.push(testCase)
        }
      })
    }
  }

  // Add edge case test cases only if we have room and user wants more than 1 per AC
  // This ensures we respect the testsPerAC limit when ACs are present
  if (validTestsPerAC > 1 && acceptanceCriteria.length > 0) {
    // Only add a few edge cases if we have space
    const maxEdgeCases = Math.min(
      3,
      Math.max(0, acceptanceCriteria.length * validTestsPerAC - testCases.length)
    )
    if (analysis.edgeCases && Array.isArray(analysis.edgeCases) && maxEdgeCases > 0) {
      analysis.edgeCases.slice(0, maxEdgeCases).forEach((edgeCase, index) => {
        const testCase = createEdgeCaseTest(edgeCase, format, testCases.length + 1)
        if (
          testCase &&
          !testCases.some(tc => tc.title.toLowerCase() === testCase.title.toLowerCase())
        ) {
          testCases.push(testCase)
        }
      })
    }
  } else if (acceptanceCriteria.length === 0) {
    // If no ACs, add edge cases normally
    if (analysis.edgeCases && Array.isArray(analysis.edgeCases)) {
      analysis.edgeCases.slice(0, validTestsPerAC).forEach((edgeCase, index) => {
        const testCase = createEdgeCaseTest(edgeCase, format, testCases.length + 1)
        if (testCase) {
          testCases.push(testCase)
        }
      })
    }
  }

  // Ensure minimum test cases
  if (testCases.length === 0) {
    testCases.push(createDefaultTestCase(projectInfo, format))
  }

  // Calculate expected total based on testsPerAC
  const expectedTotal =
    acceptanceCriteria.length > 0
      ? acceptanceCriteria.length * validTestsPerAC
      : Math.min(validTestsPerAC * 5, 20) // If no ACs, limit to reasonable number

  // Limit to expected total or reasonable maximum
  const maxLimit =
    acceptanceCriteria.length > 0 ? expectedTotal : Math.min(50, analysis.estimatedTestCases || 20)

  return testCases.slice(0, maxLimit)
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

function createTestCaseFromAC(
  ac,
  functionality,
  format,
  id,
  variationIndex = 0,
  totalVariations = 1
) {
  if (!ac || !ac.text) {
    return null
  }

  const priority = functionality?.priorities?.default || determinePriority(ac.text)
  const testType = functionality?.testType || 'Functional'

  // Generate variations if multiple test cases per AC
  let acText = ac.text
  let title = generateTitleFromAC(ac.text)

  if (totalVariations > 1 && variationIndex > 0) {
    // Create variation of the AC for additional test cases
    acText = createACVariation(ac.text, variationIndex, totalVariations)
    title = generateTitleFromAC(acText)

    // Add variation suffix to title
    const variationSuffixes = [
      '',
      ' - Positive Path',
      ' - Negative Path',
      ' - Edge Case',
      ' - Alternative Flow'
    ]
    if (variationIndex < variationSuffixes.length) {
      title = title + variationSuffixes[variationIndex]
    } else {
      title = title + ` - Variation ${variationIndex + 1}`
    }
  }

  const gherkinSteps =
    format === 'gherkin'
      ? generateGherkinFromAC(acText, ac.type, variationIndex, totalVariations, functionality)
      : null
  const stepByStep =
    format === 'gherkin'
      ? null
      : generateStepsFromAC(acText, ac.type, variationIndex, totalVariations, functionality)

  // Extract Given/When/Then from Gherkin or text
  const givenMatch = acText.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|$)/i)
  const whenMatch = acText.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|$)/i)
  const thenMatch = acText.match(/(?:Then|Entonces)\s+(.+?)(?:\.|$)/i)

  const steps = format === 'gherkin' ? gherkinSteps : stepByStep

  return {
    id,
    title,
    priority: adjustPriorityForVariation(priority, variationIndex, totalVariations),
    type: testType,
    preconditions: generatePreconditions(acText, functionality),
    steps,
    expectedResult: generateExpectedResult(
      acText,
      ac.type,
      functionality,
      thenMatch,
      title,
      steps,
      variationIndex
    ),
    scenario: extractScenario(acText),
    given: givenMatch ? givenMatch[1].trim() : null,
    when: whenMatch ? whenMatch[1].trim() : null,
    then: thenMatch ? thenMatch[1].trim() : null,
    folder: functionality?.folder || 'Test Cases',
    source: 'acceptance_criteria'
  }
}

/**
 * Create a variation of an AC for generating multiple test cases
 */
function createACVariation(acText, variationIndex, totalVariations) {
  const lowerText = acText.toLowerCase()

  // Variation strategies based on index
  switch (variationIndex) {
    case 1: // Positive path variation
      if (lowerText.includes('should') || lowerText.includes('debe')) {
        return acText.replace(/(should|debe)/i, match => {
          return match === 'should' ? 'should successfully' : 'debe exitosamente'
        })
      }
      return acText + ' (successful scenario)'

    case 2: // Negative path variation
      if (lowerText.includes('should') || lowerText.includes('debe')) {
        return acText.replace(/(should|debe)/i, match => {
          return match === 'should' ? 'should not' : 'no debe'
        })
      }
      return acText + ' (error scenario)'

    case 3: // Edge case variation
      return acText + ' (boundary conditions)'

    case 4: // Alternative flow
      return acText + ' (alternative approach)'

    default:
      // Add variation indicator
      return acText + ` (variation ${variationIndex + 1})`
  }
}

/**
 * Adjust priority based on variation type
 */
function adjustPriorityForVariation(basePriority, variationIndex, totalVariations) {
  if (totalVariations <= 1) {
    return basePriority
  }

  // First variation keeps original priority
  if (variationIndex === 0) {
    return basePriority
  }

  // Negative path variations are usually high priority
  if (variationIndex === 2) {
    return 'High'
  }

  // Edge cases are medium-high priority
  if (variationIndex === 3) {
    return basePriority === 'Low' ? 'Medium' : basePriority
  }

  // Other variations maintain base priority
  return basePriority
}

function createTestCaseFromScenario(scenario, functionality, format, id) {
  if (!scenario || typeof scenario !== 'string') {
    return null
  }

  const givenMatch = scenario.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|$)/i)
  const whenMatch = scenario.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|$)/i)
  const thenMatch = scenario.match(/(?:Then|Entonces)\s+(.+?)(?:\.|$)/i)

  const steps =
    format === 'gherkin' ? generateGherkinFromText(scenario) : generateStepsFromText(scenario)

  return {
    id,
    title: scenario,
    priority: functionality?.priorities?.default || 'Medium',
    type: functionality?.testTypes?.[0] || 'Functional',
    preconditions: generatePreconditions(scenario, functionality),
    steps,
    expectedResult: generateExpectedResult(
      scenario,
      'scenario',
      functionality,
      thenMatch,
      scenario,
      steps
    ),
    scenario: extractScenario(scenario),
    given: givenMatch ? givenMatch[1].trim() : null,
    when: whenMatch ? whenMatch[1].trim() : null,
    then: thenMatch ? thenMatch[1].trim() : null,
    folder: functionality?.folder || 'Test Cases',
    source: 'functionality_pattern'
  }
}

function createTestCaseFromSentence(sentence, functionality, format, id) {
  if (!sentence || typeof sentence !== 'string' || sentence.trim().length === 0) {
    return null
  }

  const givenMatch = sentence.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|$)/i)
  const whenMatch = sentence.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|$)/i)
  const thenMatch = sentence.match(/(?:Then|Entonces)\s+(.+?)(?:\.|$)/i)

  const title = extractTitle(sentence)
  const steps =
    format === 'gherkin' ? generateGherkinFromText(sentence) : generateStepsFromText(sentence)

  return {
    id,
    title,
    priority: functionality?.priorities?.default || determinePriority(sentence),
    type: functionality?.testType || 'Functional',
    preconditions: generatePreconditions(sentence, functionality),
    steps,
    expectedResult: generateExpectedResult(
      sentence,
      'sentence',
      functionality,
      thenMatch,
      title,
      steps
    ),
    scenario: extractScenario(sentence),
    given: givenMatch ? givenMatch[1].trim() : null,
    when: whenMatch ? whenMatch[1].trim() : null,
    then: thenMatch ? thenMatch[1].trim() : null,
    folder: functionality?.folder || 'Test Cases',
    source: 'sentence_analysis'
  }
}

function extractScenario(text) {
  // Try to extract scenario from text
  const scenarioMatch = text.match(/(?:Scenario|Escenario):\s*(.+?)(?:\n|$)/i)
  if (scenarioMatch) {
    return scenarioMatch[1].trim()
  }

  // Fallback: use first sentence or title
  const firstSentence = text.split(/[.!?\n]/)[0].trim()
  return firstSentence.length > 0 ? firstSentence : 'Test scenario'
}

function createEdgeCaseTest(edgeCase, format, id) {
  const edgeCaseTemplates = {
    boundary: {
      title: 'Boundary Value Testing',
      steps:
        format === 'gherkin'
          ? 'Given A System With Defined Limits\nWhen Testing Boundary Values\nThen System Should Handle Limits Correctly'
          : '1. Identify boundary values\n2. Test minimum value\n3. Test maximum value\n4. Test values just outside boundaries',
      expected: 'System correctly handles boundary conditions'
    },
    error: {
      title: 'Error Handling Validation',
      steps:
        format === 'gherkin'
          ? 'Given An Invalid Input Condition\nWhen System Processes The Input\nThen Appropriate Error Message Should Be Displayed'
          : '1. Provide invalid input\n2. Submit the input\n3. Verify error message is displayed\n4. Verify system state is maintained',
      expected: 'System displays appropriate error message and maintains stability'
    },
    security: {
      title: 'Security and Access Control',
      steps:
        format === 'gherkin'
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

  const givenMatch = template.steps.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|$)/i)
  const whenMatch = template.steps.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|$)/i)
  const thenMatch = template.steps.match(/(?:Then|Entonces)\s+(.+?)(?:\.|$)/i)

  return {
    id,
    title: template.title,
    priority: 'High',
    type: 'Edge Case',
    preconditions: 'System is ready and configured',
    steps: template.steps,
    expectedResult: template.expected,
    scenario: `Test ${edgeCase} edge cases`,
    given: givenMatch ? givenMatch[1].trim() : null,
    when: whenMatch ? whenMatch[1].trim() : null,
    then: thenMatch ? thenMatch[1].trim() : null,
    folder: 'Test Cases',
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

function generateGherkinFromAC(
  text,
  acType,
  variationIndex = 0,
  totalVariations = 1,
  functionality = null
) {
  if (!text || typeof text !== 'string') {
    return 'Given The System Is In A Valid State\nWhen The User Performs The Required Action\nThen The Expected Result Should Be Achieved'
  }

  // Try to get pattern-based Gherkin first
  const patternGherkin = getPatternBasedSteps(text, functionality, 'gherkin', variationIndex)
  if (patternGherkin) {
    return patternGherkin
  }

  const lowerText = text.toLowerCase()

  if (acType === 'precondition' || lowerText.startsWith('given')) {
    const cleaned = text.replace(/^(Given|Dado)[:\s]+/i, '').trim()
    const givenText = cleaned || 'The System Is In A Valid State'

    // Generate intelligent When and Then based on context
    const whenStep = extractIntelligentWhenStep(text)
    const thenStep = extractIntelligentThenStep(text)

    return `Given ${capitalizeTitleCase(givenText)}\nWhen ${whenStep}\nThen ${thenStep}`
  }

  if (acType === 'action' || lowerText.startsWith('when')) {
    const action = text.replace(/^(When|Cuando)[:\s]+/i, '').trim()
    const whenText = action || 'I Perform The Required Action'

    // Extract Given from context if available
    const givenStep = extractIntelligentGivenStep(text) || 'The System Is In A Valid State'
    const thenStep = extractIntelligentThenStep(text)

    return `Given ${capitalizeTitleCase(givenStep)}\nWhen ${capitalizeTitleCase(whenText)}\nThen ${thenStep}`
  }

  if (acType === 'expected' || lowerText.startsWith('then')) {
    const expected = text.replace(/^(Then|Entonces)[:\s]+/i, '').trim()
    const thenText = expected || generateContextBasedExpectedResult(text)

    // Extract Given and When from context
    const givenStep = extractIntelligentGivenStep(text) || 'The System Is In A Valid State'
    const whenStep = extractIntelligentWhenStep(text)

    return `Given ${capitalizeTitleCase(givenStep)}\nWhen ${whenStep}\nThen ${capitalizeTitleCase(thenText)}`
  }

  return generateGherkinFromText(text)
}

function extractIntelligentGivenStep(text) {
  const lowerText = text.toLowerCase()

  // Look for page/screen context
  const pageMatch = text.match(
    /(?:on|in|at)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+screen|\s+view)/i
  )
  if (pageMatch && pageMatch[1]) {
    return `I Am On The ${capitalizeTitleCase(pageMatch[1].trim())} Page`
  }

  // Look for user state
  if (lowerText.includes('logged in') || lowerText.includes('authenticated')) {
    return 'I Am Logged In With Valid Credentials'
  }

  // Look for data state
  if (lowerText.includes('data') || lowerText.includes('record') || lowerText.includes('item')) {
    return 'The System Has Test Data Available'
  }

  return null
}

function extractIntelligentWhenStep(text) {
  const lowerText = text.toLowerCase()

  // Extract action verbs with objects
  const actionPatterns = [
    {
      pattern:
        /(?:click|select)\s+(?:on\s+)?(?:the\s+)?([a-z\s]+?)(?:\s+button|\s+link|\s+menu|\s+option|$)/i,
      format: 'I Click On The {object}'
    },
    {
      pattern: /(?:enter|type|fill|input)\s+(?:the\s+)?([a-z\s]+?)(?:\s+field|\s+input|$)/i,
      format: 'I Enter {object} In The Field'
    },
    {
      pattern: /(?:search|find|filter)\s+(?:for\s+)?([a-z\s]+?)(?:$|\.)/i,
      format: 'I Search For {object}'
    },
    {
      pattern: /(?:submit|save)\s+(?:the\s+)?([a-z\s]+?)(?:\s+form|$)/i,
      format: 'I Submit The {object} Form'
    },
    {
      pattern: /(?:create|add|new)\s+(?:a\s+)?([a-z\s]+?)(?:$|\.)/i,
      format: 'I Create A New {object}'
    },
    {
      pattern: /(?:update|edit|modify)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.)/i,
      format: 'I Update The {object}'
    },
    {
      pattern: /(?:delete|remove)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.)/i,
      format: 'I Delete The {object}'
    },
    {
      pattern: /(?:view|display|show)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.)/i,
      format: 'I View The {object}'
    },
    {
      pattern: /(?:navigate|go|open)\s+(?:to\s+)?(?:the\s+)?([a-z\s]+?)(?:\s+page|$)/i,
      format: 'I Navigate To The {object} Page'
    }
  ]

  for (const { pattern, format } of actionPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const object = capitalizeTitleCase(match[1].trim())
      return format.replace('{object}', object)
    }
  }

  // Fallback: extract any action verb
  const actionVerbs = [
    'click',
    'select',
    'enter',
    'type',
    'fill',
    'submit',
    'search',
    'filter',
    'navigate',
    'open',
    'save',
    'delete',
    'edit',
    'create',
    'update',
    'view'
  ]
  for (const verb of actionVerbs) {
    if (lowerText.includes(verb)) {
      return `I ${capitalizeTitleCase(verb)} The Required Element`
    }
  }

  return 'I Perform The Required Action'
}

function extractIntelligentThenStep(text) {
  const lowerText = text.toLowerCase()

  // Extract expected results
  const expectedPatterns = [
    /(?:should|must|will|debe|será)\s+(?:see|view|display|show|receive|get|obtain)\s+(.+?)(?:\.|$)/i,
    /(?:expected|esperado|result|resultado)\s+(?:is|should be|será|es)\s+(.+?)(?:\.|$)/i,
    /(?:verify|confirm|check)\s+(?:that|que)\s+(.+?)(?:\.|$)/i,
    /(?:then|entonces)\s+(.+?)(?:\.|$)/i
  ]

  for (const pattern of expectedPatterns) {
    const match = text.match(pattern)
    if (match && match[1] && match[1].trim().length > 5) {
      const result = match[1].trim()
      // Remove common prefixes
      const cleaned = result.replace(/^(that|que|the|el|la|los|las)\s+/i, '').trim()
      return `I Should ${capitalizeTitleCase(cleaned)}`
    }
  }

  // Generate based on context
  return generateContextBasedExpectedResult(text)
}

function generateGherkinFromText(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return 'Given The System Is In A Valid State\nWhen The User Performs The Required Action\nThen The Expected Result Should Be Achieved'
  }

  const lowerText = text.toLowerCase()
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0)
  const steps = []

  // Try to extract Given/When/Then from the text
  const givenMatch = text.match(
    /(?:Given|Dado|I am|I'm|user is|usuario está|system is|sistema está)\s+(.+?)(?:\s+When|\s+Cuando|$)/i
  )
  const whenMatch = text.match(/(?:When|Cuando|I|user|usuario)\s+(.+?)(?:\s+Then|\s+Entonces|$)/i)
  const thenMatch = text.match(
    /(?:Then|Entonces|should|debe|will|será|result|resultado)\s+(.+?)(?:\.|$)/i
  )

  // Extract Given step
  if (givenMatch && givenMatch[1]) {
    steps.push(`Given ${capitalizeTitleCase(givenMatch[1].trim())}`)
  } else {
    // Try to find context/precondition in first sentence
    const firstSentence = sentences[0]?.trim() || ''
    if (firstSentence.match(/(?:on|in|at|from|with|using)/i)) {
      steps.push(`Given ${capitalizeTitleCase(firstSentence)}`)
    } else {
      // Extract page/context from text
      const pageMatch = text.match(
        /(?:on|in|at)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+screen|\s+section|$)/i
      )
      if (pageMatch && pageMatch[1]) {
        steps.push(`Given I Am On The ${capitalizeTitleCase(pageMatch[1].trim())} Page`)
      } else {
        steps.push(`Given The System Is In A Valid State`)
      }
    }
  }

  // Extract When step - be more intelligent about actions
  if (whenMatch && whenMatch[1] && whenMatch[1].trim().length > 5) {
    steps.push(`When ${capitalizeTitleCase(whenMatch[1].trim())}`)
  } else {
    // Extract action verbs from text
    const actionVerbs = [
      'click',
      'select',
      'enter',
      'type',
      'fill',
      'submit',
      'search',
      'filter',
      'navigate',
      'open',
      'close',
      'save',
      'delete',
      'edit',
      'create',
      'update',
      'view',
      'display'
    ]
    let foundAction = null

    for (const verb of actionVerbs) {
      const verbPattern = new RegExp(
        `(?:${verb}|${verb}ed|${verb}ing)\\s+(?:the\\s+)?([a-z\\s]+?)(?:\\s+button|\\s+field|\\s+link|\\s+menu|\\s+option|$|\\.)`,
        'i'
      )
      const match = text.match(verbPattern)
      if (match && match[1] && match[1].trim().length > 3) {
        foundAction = `${verb} ${match[1].trim()}`
        break
      }
    }

    if (foundAction) {
      steps.push(`When I ${capitalizeTitleCase(foundAction)}`)
    } else if (sentences.length >= 2) {
      // Use second sentence as action
      const actionSentence = sentences[1].trim()
      if (actionSentence.length > 5) {
        steps.push(`When ${capitalizeTitleCase(actionSentence)}`)
      } else {
        steps.push(`When I Perform The Required Action`)
      }
    } else {
      // Extract from any sentence that contains action words
      const actionSentence = sentences.find(s =>
        s.match(
          /(?:click|select|enter|type|fill|submit|search|filter|navigate|open|save|delete|edit|create|update|view)/i
        )
      )
      if (actionSentence) {
        steps.push(`When ${capitalizeTitleCase(actionSentence.trim())}`)
      } else {
        steps.push(`When I Perform The Required Action`)
      }
    }
  }

  // Extract Then step - be more intelligent about expected results
  if (thenMatch && thenMatch[1] && thenMatch[1].trim().length > 5) {
    steps.push(`Then ${capitalizeTitleCase(thenMatch[1].trim())}`)
  } else {
    // Extract expected result from text
    const expectedPatterns = [
      /(?:should|must|will|debe|será)\s+(?:see|view|display|show|receive|get|obtain|obtener|ver|mostrar)\s+(.+?)(?:\.|$)/i,
      /(?:expected|esperado|result|resultado)\s+(?:is|should be|será|es)\s+(.+?)(?:\.|$)/i,
      /(?:verify|confirm|check|verificar|confirmar)\s+(?:that|que)\s+(.+?)(?:\.|$)/i
    ]

    let foundExpected = null
    for (const pattern of expectedPatterns) {
      const match = text.match(pattern)
      if (match && match[1] && match[1].trim().length > 5) {
        foundExpected = match[1].trim()
        break
      }
    }

    if (foundExpected) {
      steps.push(`Then I Should ${capitalizeTitleCase(foundExpected)}`)
    } else if (sentences.length >= 3) {
      // Use third sentence as expected result
      const expectedSentence = sentences[2].trim()
      if (expectedSentence.length > 5) {
        steps.push(`Then ${capitalizeTitleCase(expectedSentence)}`)
      } else {
        steps.push(`Then The Expected Result Should Be Achieved`)
      }
    } else {
      // Generate based on context
      const contextBasedResult = generateContextBasedExpectedResult(text)
      steps.push(`Then ${contextBasedResult}`)
    }
  }

  return steps.join('\n')
}

function generateContextBasedExpectedResult(text) {
  const lowerText = text.toLowerCase()

  // Page/View context
  if (lowerText.includes('page') || lowerText.includes('screen') || lowerText.includes('view')) {
    const pageMatch = text.match(
      /(?:on|in|at)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+screen|\s+view)/i
    )
    if (pageMatch && pageMatch[1]) {
      return `I Should See The ${capitalizeTitleCase(pageMatch[1].trim())} Page Displayed Correctly`
    }
    return 'I Should See The Page Displayed Correctly With All Expected Elements'
  }

  // Action-based results
  if (lowerText.includes('search') || lowerText.includes('find') || lowerText.includes('filter')) {
    return 'I Should See The Search Results Displayed Correctly Matching My Query'
  }

  if (lowerText.includes('click') || lowerText.includes('select')) {
    return 'The Selected Action Should Be Performed Successfully'
  }

  if (lowerText.includes('enter') || lowerText.includes('type') || lowerText.includes('fill')) {
    return 'The Information Should Be Entered Correctly And Displayed In The Form'
  }

  if (lowerText.includes('submit') || lowerText.includes('save')) {
    return 'The Form Should Be Submitted Successfully And Confirmation Should Be Displayed'
  }

  if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
    return 'The New Item Should Be Created Successfully And Visible In The System'
  }

  if (lowerText.includes('update') || lowerText.includes('edit') || lowerText.includes('modify')) {
    return 'The Item Should Be Updated Successfully With The New Information'
  }

  if (lowerText.includes('delete') || lowerText.includes('remove')) {
    return 'The Item Should Be Deleted Successfully And Removed From The System'
  }

  if (lowerText.includes('view') || lowerText.includes('display') || lowerText.includes('show')) {
    return 'The Information Should Be Displayed Correctly With All Expected Details'
  }

  // Default intelligent result
  return 'The Expected Outcome Should Be Achieved And Verified Successfully'
}

function generateStepsFromAC(text, acType, variationIndex = 0, totalVariations = 1) {
  if (!text || typeof text !== 'string') {
    return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
  }

  // Check if text contains Gherkin format - if so, convert to step-by-step
  const hasGherkin = /(?:Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i.test(text)

  let baseSteps = ''

  if (hasGherkin) {
    // Convert Gherkin to step-by-step format
    baseSteps = convertGherkinToStepByStep(text)
  } else {
    // Regular step-by-step generation
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5)

    if (sentences.length === 0) {
      baseSteps = generateStepsFromText(text)
    } else {
      // Convert sentences to numbered steps, removing Gherkin keywords if present
      baseSteps = sentences
        .map((sentence, index) => {
          // Remove Gherkin keywords from sentence
          let cleanSentence = sentence
            .trim()
            .replace(/^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i, '')
            .trim()

          // Capitalize first letter
          if (cleanSentence) {
            cleanSentence = cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1)
          }

          return cleanSentence ? `${index + 1}. ${cleanSentence}` : null
        })
        .filter(Boolean)
        .join('\n')
    }

    // Ensure we have at least some steps
    if (!baseSteps || baseSteps.trim().length === 0) {
      baseSteps = generateStepsFromText(text)
    }
  }

  // Create variation if needed
  if (totalVariations > 1 && variationIndex > 0) {
    return createStepsVariation(baseSteps, variationIndex)
  }

  return baseSteps
}

/**
 * Convert Gherkin format to step-by-step format
 */
function convertGherkinToStepByStep(gherkinText) {
  const steps = []

  // Extract Given step
  const givenMatch = gherkinText.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|\n|$)/i)
  if (givenMatch && givenMatch[1]) {
    const givenText = givenMatch[1].trim()
    steps.push(`1. Ensure ${givenText.charAt(0).toLowerCase() + givenText.slice(1)}`)
  } else {
    steps.push('1. Navigate to the application')
  }

  // Extract When step
  const whenMatch = gherkinText.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|\n|$)/i)
  if (whenMatch && whenMatch[1]) {
    const whenText = whenMatch[1].trim()
    // Convert to action format
    let actionText = whenText
    if (!actionText.match(/^(I|user|usuario)\s+/i)) {
      actionText = `I ${actionText.charAt(0).toLowerCase() + actionText.slice(1)}`
    }
    steps.push(`${steps.length + 1}. ${capitalizeTitleCase(actionText)}`)
  } else {
    steps.push(`${steps.length + 1}. Perform the required action`)
  }

  // Extract Then step
  const thenMatch = gherkinText.match(/(?:Then|Entonces)\s+(.+?)(?:\.|\n|$)/i)
  if (thenMatch && thenMatch[1]) {
    const thenText = thenMatch[1].trim()
    // Convert to verification format
    let verifyText = thenText
    if (!verifyText.match(/^(I|should|must|will|verify|check|confirm)/i)) {
      verifyText = `verify that ${verifyText.charAt(0).toLowerCase() + verifyText.slice(1)}`
    }
    steps.push(`${steps.length + 1}. ${capitalizeTitleCase(verifyText)}`)
  } else {
    steps.push(`${steps.length + 1}. Verify the expected result`)
  }

  return steps.join('\n')
}

/**
 * Create a variation of step-by-step test case
 */
function createStepsVariation(baseSteps, variationIndex) {
  const steps = baseSteps.split('\n')

  switch (variationIndex) {
    case 1: // Positive path - add verification steps
      return (
        baseSteps +
        '\n' +
        `${steps.length + 1}. Verify the operation completed successfully\n${steps.length + 2}. Confirm all expected outcomes are met`
      )

    case 2: // Negative path - modify steps for error scenarios
      const negativeSteps = steps.map((step, idx) => {
        if (idx === steps.length - 1) {
          return `${idx + 1}. ${step.replace(/verify|check|confirm/i, 'verify error').replace(/expected result/i, 'error message')}`
        }
        return step
      })
      return (
        negativeSteps.join('\n') +
        `\n${steps.length + 1}. Verify appropriate error message is displayed\n${steps.length + 2}. Confirm system state is maintained`
      )

    case 3: // Edge case - add boundary testing steps
      return (
        baseSteps +
        '\n' +
        `${steps.length + 1}. Test with boundary values\n${steps.length + 2}. Verify system handles edge cases correctly`
      )

    case 4: // Alternative flow
      const altSteps = steps.map((step, idx) => {
        if (idx === 1) {
          return `${idx + 1}. ${step.replace(/required action|perform/i, 'alternative approach')}`
        }
        return step
      })
      return altSteps.join('\n')

    default:
      return baseSteps
  }
}

function generateStepsFromText(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
  }

  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5)

  if (sentences.length > 0) {
    return sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n')
  }

  // Fallback steps
  return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
}

function generateExpectedResult(
  text,
  source,
  functionality = null,
  thenMatch = null,
  title = null,
  steps = null,
  variationIndex = 0
) {
  if (!text || typeof text !== 'string') {
    return 'Operation completes successfully and expected behavior is verified'
  }

  // Try to get expected result from patterns first
  if (functionality && functionality.type) {
    const patternExpected = getPatternBasedExpectedResult(text, functionality, variationIndex)
    if (patternExpected) {
      return patternExpected
    }
  }

  // Combine all text sources for better analysis
  const combinedText = [text, title, steps].filter(Boolean).join(' ')
  const lowerText = combinedText.toLowerCase()

  // Priority 1: Use extracted "Then" match if available
  if (thenMatch && thenMatch[1]) {
    const thenText = thenMatch[1].trim()
    if (thenText.length > 5) {
      // Capitalize first letter
      return thenText.charAt(0).toUpperCase() + thenText.slice(1)
    }
  }

  // Priority 2: Extract from explicit "Then" statements in text
  if (source === 'expected' || lowerText.startsWith('then') || lowerText.includes('then')) {
    const thenPattern = text.match(/(?:Then|Entonces)[:\s]+(.+?)(?:\.|$|When|Given)/i)
    if (thenPattern && thenPattern[1] && thenPattern[1].trim().length > 5) {
      return thenPattern[1].trim().charAt(0).toUpperCase() + thenPattern[1].trim().slice(1)
    }
  }

  // Priority 3: Extract from "should" or "debe" statements
  const shouldMatch = text.match(/(?:should|debe|must)\s+(.+?)(?:\.|$|and|or)/i)
  if (shouldMatch && shouldMatch[1] && shouldMatch[1].trim().length > 5) {
    return shouldMatch[1].trim().charAt(0).toUpperCase() + shouldMatch[1].trim().slice(1)
  }

  // Priority 4: Extract from "expected" or "esperado" statements
  const expectedMatch = text.match(/(?:expected|esperado|result)[:\s]+(.+?)(?:\.|$)/i)
  if (expectedMatch && expectedMatch[1] && expectedMatch[1].trim().length > 5) {
    return expectedMatch[1].trim().charAt(0).toUpperCase() + expectedMatch[1].trim().slice(1)
  }

  // Priority 5: Functionality-specific expected results with more context
  if (functionality) {
    const funcType = functionality.type
    const funcText = lowerText

    switch (funcType) {
      case 'authentication':
        if (
          funcText.includes('invalid') ||
          funcText.includes('wrong') ||
          funcText.includes('incorrect')
        ) {
          return 'Error message is displayed indicating invalid credentials'
        }
        if (funcText.includes('logout') || funcText.includes('sign out')) {
          return 'User is successfully logged out and redirected to login page'
        }
        return 'User is successfully authenticated and redirected to the appropriate page'

      case 'crud':
        if (funcText.includes('create') || funcText.includes('add') || funcText.includes('new')) {
          return 'New record is successfully created and visible in the list'
        }
        if (
          funcText.includes('read') ||
          funcText.includes('view') ||
          funcText.includes('display')
        ) {
          return 'Record details are correctly displayed with all information'
        }
        if (
          funcText.includes('update') ||
          funcText.includes('edit') ||
          funcText.includes('modify')
        ) {
          return 'Record is successfully updated with the new information'
        }
        if (funcText.includes('delete') || funcText.includes('remove')) {
          return 'Record is successfully deleted and removed from the system'
        }
        return 'CRUD operation completes successfully'

      case 'validation':
        if (
          funcText.includes('invalid') ||
          funcText.includes('error') ||
          funcText.includes('wrong')
        ) {
          return 'Validation error message is displayed indicating the issue'
        }
        if (funcText.includes('required') || funcText.includes('mandatory')) {
          return 'Required field validation is triggered and error is shown'
        }
        return 'Input is validated correctly and appropriate feedback is provided'

      case 'payment':
        if (funcText.includes('success') || funcText.includes('complete')) {
          return 'Payment is successfully processed and confirmation is displayed'
        }
        if (
          funcText.includes('fail') ||
          funcText.includes('decline') ||
          funcText.includes('error')
        ) {
          return 'Payment failure is handled correctly and error message is shown'
        }
        return 'Payment transaction is processed and appropriate status is displayed'

      case 'search':
        if (funcText.includes('no result') || funcText.includes('empty')) {
          return 'No results message is displayed when no matches are found'
        }
        return 'Search results are displayed correctly matching the query criteria'

      case 'export':
        return 'Export file is generated successfully and download is initiated'

      case 'notification':
        return 'Notification is sent successfully and delivery confirmation is received'

      case 'fileUpload':
        if (funcText.includes('invalid') || funcText.includes('wrong type')) {
          return 'File upload is rejected with appropriate error message'
        }
        if (funcText.includes('large') || funcText.includes('size')) {
          return 'File size validation is performed and appropriate message is shown'
        }
        return 'File is successfully uploaded and confirmation is displayed'

      case 'api':
        if (funcText.includes('error') || funcText.includes('fail')) {
          return 'API error is handled correctly and appropriate error response is returned'
        }
        return 'API request is processed successfully and expected response is returned'

      case 'workflow':
        if (funcText.includes('approve') || funcText.includes('approval')) {
          return 'Workflow approval is processed and status is updated correctly'
        }
        if (funcText.includes('reject') || funcText.includes('deny')) {
          return 'Workflow rejection is processed and status is updated correctly'
        }
        return 'Workflow step is completed successfully and status transitions correctly'
    }
  }

  // Priority 6: Context-based extraction from text patterns
  if (
    lowerText.includes('login') ||
    lowerText.includes('sign in') ||
    lowerText.includes('authenticate')
  ) {
    if (lowerText.includes('invalid') || lowerText.includes('wrong')) {
      return 'Authentication fails and error message is displayed'
    }
    return 'User is successfully authenticated and redirected to dashboard'
  }

  if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
    return 'New item is successfully created and displayed in the system'
  }

  if (lowerText.includes('update') || lowerText.includes('edit') || lowerText.includes('modify')) {
    return 'Item is successfully updated with the new information'
  }

  if (
    lowerText.includes('delete') ||
    lowerText.includes('remove') ||
    lowerText.includes('eliminate')
  ) {
    return 'Item is successfully deleted and removed from the system'
  }

  if (
    lowerText.includes('validate') ||
    lowerText.includes('verify') ||
    lowerText.includes('check')
  ) {
    return 'Validation is performed correctly and appropriate feedback is provided'
  }

  if (lowerText.includes('search') || lowerText.includes('find') || lowerText.includes('filter')) {
    return 'Search results are displayed correctly based on the query'
  }

  if (lowerText.includes('submit') || lowerText.includes('send') || lowerText.includes('save')) {
    return 'Form is successfully submitted and confirmation is displayed'
  }

  if (lowerText.includes('display') || lowerText.includes('show') || lowerText.includes('view')) {
    return 'Information is correctly displayed with all expected details'
  }

  // Priority 7: Extract from steps (especially "Then" steps in Gherkin)
  if (steps) {
    const thenStepMatch = steps.match(/(?:Then|Entonces)\s+(.+?)(?:\n|$)/i)
    if (thenStepMatch && thenStepMatch[1]) {
      const thenText = thenStepMatch[1].trim()
      if (
        thenText.length > 5 &&
        !thenText.toLowerCase().includes('expected result should be achieved')
      ) {
        // Clean up common prefixes like "I Should", "I Will", etc.
        const cleaned = thenText.replace(/^(I\s+(?:should|will|must|can)|The|That)\s+/i, '').trim()
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      }
    }

    // Extract from step-by-step format (last step often describes verification)
    if (steps.includes('\n')) {
      const stepLines = steps.split('\n').filter(line => line.trim().length > 0)
      if (stepLines.length > 0) {
        const lastStep = stepLines[stepLines.length - 1]
        // If last step contains verification keywords
        if (
          lastStep.match(/(?:verify|check|confirm|validate|ensure|expect|should|see|display|show)/i)
        ) {
          const stepText = lastStep.replace(/^\d+\.\s*/, '').trim()
          if (stepText.length > 10) {
            return stepText.charAt(0).toUpperCase() + stepText.slice(1)
          }
        }
      }
    }
  }

  // Priority 8: Generate from title if it contains action verbs
  if (title) {
    const titleLower = title.toLowerCase()
    const actionPatterns = [
      {
        pattern: /(?:create|add|new|insert)/i,
        result: 'New item is successfully created and displayed'
      },
      {
        pattern: /(?:update|edit|modify|change)/i,
        result: 'Item is successfully updated with the new information'
      },
      {
        pattern: /(?:delete|remove|eliminate)/i,
        result: 'Item is successfully deleted and removed from the system'
      },
      {
        pattern: /(?:view|display|show|see)/i,
        result: 'Information is correctly displayed with all expected details'
      },
      {
        pattern: /(?:search|find|filter)/i,
        result: 'Search results are displayed correctly based on the query'
      },
      {
        pattern: /(?:submit|send|save)/i,
        result: 'Form is successfully submitted and confirmation is displayed'
      },
      {
        pattern: /(?:login|sign in|authenticate)/i,
        result: 'User is successfully authenticated and redirected to the appropriate page'
      },
      {
        pattern: /(?:logout|sign out)/i,
        result: 'User is successfully logged out and redirected to login page'
      },
      {
        pattern: /(?:upload|file)/i,
        result: 'File is successfully uploaded and confirmation is displayed'
      },
      { pattern: /(?:download|export)/i, result: 'File is successfully downloaded/exported' },
      {
        pattern: /(?:validate|verify|check)/i,
        result: 'Validation is performed correctly and appropriate feedback is provided'
      }
    ]

    for (const { pattern, result } of actionPatterns) {
      if (pattern.test(title)) {
        return result
      }
    }
  }

  // Priority 9: Extract from last sentence if it seems to describe an outcome
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10)
  if (sentences.length > 0) {
    const lastSentence = sentences[sentences.length - 1].trim()
    // If last sentence seems to describe a result (contains result keywords)
    if (
      lastSentence.match(
        /(?:result|outcome|display|show|appear|confirm|success|complete|finish|done)/i
      )
    ) {
      return lastSentence.charAt(0).toUpperCase() + lastSentence.slice(1)
    }
  }

  // Priority 10: Generate based on action verbs in the text
  const actionVerbs = {
    create: 'New item is successfully created and visible in the system',
    add: 'Item is successfully added to the system',
    insert: 'Data is successfully inserted into the system',
    update: 'Item is successfully updated with the new information',
    edit: 'Item is successfully edited and changes are saved',
    modify: 'Item is successfully modified and changes are reflected',
    delete: 'Item is successfully deleted and removed from the system',
    remove: 'Item is successfully removed from the system',
    view: 'Information is correctly displayed with all expected details',
    display: 'Information is correctly displayed on the screen',
    show: 'Information is correctly shown to the user',
    search: 'Search results are displayed correctly matching the query',
    find: 'Matching items are found and displayed correctly',
    filter: 'Items are filtered correctly based on the criteria',
    submit: 'Form is successfully submitted and confirmation is displayed',
    send: 'Message/request is successfully sent and confirmation is received',
    save: 'Data is successfully saved and confirmation is displayed',
    login: 'User is successfully authenticated and redirected to the appropriate page',
    authenticate: 'Authentication is successful and user is granted access',
    logout: 'User is successfully logged out and session is terminated',
    upload: 'File is successfully uploaded and confirmation is displayed',
    download: 'File is successfully downloaded to the specified location',
    export: 'Data is successfully exported in the requested format',
    validate: 'Input is validated correctly and appropriate feedback is provided',
    verify: 'Verification is completed successfully and results are confirmed',
    check: 'Check is performed successfully and results are displayed'
  }

  for (const [verb, result] of Object.entries(actionVerbs)) {
    if (lowerText.includes(verb)) {
      return result
    }
  }

  // Priority 11: Generate based on common patterns in the text
  if (lowerText.match(/(?:user|usuario)\s+(?:can|should|must|will|puede|debe)\s+(.+?)(?:\.|$)/i)) {
    const match = lowerText.match(
      /(?:user|usuario)\s+(?:can|should|must|will|puede|debe)\s+(.+?)(?:\.|$)/i
    )
    if (match && match[1] && match[1].trim().length > 5) {
      return match[1].trim().charAt(0).toUpperCase() + match[1].trim().slice(1) + ' successfully'
    }
  }

  // Final fallback: Generate based on title/context with more specificity
  if (title) {
    // Try to infer from title structure
    const titleWords = title.toLowerCase().split(/\s+/)
    if (titleWords.length > 2) {
      // Take last few words and create a result
      const lastWords = titleWords.slice(-3).join(' ')
      return `The ${lastWords} is completed successfully and expected behavior is verified`
    }
  }

  return 'Operation completes successfully and expected behavior is verified'
}

function determinePriority(text) {
  const lowerText = text.toLowerCase()
  const highPriorityKeywords = [
    'critical',
    'urgent',
    'must',
    'blocker',
    'security',
    'payment',
    'crítico',
    'urgente',
    'debe',
    'seguridad',
    'pago'
  ]
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
  let title = text.replace(
    /^(AC|Acceptance Criteria|Given|When|Then|As a|I want)[:\s]+\d*[:\s]*/i,
    ''
  )
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
    steps:
      format === 'gherkin'
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

/**
 * Get pattern-based steps from JSON patterns
 */
function getPatternBasedSteps(text, functionality, format, variationIndex = 0) {
  if (!text || !functionality || !functionality.type) {
    return null
  }

  const funcType = functionality.type
  const lowerText = text.toLowerCase()

  // Get patterns for this functionality
  const patterns = testCasePatterns[funcType]
  if (!patterns) {
    return null
  }

  // Determine which pattern to use based on text content and variation index
  let patternKey = null
  let pattern = null

  // Determine pattern based on variation index and text content
  if (variationIndex === 0 || variationIndex === 1) {
    // Positive flow
    if (funcType === 'authentication') {
      patternKey =
        lowerText.includes('invalid') || lowerText.includes('wrong') ? 'negative' : 'positive'
    } else if (funcType === 'crud') {
      if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
        patternKey = 'create'
      } else if (
        lowerText.includes('read') ||
        lowerText.includes('view') ||
        lowerText.includes('display')
      ) {
        patternKey = 'read'
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        patternKey = 'update'
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        patternKey = 'delete'
      } else {
        patternKey = 'create' // Default
      }
    } else if (funcType === 'validation') {
      if (lowerText.includes('required') || lowerText.includes('mandatory')) {
        patternKey = 'requiredFields'
      } else if (lowerText.includes('format') || lowerText.includes('pattern')) {
        patternKey = 'formatValidation'
      } else if (lowerText.includes('boundary') || lowerText.includes('limit')) {
        patternKey = 'boundaryValues'
      } else {
        patternKey = 'requiredFields' // Default
      }
    } else if (funcType === 'payment') {
      patternKey =
        lowerText.includes('fail') || lowerText.includes('decline') || lowerText.includes('error')
          ? 'paymentFailure'
          : 'successfulPayment'
    } else if (funcType === 'search') {
      if (lowerText.includes('no result') || lowerText.includes('empty')) {
        patternKey = 'noResults'
      } else if (lowerText.includes('filter') || lowerText.includes('advanced')) {
        patternKey = 'advancedSearch'
      } else {
        patternKey = 'basicSearch'
      }
    } else if (funcType === 'export') {
      patternKey = 'exportData'
    } else if (funcType === 'fileUpload') {
      patternKey =
        lowerText.includes('invalid') || lowerText.includes('wrong')
          ? 'invalidFile'
          : 'successfulUpload'
    } else if (funcType === 'api') {
      patternKey =
        lowerText.includes('error') || lowerText.includes('invalid') || lowerText.includes('fail')
          ? 'apiError'
          : 'apiRequest'
    } else if (funcType === 'workflow') {
      patternKey =
        lowerText.includes('approval') || lowerText.includes('approve')
          ? 'workflowApproval'
          : 'workflowExecution'
    } else {
      // Use generic patterns
      const genericPatterns = testCasePatterns.generic
      if (genericPatterns) {
        patternKey =
          lowerText.includes('invalid') || lowerText.includes('error') || lowerText.includes('fail')
            ? 'negativeFlow'
            : 'basicFlow'
        pattern = genericPatterns[patternKey]
        if (pattern) {
          if (format === 'gherkin' && pattern.gherkin) {
            const gherkin = pattern.gherkin
            return `Given ${gherkin.given}\nWhen ${gherkin.when}\nThen ${gherkin.then}`
          } else if (format === 'stepByStep' && pattern.stepByStep) {
            return pattern.stepByStep.map((step, index) => `${index + 1}. ${step}`).join('\n')
          }
        }
      }
      return null
    }
  } else if (variationIndex === 2) {
    // Negative flow
    if (funcType === 'authentication') {
      patternKey = 'negative'
    } else if (funcType === 'crud') {
      patternKey = 'delete' // Use delete as negative example
    } else if (funcType === 'validation') {
      patternKey = 'formatValidation'
    } else if (funcType === 'payment') {
      patternKey = 'paymentFailure'
    } else if (funcType === 'fileUpload') {
      patternKey = 'invalidFile'
    } else {
      const genericPatterns = testCasePatterns.generic
      if (genericPatterns && genericPatterns.negativeFlow) {
        pattern = genericPatterns.negativeFlow
        if (pattern) {
          if (format === 'gherkin' && pattern.gherkin) {
            const gherkin = pattern.gherkin
            return `Given ${gherkin.given}\nWhen ${gherkin.when}\nThen ${gherkin.then}`
          } else if (format === 'stepByStep' && pattern.stepByStep) {
            return pattern.stepByStep.map((step, index) => `${index + 1}. ${step}`).join('\n')
          }
        }
      }
      return null
    }
  } else {
    // Use generic patterns for other variations
    const genericPatterns = testCasePatterns.generic
    if (genericPatterns && genericPatterns.basicFlow) {
      pattern = genericPatterns.basicFlow
      if (pattern) {
        if (format === 'gherkin' && pattern.gherkin) {
          const gherkin = pattern.gherkin
          return `Given ${gherkin.given}\nWhen ${gherkin.when}\nThen ${gherkin.then}`
        } else if (format === 'stepByStep' && pattern.stepByStep) {
          return pattern.stepByStep.map((step, index) => `${index + 1}. ${step}`).join('\n')
        }
      }
    }
    return null
  }

  // Get the pattern
  pattern = patterns[patternKey]
  if (!pattern) {
    // Fallback to first available pattern
    const firstKey = Object.keys(patterns)[0]
    pattern = patterns[firstKey]
  }

  if (!pattern) {
    return null
  }

  // Get steps based on format
  if (format === 'gherkin' && pattern.gherkin) {
    const gherkin = pattern.gherkin
    return `Given ${gherkin.given}\nWhen ${gherkin.when}\nThen ${gherkin.then}`
  } else if (format === 'stepByStep' && pattern.stepByStep) {
    return pattern.stepByStep.map((step, index) => `${index + 1}. ${step}`).join('\n')
  }

  return null
}

/**
 * Get pattern-based expected result from JSON patterns
 */
function getPatternBasedExpectedResult(text, functionality, variationIndex = 0) {
  if (!text || !functionality || !functionality.type) {
    return null
  }

  const funcType = functionality.type
  const lowerText = text.toLowerCase()

  // Get patterns for this functionality
  const patterns = testCasePatterns[funcType]
  if (!patterns) {
    return null
  }

  // Determine which pattern to use based on text content and variation index
  let patternKey = null
  let pattern = null

  // Determine pattern based on variation index and text content
  if (variationIndex === 0 || variationIndex === 1) {
    // Positive flow
    if (funcType === 'authentication') {
      patternKey =
        lowerText.includes('invalid') || lowerText.includes('wrong') ? 'negative' : 'positive'
    } else if (funcType === 'crud') {
      if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
        patternKey = 'create'
      } else if (
        lowerText.includes('read') ||
        lowerText.includes('view') ||
        lowerText.includes('display')
      ) {
        patternKey = 'read'
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        patternKey = 'update'
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        patternKey = 'delete'
      } else {
        patternKey = 'create' // Default
      }
    } else if (funcType === 'validation') {
      if (lowerText.includes('required') || lowerText.includes('mandatory')) {
        patternKey = 'requiredFields'
      } else if (lowerText.includes('format') || lowerText.includes('pattern')) {
        patternKey = 'formatValidation'
      } else if (lowerText.includes('boundary') || lowerText.includes('limit')) {
        patternKey = 'boundaryValues'
      } else {
        patternKey = 'requiredFields' // Default
      }
    } else if (funcType === 'payment') {
      patternKey =
        lowerText.includes('fail') || lowerText.includes('decline') || lowerText.includes('error')
          ? 'paymentFailure'
          : 'successfulPayment'
    } else if (funcType === 'search') {
      if (lowerText.includes('no result') || lowerText.includes('empty')) {
        patternKey = 'noResults'
      } else if (lowerText.includes('filter') || lowerText.includes('advanced')) {
        patternKey = 'advancedSearch'
      } else {
        patternKey = 'basicSearch'
      }
    } else if (funcType === 'export') {
      patternKey = 'exportData'
    } else if (funcType === 'fileUpload') {
      patternKey =
        lowerText.includes('invalid') || lowerText.includes('wrong')
          ? 'invalidFile'
          : 'successfulUpload'
    } else if (funcType === 'api') {
      patternKey =
        lowerText.includes('error') || lowerText.includes('invalid') || lowerText.includes('fail')
          ? 'apiError'
          : 'apiRequest'
    } else if (funcType === 'workflow') {
      patternKey =
        lowerText.includes('approval') || lowerText.includes('approve')
          ? 'workflowApproval'
          : 'workflowExecution'
    } else {
      const genericPatterns = testCasePatterns.generic
      if (genericPatterns) {
        patternKey =
          lowerText.includes('invalid') || lowerText.includes('error') || lowerText.includes('fail')
            ? 'negativeFlow'
            : 'basicFlow'
        pattern = genericPatterns[patternKey]
        if (pattern && pattern.expectedResult) {
          return pattern.expectedResult
        }
      }
      return null
    }
  } else if (variationIndex === 2) {
    // Negative flow
    if (funcType === 'authentication') {
      patternKey = 'negative'
    } else if (funcType === 'crud') {
      patternKey = 'delete'
    } else if (funcType === 'validation') {
      patternKey = 'formatValidation'
    } else if (funcType === 'payment') {
      patternKey = 'paymentFailure'
    } else if (funcType === 'fileUpload') {
      patternKey = 'invalidFile'
    } else {
      const genericPatterns = testCasePatterns.generic
      if (
        genericPatterns &&
        genericPatterns.negativeFlow &&
        genericPatterns.negativeFlow.expectedResult
      ) {
        return genericPatterns.negativeFlow.expectedResult
      }
      return null
    }
  } else {
    // Use generic patterns for other variations
    const genericPatterns = testCasePatterns.generic
    if (genericPatterns && genericPatterns.basicFlow && genericPatterns.basicFlow.expectedResult) {
      return genericPatterns.basicFlow.expectedResult
    }
    return null
  }

  // Get the pattern
  pattern = patterns[patternKey]
  if (!pattern) {
    // Fallback to first available pattern
    const firstKey = Object.keys(patterns)[0]
    pattern = patterns[firstKey]
  }

  if (!pattern || !pattern.expectedResult) {
    return null
  }

  return pattern.expectedResult
}
