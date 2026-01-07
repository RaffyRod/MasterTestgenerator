/**
 * Intelligent Analyzer for AC and Project Information
 * Analyzes patterns and generates intelligent recommendations
 */

import testCasePatterns from '@shared/data/patterns/test-case-patterns.json'
import { generateIntelligentTitle } from '@core/ai/aiService.js'

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

export async function generateIntelligentTestCases(
  projectInfo,
  format = 'stepByStep',
  analysis = null,
  testsPerAC = 1,
  useAIForTitle = false
) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return []
  }

  try {
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
      console.log(
        `Found ${acceptanceCriteria.length} acceptance criteria, generating test cases...`
      )
      for (let acIndex = 0; acIndex < acceptanceCriteria.length; acIndex++) {
        const ac = acceptanceCriteria[acIndex]
        console.log(`Processing AC ${acIndex + 1}: ${ac.text.substring(0, 50)}...`)
        const functionality = findMatchingFunctionality(ac.text, analysis.detectedFunctionalities)

        // Generate multiple test cases per AC if requested
        for (let tcIndex = 0; tcIndex < validTestsPerAC; tcIndex++) {
          try {
            const testCase = await createTestCaseFromAC(
              ac,
              functionality,
              format,
              testCases.length + 1,
              tcIndex,
              validTestsPerAC,
              useAIForTitle,
              acIndex + 1
            )
            if (testCase) {
              testCases.push(testCase)
              console.log(
                `Generated test case ${testCases.length} for AC ${acIndex + 1}, variation ${tcIndex + 1}`
              )
            } else {
              console.warn(
                `Failed to generate test case for AC ${acIndex + 1}, variation ${tcIndex + 1}`
              )
            }
          } catch (error) {
            console.error(
              `Error generating test case for AC ${acIndex + 1}, variation ${tcIndex + 1}:`,
              error
            )
            // Continue with next variation
          }
        }
      }
      console.log(`Total test cases generated: ${testCases.length}`)
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
          const functionality = findMatchingFunctionality(
            sentence,
            analysis.detectedFunctionalities
          )
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
      acceptanceCriteria.length > 0
        ? expectedTotal
        : Math.min(50, analysis.estimatedTestCases || 20)

    return testCases.slice(0, maxLimit)
  } catch (error) {
    console.error('Error in generateIntelligentTestCases:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      projectInfoLength: projectInfo?.length
    })
    // Return at least one default test case on error
    return [createDefaultTestCase(projectInfo, format)]
  }
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

async function createTestCaseFromAC(
  ac,
  functionality,
  format,
  id,
  variationIndex = 0,
  totalVariations = 1,
  useAIForTitle = false,
  acId = null
) {
  if (!ac || !ac.text) {
    return null
  }

  const priority = functionality?.priorities?.default || determinePriority(ac.text)
  // Always default to 'Functional' unless explicitly specified, and prefer first testType from array
  const testType = functionality?.testTypes?.[0] || functionality?.testType || 'Functional'

  // Generate variations if multiple test cases per AC
  let acText = ac.text

  // Always use AI for title generation if enabled, even for base case
  let title
  if (useAIForTitle) {
    try {
      title = await generateTitleFromACWithAI(ac.text)
      if (!title || title.trim().length === 0) {
        title = generateTitleFromAC(ac.text)
      }
    } catch (error) {
      console.warn('AI title generation failed, using fallback:', error)
      title = generateTitleFromAC(ac.text)
    }
  } else {
    title = generateTitleFromAC(ac.text)
  }

  if (totalVariations > 1 && variationIndex > 0) {
    // Create variation of the AC for additional test cases
    acText = createACVariation(ac.text, variationIndex, totalVariations)
    if (useAIForTitle) {
      try {
        const variationTitle = await generateTitleFromACWithAI(acText)
        if (variationTitle && variationTitle.trim().length > 0) {
          title = variationTitle
        } else {
          title = generateTitleFromAC(acText)
        }
      } catch (error) {
        console.warn('AI title generation for variation failed, using fallback:', error)
        title = generateTitleFromAC(acText)
      }
    } else {
      title = generateTitleFromAC(acText)
    }

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

  const acType = ac.type || 'requirement'

  const gherkinSteps =
    format === 'gherkin'
      ? generateGherkinFromAC(acText, acType, variationIndex, totalVariations, functionality)
      : null
  const stepByStep =
    format === 'gherkin'
      ? null
      : generateStepsFromAC(acText, acType, variationIndex, totalVariations, functionality)

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
      acType,
      functionality,
      thenMatch,
      title,
      steps,
      variationIndex,
      totalVariations
    ),
    scenario: extractScenario(acText),
    given: givenMatch ? givenMatch[1].trim() : null,
    when: whenMatch ? whenMatch[1].trim() : null,
    then: thenMatch ? thenMatch[1].trim() : null,
    folder: functionality?.folder || 'Test Cases',
    source: 'acceptance_criteria',
    acId: acId,
    acText: ac.text
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

/**
 * Generate title from AC using AI if available, otherwise use intelligent fallback
 */
async function generateTitleFromACWithAI(text) {
  try {
    const title = await generateIntelligentTitle(text, 'en', 'testCase')
    return title || generateTitleFromAC(text)
  } catch (error) {
    console.warn('AI title generation failed, using fallback:', error)
    return generateTitleFromAC(text)
  }
}

function generateTitleFromAC(text) {
  if (!text || typeof text !== 'string') {
    return 'Test Case'
  }

  // Remove AC prefix
  let title = text.replace(/^AC[:\s]+\d*[:\s]*/i, '')
  title = title.replace(/^Acceptance\s+Criteria[:\s]+\d*[:\s]*/i, '')

  // Clean up common prefixes
  title = title.replace(
    /^(Given|When|Then|As a|I want|User story|Scenario|Dado|Cuando|Entonces)[:\s]+/i,
    ''
  )

  // Remove Gherkin keywords completely
  title = title.replace(/(?:Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/gi, ' ')

  const lowerTitle = title.toLowerCase()

  // Extract entity/object from common patterns
  const entityPatterns = [
    /(?:list\s+of|view|display|show|see|browse)\s+(?:the\s+)?([a-z]+(?:\s+[a-z]+)*?)(?:\s+list|\s+page|\s+section|$|\.|,)/i,
    /(?:create|add|new)\s+(?:a\s+)?(?:new\s+)?([a-z]+(?:\s+[a-z]+)*?)(?:\s+record|\s+item|\s+entry|$|\.|,)/i,
    /(?:update|edit|modify|change)\s+(?:the\s+)?([a-z]+(?:\s+[a-z]+)*?)(?:\s+record|\s+item|\s+entry|$|\.|,)/i,
    /(?:delete|remove)\s+(?:the\s+)?([a-z]+(?:\s+[a-z]+)*?)(?:\s+record|\s+item|\s+entry|$|\.|,)/i,
    /(?:on|in|at)\s+(?:the\s+)?([a-z]+(?:\s+[a-z]+)*?)(?:\s+page|\s+screen|\s+view|\s+section)/i,
    /([a-z]+(?:\s+[a-z]+)*?)(?:\s+management|\s+module|\s+feature|\s+functionality)/i
  ]

  let extractedEntity = null
  for (const pattern of entityPatterns) {
    const match = title.match(pattern)
    if (match && match[1]) {
      const entity = match[1].trim()
      // Filter out common words that aren't entities
      if (
        !entity.match(
          /^(page|screen|view|section|list|record|item|entry|details|information|data)$/i
        ) &&
        entity.length > 2
      ) {
        extractedEntity = entity
        break
      }
    }
  }

  // Improved pattern matching for better titles with entity context
  const actionPatterns = [
    // View/Display/Browse patterns with entity
    {
      pattern:
        /(?:view|display|show|see|browse|list)\s+(?:the\s+)?(?:list\s+of\s+)?([a-z\s]+?)(?:$|\.|,|successfully|list|page|section)/i,
      format: match => {
        let obj = match[1].trim().replace(/\s+/g, ' ')
        // If entity was extracted and is different, use it
        if (extractedEntity && !obj.toLowerCase().includes(extractedEntity.toLowerCase())) {
          obj = extractedEntity
        }
        // Remove generic words
        obj = obj.replace(/\b(list|page|section|view|details|information|data)\b/gi, '').trim()
        if (obj && obj.length > 2) {
          return `View ${capitalizeTitleCase(obj)} Details`
        }
        return extractedEntity
          ? `View ${capitalizeTitleCase(extractedEntity)} Details`
          : 'View Record Details'
      }
    },
    // Create patterns with entity
    {
      pattern: /(?:create|add|new)\s+(?:a\s+)?(?:new\s+)?([a-z\s]+?)(?:$|\.|,|record|item|entry)/i,
      format: match => {
        let obj = match[1].trim().replace(/\s+/g, ' ')
        if (extractedEntity && !obj.toLowerCase().includes(extractedEntity.toLowerCase())) {
          obj = extractedEntity
        }
        obj = obj.replace(/\b(record|item|entry|new)\b/gi, '').trim()
        if (obj && obj.length > 2) {
          return `Create New ${capitalizeTitleCase(obj)}`
        }
        return extractedEntity
          ? `Create New ${capitalizeTitleCase(extractedEntity)}`
          : 'Create New Record'
      }
    },
    // Update patterns with entity
    {
      pattern:
        /(?:update|edit|modify|change)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.|,|record|item|entry)/i,
      format: match => {
        let obj = match[1].trim().replace(/\s+/g, ' ')
        if (extractedEntity && !obj.toLowerCase().includes(extractedEntity.toLowerCase())) {
          obj = extractedEntity
        }
        obj = obj.replace(/\b(record|item|entry|the)\b/gi, '').trim()
        if (obj && obj.length > 2) {
          return `Update ${capitalizeTitleCase(obj)} Information`
        }
        return extractedEntity
          ? `Update ${capitalizeTitleCase(extractedEntity)} Information`
          : 'Update Record Information'
      }
    },
    // Delete patterns with entity
    {
      pattern: /(?:delete|remove)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.|,|record|item|entry)/i,
      format: match => {
        let obj = match[1].trim().replace(/\s+/g, ' ')
        if (extractedEntity && !obj.toLowerCase().includes(extractedEntity.toLowerCase())) {
          obj = extractedEntity
        }
        obj = obj.replace(/\b(record|item|entry|the)\b/gi, '').trim()
        if (obj && obj.length > 2) {
          return `Delete ${capitalizeTitleCase(obj)}`
        }
        return extractedEntity ? `Delete ${capitalizeTitleCase(extractedEntity)}` : 'Delete Record'
      }
    },
    // Verify/Test patterns with context
    {
      pattern: /(?:verify|test|check|validate)\s+(?:that\s+)?(.+?)(?:$|\.|,|is|are|should|can)/i,
      format: match => {
        const context = match[1].trim()
        if (extractedEntity) {
          return `Verify ${capitalizeTitleCase(extractedEntity)} ${capitalizeTitleCase(context)}`
        }
        return `Verify ${capitalizeTitleCase(context)}`
      }
    },
    // Login patterns
    {
      pattern: /(?:login|sign in|authenticate)/i,
      format: () => 'User Login Authentication'
    },
    // Search patterns with entity
    {
      pattern: /(?:search|find|filter)\s+(?:for\s+)?([a-z\s]+?)(?:$|\.|,)/i,
      format: match => {
        const query = match[1].trim()
        if (extractedEntity) {
          return `Search ${capitalizeTitleCase(extractedEntity)} By ${capitalizeTitleCase(query)}`
        }
        return `Search ${capitalizeTitleCase(query)}`
      }
    }
  ]

  let matched = false
  for (const { pattern, format } of actionPatterns) {
    const match = title.match(pattern)
    if (match) {
      title = format(match)
      matched = true
      break
    }
  }

  // If no pattern matched, build descriptive title from context
  if (!matched) {
    // Remove common filler words at start
    title = title.replace(/^(the|a|an|i|i should|i can|i want|user can|user should)\s+/i, '')

    // Extract meaningful parts
    const sentences = title.split(/[.!?,]/).filter(s => s.trim().length > 5)
    if (sentences.length > 0) {
      let meaningfulPart = sentences[0].trim()

      // Try to extract action and object
      const actionMatch = meaningfulPart.match(/(?:should|must|will|can|may)\s+(.+?)(?:$|\.|,)/i)
      if (actionMatch) {
        meaningfulPart = actionMatch[1].trim()
      }

      // Use entity if extracted
      if (extractedEntity) {
        title = `${capitalizeTitleCase(meaningfulPart)} - ${capitalizeTitleCase(extractedEntity)}`
      } else {
        title = meaningfulPart
      }

      // Limit length
      if (title.length > 60) {
        title = title.substring(0, 57) + '...'
      }
    } else {
      // Fallback: use entity if available
      if (extractedEntity) {
        title = `Test ${capitalizeTitleCase(extractedEntity)} Functionality`
      } else {
        title = title.substring(0, 60).trim()
        const lastSpace = title.lastIndexOf(' ')
        if (lastSpace > 20) {
          title = title.substring(0, lastSpace)
        }
      }
    }
  }

  // Capitalize and limit length
  title = title.trim()
  if (title.length > 60) {
    title = title.substring(0, 57) + '...'
  }

  // Ensure proper capitalization
  title = title.charAt(0).toUpperCase() + title.slice(1)

  // Remove trailing filler words
  title = title.replace(
    /\s+(is|are|should|must|will|can|may|the|a|an|successfully|successful|see|view|it)\s*$/i,
    ''
  )

  // Final cleanup: remove "It" at the end if present
  title = title.replace(/\s+It\s*$/i, '')

  return title || 'Test Case'
}

function generatePreconditions(text, functionality) {
  const preconditions = []
  const lowerText = text.toLowerCase()

  // System-level preconditions
  preconditions.push('Application is deployed and accessible')
  preconditions.push('Test environment is configured and stable')

  // User-related preconditions
  if (lowerText.includes('user') || lowerText.includes('usuario')) {
    if (
      lowerText.includes('login') ||
      lowerText.includes('authenticated') ||
      lowerText.includes('sign in')
    ) {
      preconditions.push('Valid user account exists in the system with appropriate permissions')
      preconditions.push('User is not currently logged in')
    } else if (lowerText.includes('logout') || lowerText.includes('sign out')) {
      preconditions.push('User is logged in with valid credentials')
      preconditions.push('User session is active')
    } else {
      preconditions.push('User account exists in the system with required permissions')
    }
  }

  // Data-related preconditions
  if (lowerText.includes('data') || lowerText.includes('datos') || lowerText.includes('record')) {
    if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
      preconditions.push('Test data prerequisites are met (if applicable)')
    } else if (
      lowerText.includes('update') ||
      lowerText.includes('edit') ||
      lowerText.includes('modify')
    ) {
      preconditions.push('At least one record exists in the system that can be modified')
      preconditions.push('User has edit permissions for the record')
    } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
      preconditions.push('At least one record exists in the system that can be deleted')
      preconditions.push('User has delete permissions for the record')
    } else {
      preconditions.push('Test data is available in the system')
    }
  }

  // Page/View preconditions
  if (lowerText.includes('page') || lowerText.includes('screen') || lowerText.includes('view')) {
    const pageMatch = text.match(/(?:on|in|at)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+screen)/i)
    if (pageMatch) {
      preconditions.push(`User has access to the ${pageMatch[1].trim()} page`)
    }
  }

  // Functionality-specific preconditions
  if (functionality) {
    switch (functionality.type) {
      case 'payment':
        preconditions.push('Payment gateway is configured and accessible')
        preconditions.push('Valid payment method is available for testing')
        preconditions.push('Test payment credentials are configured')
        break
      case 'fileUpload':
        preconditions.push('File upload feature is enabled and configured')
        preconditions.push('Test files are available in the expected format')
        preconditions.push('File size limits are known')
        break
      case 'api':
        preconditions.push('API endpoint is available and accessible')
        preconditions.push('API authentication credentials are configured')
        preconditions.push('API documentation is available for reference')
        break
      case 'search':
        preconditions.push('Searchable data exists in the system')
        preconditions.push('Search functionality is enabled')
        break
      case 'export':
        preconditions.push('Exportable data exists in the system')
        preconditions.push('Export feature is enabled and configured')
        break
      case 'validation':
        preconditions.push('Form or input fields are accessible')
        preconditions.push('Validation rules are defined and documented')
        break
      case 'workflow':
        preconditions.push('Workflow is configured and active')
        preconditions.push('User has appropriate workflow permissions')
        break
    }
  }

  // Browser/Environment preconditions
  if (lowerText.includes('browser') || lowerText.includes('navegador')) {
    preconditions.push('Supported browser is installed and updated')
  }

  return preconditions.length > 0
    ? preconditions.join('; ')
    : 'System is ready and accessible; Test environment is configured'
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

  // Check if text already contains complete Gherkin scenario
  const gherkinLines = text
    .split('\n')
    .filter(line => /^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i.test(line.trim()))

  if (gherkinLines.length >= 3) {
    // Already has complete Gherkin, just format it properly
    return gherkinLines
      .map(line => {
        const trimmed = line.trim()
        const keywordMatch = trimmed.match(
          /^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+(.+)$/i
        )
        if (keywordMatch) {
          const keyword = keywordMatch[1]
          const content = keywordMatch[2].trim()
          // Map Spanish to English
          const keywordMap = {
            Dado: 'Given',
            Cuando: 'When',
            Entonces: 'Then',
            Y: 'And',
            Pero: 'But'
          }
          const englishKeyword = keywordMap[keyword] || keyword
          return `${englishKeyword} ${capitalizeTitleCase(content)}`
        }
        return capitalizeTitleCase(trimmed)
      })
      .join('\n')
  }

  // Generate different Gherkin steps based on variation index
  if (totalVariations > 1 && variationIndex > 0) {
    return generateGherkinVariation(text, variationIndex, functionality)
  }

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

  // Generate from full text with better intelligence
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

/**
 * Generate Gherkin steps for different variations (positive, negative, edge, alternative)
 */
function generateGherkinVariation(text, variationIndex, functionality = null) {
  const lowerText = text.toLowerCase()
  const givenStep = extractIntelligentGivenStep(text) || 'The System Is In A Valid State'

  switch (variationIndex) {
    case 1: // Positive Path - comprehensive detailed steps
      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        return `Given ${givenStep}\nWhen I Navigate To The List Page And Select A Record To View\nThen I Should See All Record Details Displayed Accurately With Complete Information`
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        return `Given ${givenStep}\nWhen I Fill In All Required Fields With Valid Data And Submit The Form\nThen I Should See The New Record Created Successfully With All Entered Data Saved Correctly`
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        return `Given ${givenStep}\nWhen I Select An Existing Record And Modify The Desired Fields With New Valid Values\nThen I Should See The Record Updated Successfully With All Changes Saved And Reflected Immediately`
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        return `Given ${givenStep}\nWhen I Select The Record To Delete And Confirm The Deletion Action\nThen I Should See The Record Deleted Successfully And Removed From The System`
      }
      break

    case 2: // Negative Path - error scenarios
      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        return `Given ${givenStep}\nWhen I Attempt To View A Non-Existent Record Or Access Without Proper Permissions\nThen I Should See An Appropriate Error Message Displayed Clearly`
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        return `Given ${givenStep}\nWhen I Fill In Required Fields With Invalid Data And Attempt To Submit The Form\nThen I Should See Appropriate Validation Error Messages Displayed And The Operation Should Not Complete`
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        return `Given ${givenStep}\nWhen I Attempt To Update A Record With Invalid Or Incomplete Data\nThen I Should See Appropriate Error Messages Displayed And The System State Should Remain Unchanged`
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        return `Given ${givenStep}\nWhen I Attempt To Delete A Record That Has Dependencies Or Is Protected\nThen I Should See An Appropriate Error Message Displayed And The Record Should Not Be Deleted`
      } else {
        return `Given ${givenStep}\nWhen I Perform The Action With Invalid Input Or Without Required Permissions\nThen I Should See An Appropriate Error Message Displayed Clearly And The Operation Should Not Complete`
      }

    case 3: // Edge Case - boundary conditions
      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        return `Given ${givenStep}\nWhen I Attempt To View Records At The Boundary Limits (First, Last, Empty List)\nThen I Should See The System Handles Boundary Conditions Correctly And Maintains Stability`
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        return `Given ${givenStep}\nWhen I Enter Boundary Values (Minimum, Maximum, Edge Cases) In The Required Fields\nThen I Should See The System Processes Boundary Values Correctly And Maintains Data Integrity`
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        return `Given ${givenStep}\nWhen I Update Fields With Boundary Values (Minimum, Maximum, Special Characters)\nThen I Should See The System Handles Boundary Conditions Correctly And Updates Are Saved Properly`
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        return `Given ${givenStep}\nWhen I Attempt To Delete Records At Boundary Conditions (Last Record, Protected Record)\nThen I Should See The System Handles Boundary Conditions Correctly And Maintains System Stability`
      } else {
        return `Given ${givenStep}\nWhen I Perform The Action With Boundary Values Or Edge Case Scenarios\nThen I Should See The System Handles Boundary Conditions Correctly And Maintains Stability And Data Integrity`
      }

    case 4: // Alternative Flow
      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        return `Given ${givenStep}\nWhen I Use Alternative Navigation Methods Or Shortcuts To Access The Record View\nThen I Should See The Same Record Details Displayed Correctly Through The Alternative Approach`
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        return `Given ${givenStep}\nWhen I Use Alternative Methods Such As Import Or Bulk Create To Add New Records\nThen I Should See The Records Created Successfully Using The Alternative Approach`
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        return `Given ${givenStep}\nWhen I Use Alternative Methods Such As Inline Editing Or Bulk Update To Modify Records\nThen I Should See The Records Updated Successfully Using The Alternative Approach`
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        return `Given ${givenStep}\nWhen I Use Alternative Methods Such As Bulk Delete Or Context Menu To Remove Records\nThen I Should See The Records Deleted Successfully Using The Alternative Approach`
      } else {
        return `Given ${givenStep}\nWhen I Use Alternative Methods Or Approaches To Perform The Required Action\nThen I Should See The Alternative Approach Achieves The Same Result Successfully`
      }
  }

  // Fallback to standard generation
  return generateGherkinFromText(text)
}

function generateGherkinFromText(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return 'Given The System Is In A Valid State\nWhen The User Performs The Required Action\nThen The Expected Result Should Be Achieved'
  }

  const lowerText = text.toLowerCase()
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0)
  const steps = []

  // Try to extract Given/When/Then from the text with better patterns
  const givenMatch = text.match(
    /(?:Given|Dado|I am|I'm|user is|usuario está|system is|sistema está|on|in|at)\s+(.+?)(?:\s+When|\s+Cuando|$|\.)/i
  )
  const whenMatch = text.match(
    /(?:When|Cuando|I|user|usuario)\s+(.+?)(?:\s+Then|\s+Entonces|$|\.)/i
  )
  const thenMatch = text.match(
    /(?:Then|Entonces|should|debe|will|será|result|resultado|verify|check|confirm)\s+(.+?)(?:\.|$)/i
  )

  // Extract Given step with more context
  if (givenMatch && givenMatch[1] && givenMatch[1].trim().length > 5) {
    let givenText = givenMatch[1].trim()
    // Clean up common prefixes
    givenText = givenText.replace(/^(that|que|the|el|la|los|las)\s+/i, '').trim()
    steps.push(`Given ${capitalizeTitleCase(givenText)}`)
  } else {
    // Use intelligent extraction
    const intelligentGiven = extractIntelligentGivenStep(text)
    if (intelligentGiven) {
      steps.push(`Given ${intelligentGiven}`)
    } else {
      steps.push(`Given The System Is In A Valid State`)
    }
  }

  // Extract When step - use intelligent extraction
  if (whenMatch && whenMatch[1] && whenMatch[1].trim().length > 5) {
    let whenText = whenMatch[1].trim()
    // Clean up common prefixes
    whenText = whenText.replace(/^(that|que|the|el|la|los|las)\s+/i, '').trim()
    // Ensure it starts with "I" if it's an action
    if (!whenText.match(/^(I|The|A|An)\s+/i)) {
      whenText = `I ${whenText.charAt(0).toLowerCase() + whenText.slice(1)}`
    }
    steps.push(`When ${capitalizeTitleCase(whenText)}`)
  } else {
    // Use intelligent extraction
    const intelligentWhen = extractIntelligentWhenStep(text)
    steps.push(`When ${intelligentWhen}`)
  }

  // Extract Then step - use intelligent extraction
  if (thenMatch && thenMatch[1] && thenMatch[1].trim().length > 5) {
    let thenText = thenMatch[1].trim()
    // Clean up common prefixes
    thenText = thenText.replace(/^(that|que|the|el|la|los|las|I|should|must|will)\s+/i, '').trim()
    // Ensure it starts with "I Should" for consistency
    if (!thenText.match(/^(I|The|A|An)\s+/i)) {
      thenText = `I Should ${thenText.charAt(0).toLowerCase() + thenText.slice(1)}`
    }
    steps.push(`Then ${capitalizeTitleCase(thenText)}`)
  } else {
    // Use intelligent extraction
    const intelligentThen = extractIntelligentThenStep(text)
    steps.push(`Then ${intelligentThen}`)
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

function generateStepsFromAC(
  text,
  acType,
  variationIndex = 0,
  totalVariations = 1,
  functionality = null
) {
  if (!text || typeof text !== 'string') {
    return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
  }

  // For multiple variations, generate different steps based on variation index
  if (totalVariations > 1) {
    if (variationIndex === 0) {
      // Base case: Generate concise, basic steps (skip patterns to ensure uniqueness)
      return generateBasicSteps(text, functionality)
    } else {
      // Variations: Try patterns first, then generate detailed, specific steps for each variation type
      if (functionality) {
        const patternSteps = getPatternBasedSteps(text, functionality, 'stepByStep', variationIndex)
        if (patternSteps) {
          return patternSteps
        }
      }
      return createStepsVariation('', variationIndex, text, functionality)
    }
  }

  // Single test case: Try patterns first, then generate standard detailed steps
  if (functionality) {
    const patternSteps = getPatternBasedSteps(text, functionality, 'stepByStep', variationIndex)
    if (patternSteps) {
      return patternSteps
    }
  }

  // Single test case: Generate standard detailed steps
  const hasGherkin = /(?:Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i.test(text)

  if (hasGherkin) {
    return convertGherkinToStepByStep(text)
  } else {
    return generateDetailedStepsFromText(text, functionality)
  }
}

/**
 * Convert Gherkin format to step-by-step format with detailed steps
 */
function convertGherkinToStepByStep(gherkinText) {
  const steps = []
  const lowerText = gherkinText.toLowerCase()

  // Extract Given step with more context
  const givenMatch = gherkinText.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|\n|$)/i)
  if (givenMatch && givenMatch[1]) {
    const givenText = givenMatch[1].trim()
    // Add more specific preconditions based on context
    if (lowerText.includes('page') || lowerText.includes('screen')) {
      const pageMatch = givenText.match(
        /(?:on|in|at)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+screen)/i
      )
      if (pageMatch) {
        steps.push(`1. Navigate to the ${pageMatch[1].trim()} page`)
        steps.push(`2. Verify the page loads correctly and all elements are visible`)
      } else {
        steps.push(`1. Ensure ${givenText.charAt(0).toLowerCase() + givenText.slice(1)}`)
      }
    } else if (lowerText.includes('logged') || lowerText.includes('authenticated')) {
      steps.push(`1. Navigate to the login page`)
      steps.push(`2. Enter valid credentials (username and password)`)
      steps.push(`3. Click on the 'Login' or 'Sign In' button`)
      steps.push(`4. Verify successful login and redirect to the main page`)
    } else {
      steps.push(`1. Ensure ${givenText.charAt(0).toLowerCase() + givenText.slice(1)}`)
    }
  } else {
    steps.push('1. Navigate to the application')
    steps.push('2. Verify the application loads correctly')
  }

  // Extract When step with detailed actions
  const whenMatch = gherkinText.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|\n|$)/i)
  if (whenMatch && whenMatch[1]) {
    const whenText = whenMatch[1].trim()
    const whenLower = whenText.toLowerCase()

    // Break down complex actions into detailed steps
    if (whenLower.includes('click') || whenLower.includes('select')) {
      const elementMatch = whenText.match(
        /(?:click|select)\s+(?:on\s+)?(?:the\s+)?([a-z\s]+?)(?:\s+button|\s+link|\s+menu|\s+option|$)/i
      )
      if (elementMatch) {
        steps.push(
          `${steps.length + 1}. Locate the ${elementMatch[1].trim()} ${whenLower.includes('button') ? 'button' : whenLower.includes('link') ? 'link' : 'element'}`
        )
        steps.push(
          `${steps.length + 1}. Click on the ${elementMatch[1].trim()} ${whenLower.includes('button') ? 'button' : whenLower.includes('link') ? 'link' : 'element'}`
        )
      } else {
        steps.push(`${steps.length + 1}. ${capitalizeTitleCase(whenText)}`)
      }
    } else if (
      whenLower.includes('enter') ||
      whenLower.includes('type') ||
      whenLower.includes('fill')
    ) {
      const fieldMatch = whenText.match(
        /(?:enter|type|fill)\s+(?:the\s+)?([a-z\s]+?)(?:\s+field|\s+input|$)/i
      )
      if (fieldMatch) {
        steps.push(`${steps.length + 1}. Locate the ${fieldMatch[1].trim()} field`)
        steps.push(`${steps.length + 1}. Enter valid data in the ${fieldMatch[1].trim()} field`)
      } else {
        steps.push(`${steps.length + 1}. ${capitalizeTitleCase(whenText)}`)
      }
    } else if (whenLower.includes('submit') || whenLower.includes('save')) {
      steps.push(`${steps.length + 1}. Review all entered information`)
      steps.push(`${steps.length + 1}. Click on the 'Submit' or 'Save' button`)
    } else {
      // Convert to action format
      let actionText = whenText
      if (!actionText.match(/^(I|user|usuario)\s+/i)) {
        actionText = `I ${actionText.charAt(0).toLowerCase() + actionText.slice(1)}`
      }
      steps.push(`${steps.length + 1}. ${capitalizeTitleCase(actionText)}`)
    }
  } else {
    steps.push(`${steps.length + 1}. Perform the required action`)
  }

  // Extract Then step with detailed verification
  const thenMatch = gherkinText.match(/(?:Then|Entonces)\s+(.+?)(?:\.|\n|$)/i)
  if (thenMatch && thenMatch[1]) {
    const thenText = thenMatch[1].trim()
    const thenLower = thenText.toLowerCase()

    // Add detailed verification steps
    if (thenLower.includes('see') || thenLower.includes('display') || thenLower.includes('show')) {
      const elementMatch = thenText.match(/(?:see|display|show)\s+(?:the\s+)?([a-z\s]+?)(?:\.|$)/i)
      if (elementMatch) {
        steps.push(
          `${steps.length + 1}. Verify that the ${elementMatch[1].trim()} is displayed correctly`
        )
        steps.push(`${steps.length + 1}. Verify all expected information is present and accurate`)
      } else {
        steps.push(
          `${steps.length + 1}. Verify that ${thenText.charAt(0).toLowerCase() + thenText.slice(1)}`
        )
        steps.push(`${steps.length + 1}. Confirm the expected outcome is achieved`)
      }
    } else {
      // Convert to verification format
      let verifyText = thenText
      if (!verifyText.match(/^(I|should|must|will|verify|check|confirm)/i)) {
        verifyText = `verify that ${verifyText.charAt(0).toLowerCase() + verifyText.slice(1)}`
      }
      steps.push(`${steps.length + 1}. ${capitalizeTitleCase(verifyText)}`)
      steps.push(`${steps.length + 1}. Confirm all expected results are met`)
    }
  } else {
    steps.push(`${steps.length + 1}. Verify the expected result is achieved`)
    steps.push(`${steps.length + 1}. Confirm the operation completed successfully`)
  }

  return steps.join('\n')
}

/**
 * Create a variation of step-by-step test case
 */
/**
 * Generate basic, concise steps for the base test case (variationIndex 0)
 */
function generateBasicSteps(text, functionality = null) {
  if (!text || typeof text !== 'string') {
    return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
  }

  const lowerText = text.toLowerCase()
  const steps = []

  // Extract specific action and entity from text
  const clickMatch = text.match(
    /(?:click|select)\s+(?:on\s+)?(?:a\s+)?([a-z\s]+?)(?:\s+name|\s+button|\s+link|$)/i
  )
  const viewMatch = text.match(
    /(?:view|see|display|show)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+details|$)/i
  )
  const navigateMatch = text.match(
    /(?:navigate|go|open)\s+(?:to\s+)?(?:the\s+)?([a-z\s]+?)(?:\s+page|$)/i
  )

  // Handle click actions with specific entities (e.g., "Click on a province name")
  if (clickMatch && clickMatch[1]) {
    const entity = clickMatch[1].trim()
    steps.push(`1. Navigate to the page containing the ${entity} list`)
    steps.push(`2. Locate a ${entity} in the list`)
    steps.push(`3. Click on the ${entity} name or link`)
    steps.push(`4. Verify the ${entity} details page is displayed`)
  } else if (viewMatch && viewMatch[1]) {
    const entity = viewMatch[1].trim()
    steps.push(`1. Navigate to the ${entity} section`)
    steps.push(`2. Access the ${entity} list or view`)
    steps.push(`3. Select a ${entity} to view details`)
    steps.push(`4. Verify all ${entity} information is displayed correctly`)
  } else if (navigateMatch && navigateMatch[1]) {
    const page = navigateMatch[1].trim()
    steps.push(`1. Navigate to the ${page} page`)
    steps.push(`2. Verify the ${page} page loads correctly`)
    steps.push(`3. Interact with the main elements on the page`)
    steps.push(`4. Verify the expected functionality works as intended`)
  } else if (
    lowerText.includes('view') ||
    lowerText.includes('display') ||
    lowerText.includes('list') ||
    lowerText.includes('see')
  ) {
    steps.push('1. Open the application')
    steps.push('2. Access the list or view section')
    steps.push('3. Select a record to view')
    steps.push('4. Confirm the record information is shown')
  } else if (
    lowerText.includes('create') ||
    lowerText.includes('add') ||
    lowerText.includes('new')
  ) {
    steps.push('1. Open the create form')
    steps.push('2. Enter the required information')
    steps.push('3. Submit the form')
    steps.push('4. Confirm the record was created')
  } else if (
    lowerText.includes('update') ||
    lowerText.includes('edit') ||
    lowerText.includes('modify')
  ) {
    steps.push('1. Open the record to modify')
    steps.push('2. Change the necessary fields')
    steps.push('3. Save the changes')
    steps.push('4. Confirm the update was successful')
  } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
    steps.push('1. Open the record to remove')
    steps.push('2. Initiate the delete action')
    steps.push('3. Confirm the deletion')
    steps.push('4. Verify the record is removed')
  } else {
    // Try to extract action from text
    const actionMatch = text.match(
      /(?:I|user|usuario)\s+(?:should|will|can|must)\s+([a-z\s]+?)(?:\s+and|\s+or|$|\.)/i
    )
    if (actionMatch && actionMatch[1]) {
      const action = actionMatch[1].trim()
      steps.push(`1. Navigate to the relevant section`)
      steps.push(`2. ${action.charAt(0).toUpperCase() + action.slice(1)}`)
      steps.push(`3. Verify the action completes successfully`)
      steps.push(`4. Confirm the expected result is achieved`)
    } else {
      steps.push('1. Navigate to the application')
      steps.push('2. Perform the required action')
      steps.push('3. Verify the expected result')
    }
  }

  return steps.join('\n')
}

function createStepsVariation(baseSteps, variationIndex, acText = '', functionality = null) {
  const lowerText = acText.toLowerCase()

  switch (variationIndex) {
    case 1: // Positive path - comprehensive detailed steps
      let positiveSteps = []

      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        // Comprehensive view test case - completely different approach from base
        positiveSteps.push('1. Launch the application and authenticate if required')
        positiveSteps.push('2. Navigate to the main list or view page using the navigation menu')
        positiveSteps.push(
          '3. Verify the page loads completely with all UI elements rendered correctly'
        )
        positiveSteps.push(
          '4. Use the search or filter functionality to locate the specific record (if available)'
        )
        positiveSteps.push(
          '5. Identify the target record in the list by reviewing key identifying information'
        )
        positiveSteps.push(
          "6. Click on the record row or the dedicated 'View' button to access detailed view"
        )
        positiveSteps.push('7. Wait for the detailed view page to load completely')
        positiveSteps.push('8. Verify all record details are displayed in the detail view panel')
        positiveSteps.push(
          '9. Cross-reference each data field with expected values from the source system'
        )
        positiveSteps.push(
          '10. Verify data formatting matches the specified format (dates, numbers, text)'
        )
        positiveSteps.push('11. Verify all mandatory fields are populated and visible')
        positiveSteps.push('12. Verify optional fields display correctly when they contain data')
        positiveSteps.push(
          '13. Test all interactive navigation elements (back, edit, delete buttons)'
        )
        positiveSteps.push('14. Verify data sorting functionality works correctly if available')
        positiveSteps.push('15. Verify filtering options function as expected if applicable')
        positiveSteps.push('16. Test the responsive design by resizing the browser window')
        positiveSteps.push('17. Verify no data corruption or truncation is visible')
        positiveSteps.push(
          '18. Confirm the system maintains data integrity throughout the view operation'
        )
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        positiveSteps.push('1. Navigate to the create or add new page')
        positiveSteps.push('2. Fill in all required fields with valid data')
        positiveSteps.push('3. Verify all input fields accept the entered values')
        positiveSteps.push("4. Click on the 'Save' or 'Create' button")
        positiveSteps.push('5. Verify the new record is created successfully')
        positiveSteps.push('6. Verify the new record appears in the list/view')
        positiveSteps.push('7. Verify all entered data is saved correctly')
        positiveSteps.push('8. Verify system generates a unique identifier (if applicable)')
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        positiveSteps.push('1. Navigate to the list or view page')
        positiveSteps.push('2. Locate the record to be updated')
        positiveSteps.push("3. Click on the 'Edit' or 'Update' button")
        positiveSteps.push('4. Modify the desired fields with new valid values')
        positiveSteps.push("5. Click on the 'Save' or 'Update' button")
        positiveSteps.push('6. Verify the updated information is reflected immediately')
        positiveSteps.push('7. Verify previous values are replaced with new values')
        positiveSteps.push('8. Verify changes persist after page refresh')
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        positiveSteps.push('1. Navigate to the list or view page')
        positiveSteps.push('2. Locate the record to be deleted')
        positiveSteps.push("3. Click on the 'Delete' or 'Remove' button")
        positiveSteps.push('4. Confirm the deletion action when prompted')
        positiveSteps.push('5. Verify the record is removed from the list/view')
        positiveSteps.push('6. Verify deletion confirmation message is displayed')
        positiveSteps.push('7. Verify the record cannot be accessed after deletion')
      } else {
        // Generic positive path - enhance base steps
        positiveSteps = steps.map((step, idx) => {
          const stepLower = step.toLowerCase()
          if (stepLower.includes('verify') || stepLower.includes('check')) {
            return `${idx + 1}. ${step} with complete validation`
          }
          return step
        })
        positiveSteps.push(`${steps.length + 1}. Verify the operation completed successfully`)
        positiveSteps.push(`${steps.length + 2}. Confirm all expected outcomes are met`)
        positiveSteps.push(
          `${steps.length + 3}. Verify system state is consistent after the operation`
        )
      }

      return positiveSteps.join('\n')

    case 2: // Negative path - error scenarios with completely different steps
      const negativeSteps = []

      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        negativeSteps.push('1. Launch the application and authenticate if required')
        negativeSteps.push('2. Navigate to the list or view page')
        negativeSteps.push('3. Attempt to access a non-existent record ID or invalid URL')
        negativeSteps.push(
          '4. Verify the system displays an appropriate error message (e.g., "Record not found")'
        )
        negativeSteps.push('5. Verify the error message is clear and user-friendly')
        negativeSteps.push(
          '6. Verify the system does not crash or display technical errors to the user'
        )
        negativeSteps.push(
          '7. Verify navigation options are still available to return to a valid page'
        )
        negativeSteps.push('8. Attempt to access a record without proper permissions')
        negativeSteps.push('9. Verify the system displays an appropriate access denied message')
        negativeSteps.push(
          '10. Verify the operation was not completed and system state remains unchanged'
        )
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        negativeSteps.push('1. Navigate to the create or add new page')
        negativeSteps.push('2. Leave required fields empty or fill with invalid data')
        negativeSteps.push(
          '3. Enter invalid format data (e.g., text in numeric fields, invalid email format)'
        )
        negativeSteps.push('4. Attempt to submit the form without completing required fields')
        negativeSteps.push(
          '5. Verify validation error messages are displayed for each invalid field'
        )
        negativeSteps.push(
          '6. Verify the error messages are clear and indicate what needs to be corrected'
        )
        negativeSteps.push('7. Verify the form is not submitted and remains on the same page')
        negativeSteps.push('8. Verify no data was saved to the system')
        negativeSteps.push(
          '9. Enter data that violates business rules (e.g., duplicate unique values)'
        )
        negativeSteps.push('10. Verify appropriate business rule violation error is displayed')
        negativeSteps.push(
          '11. Verify the operation was not completed and system state remains unchanged'
        )
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        negativeSteps.push('1. Navigate to the list or view page')
        negativeSteps.push('2. Select a record that is locked or has dependencies')
        negativeSteps.push('3. Attempt to edit the record')
        negativeSteps.push('4. Verify the system displays an appropriate error message')
        negativeSteps.push('5. Attempt to update with invalid or incomplete data')
        negativeSteps.push('6. Leave required fields empty or enter invalid format data')
        negativeSteps.push('7. Attempt to save the changes')
        negativeSteps.push('8. Verify validation error messages are displayed')
        negativeSteps.push('9. Verify the changes are not saved')
        negativeSteps.push('10. Verify the original data remains unchanged')
        negativeSteps.push('11. Verify system state remains consistent')
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        negativeSteps.push('1. Navigate to the list or view page')
        negativeSteps.push('2. Select a record that has dependencies or is protected')
        negativeSteps.push('3. Attempt to delete the record')
        negativeSteps.push(
          '4. Verify the system displays an appropriate error message indicating the record cannot be deleted'
        )
        negativeSteps.push('5. Verify the error message explains why the deletion is not allowed')
        negativeSteps.push('6. Verify the record is not deleted and remains in the system')
        negativeSteps.push('7. Attempt to delete a non-existent record')
        negativeSteps.push('8. Verify the system handles the request gracefully')
        negativeSteps.push('9. Verify appropriate error message is displayed')
        negativeSteps.push('10. Verify system state remains unchanged')
      } else {
        negativeSteps.push('1. Navigate to the application')
        negativeSteps.push(
          '2. Perform the action with invalid input or without required permissions'
        )
        negativeSteps.push('3. Verify the system displays an appropriate error message')
        negativeSteps.push('4. Verify the error message is clear and actionable')
        negativeSteps.push('5. Verify the operation was not completed')
        negativeSteps.push('6. Verify system state remains unchanged')
      }

      return negativeSteps.join('\n')

    case 3: // Edge case - boundary conditions with completely different steps
      const edgeSteps = []

      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        edgeSteps.push('1. Launch the application and authenticate if required')
        edgeSteps.push('2. Navigate to the list or view page')
        edgeSteps.push('3. Test viewing the first record in the list (boundary: first item)')
        edgeSteps.push('4. Verify the first record displays correctly')
        edgeSteps.push('5. Test viewing the last record in the list (boundary: last item)')
        edgeSteps.push('6. Verify the last record displays correctly')
        edgeSteps.push('7. Test viewing when the list is empty (boundary: no items)')
        edgeSteps.push('8. Verify appropriate empty state message is displayed')
        edgeSteps.push(
          '9. Test viewing with maximum number of records displayed (boundary: max items)'
        )
        edgeSteps.push('10. Verify pagination or scrolling works correctly')
        edgeSteps.push(
          '11. Test viewing records with very long text fields (boundary: max text length)'
        )
        edgeSteps.push('12. Verify text truncation or wrapping is handled correctly')
        edgeSteps.push(
          '13. Verify system maintains stability and performance at boundary conditions'
        )
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        edgeSteps.push('1. Navigate to the create or add new page')
        edgeSteps.push('2. Test with minimum allowed values (boundary: minimum)')
        edgeSteps.push('3. Enter the minimum valid value in each numeric field')
        edgeSteps.push('4. Enter the minimum valid length in text fields')
        edgeSteps.push('5. Submit the form and verify it processes correctly')
        edgeSteps.push('6. Test with maximum allowed values (boundary: maximum)')
        edgeSteps.push('7. Enter the maximum valid value in each numeric field')
        edgeSteps.push('8. Enter the maximum valid length in text fields')
        edgeSteps.push('9. Submit the form and verify it processes correctly')
        edgeSteps.push('10. Test with special characters and edge case formats')
        edgeSteps.push('11. Verify the system handles boundary values correctly')
        edgeSteps.push('12. Verify data integrity is maintained at boundary conditions')
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        edgeSteps.push('1. Navigate to the list or view page')
        edgeSteps.push('2. Select a record to edit')
        edgeSteps.push('3. Test updating with minimum boundary values')
        edgeSteps.push('4. Change fields to minimum allowed values')
        edgeSteps.push('5. Save and verify the update is successful')
        edgeSteps.push('6. Test updating with maximum boundary values')
        edgeSteps.push('7. Change fields to maximum allowed values')
        edgeSteps.push('8. Save and verify the update is successful')
        edgeSteps.push('9. Test updating with special characters and edge case formats')
        edgeSteps.push('10. Verify the system handles boundary values correctly')
        edgeSteps.push('11. Verify data integrity is maintained at boundary conditions')
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        edgeSteps.push('1. Navigate to the list or view page')
        edgeSteps.push('2. Test deleting the first record in the list (boundary: first item)')
        edgeSteps.push('3. Verify the deletion is successful')
        edgeSteps.push('4. Test deleting the last record in the list (boundary: last item)')
        edgeSteps.push('5. Verify the deletion is successful')
        edgeSteps.push('6. Test deleting when only one record exists (boundary: single item)')
        edgeSteps.push('7. Verify appropriate empty state is displayed after deletion')
        edgeSteps.push('8. Test deleting records at pagination boundaries')
        edgeSteps.push('9. Verify pagination updates correctly after deletion')
        edgeSteps.push('10. Verify system maintains stability at boundary conditions')
      } else {
        edgeSteps.push('1. Navigate to the application')
        edgeSteps.push('2. Test the action with minimum boundary values')
        edgeSteps.push('3. Test the action with maximum boundary values')
        edgeSteps.push('4. Test the action with edge case scenarios')
        edgeSteps.push('5. Verify the system handles boundary conditions correctly')
        edgeSteps.push('6. Verify system maintains stability and data integrity')
      }

      return edgeSteps.join('\n')

    case 4: // Alternative flow - completely different approach
      const altSteps = []

      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list') ||
        lowerText.includes('see')
      ) {
        altSteps.push('1. Launch the application and authenticate if required')
        altSteps.push(
          '2. Use keyboard shortcuts or alternative navigation to access the record view'
        )
        altSteps.push('3. Alternatively, use the search functionality to find and view the record')
        altSteps.push('4. Alternatively, access the record through a direct URL or bookmark')
        altSteps.push(
          '5. Verify the record details are displayed correctly through the alternative method'
        )
        altSteps.push('6. Verify all expected information is present regardless of access method')
        altSteps.push('7. Test accessing through mobile responsive view if applicable')
        altSteps.push(
          '8. Verify the alternative approach achieves the same result as the standard method'
        )
      } else if (
        lowerText.includes('create') ||
        lowerText.includes('add') ||
        lowerText.includes('new')
      ) {
        altSteps.push('1. Navigate to the application')
        altSteps.push('2. Use alternative methods such as import functionality or bulk create')
        altSteps.push('3. Alternatively, use API or data import tools if available')
        altSteps.push(
          '4. Alternatively, use copy/duplicate functionality to create similar records'
        )
        altSteps.push('5. Verify the records are created successfully using the alternative method')
        altSteps.push('6. Verify all data is saved correctly regardless of creation method')
        altSteps.push(
          '7. Verify the alternative approach achieves the same result as standard creation'
        )
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('edit') ||
        lowerText.includes('modify')
      ) {
        altSteps.push('1. Navigate to the list or view page')
        altSteps.push('2. Use inline editing functionality if available')
        altSteps.push('3. Alternatively, use bulk update or mass edit features')
        altSteps.push('4. Alternatively, use keyboard shortcuts for quick edits')
        altSteps.push('5. Verify the updates are saved successfully using the alternative method')
        altSteps.push('6. Verify all changes are reflected correctly')
        altSteps.push(
          '7. Verify the alternative approach achieves the same result as standard editing'
        )
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        altSteps.push('1. Navigate to the list or view page')
        altSteps.push('2. Use bulk delete or multi-select functionality if available')
        altSteps.push('3. Alternatively, use context menu or right-click options to delete')
        altSteps.push('4. Alternatively, use keyboard shortcuts for deletion')
        altSteps.push('5. Verify the records are deleted successfully using the alternative method')
        altSteps.push('6. Verify deletion confirmation works correctly')
        altSteps.push(
          '7. Verify the alternative approach achieves the same result as standard deletion'
        )
      } else {
        altSteps.push('1. Navigate to the application')
        altSteps.push('2. Use alternative methods or approaches to perform the required action')
        altSteps.push('3. Verify the alternative approach is available and functional')
        altSteps.push('4. Verify the action completes successfully using the alternative method')
        altSteps.push(
          '5. Verify the alternative approach achieves the same result as the standard method'
        )
      }

      return altSteps.join('\n')

    default:
      return baseSteps
  }
}

/**
 * Generate detailed step-by-step from text analysis
 */
function generateDetailedStepsFromText(text, functionality = null) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result'
  }

  const lowerText = text.toLowerCase()
  const steps = []
  let stepNumber = 1

  // Extract page/context
  const pageMatch = text.match(
    /(?:on|in|at)\s+(?:the\s+)?([a-z\s]+?)(?:\s+page|\s+screen|\s+view)/i
  )
  if (pageMatch) {
    steps.push(`${stepNumber++}. Navigate to the ${pageMatch[1].trim()} page`)
    steps.push(`${stepNumber++}. Verify the page loads correctly and all UI elements are visible`)
  } else if (lowerText.includes('login') || lowerText.includes('authenticate')) {
    steps.push(`${stepNumber++}. Navigate to the login page`)
    steps.push(
      `${stepNumber++}. Verify the login form is displayed with username and password fields`
    )
  } else {
    steps.push(`${stepNumber++}. Navigate to the application`)
    steps.push(`${stepNumber++}. Verify the application loads correctly`)
  }

  // Extract actions with more detail
  const actionPatterns = [
    {
      pattern:
        /(?:click|select)\s+(?:on\s+)?(?:the\s+)?([a-z\s]+?)(?:\s+button|\s+link|\s+menu|\s+option|$)/i,
      generate: match => {
        const element = match[1].trim()
        const elementType = lowerText.includes('button')
          ? 'button'
          : lowerText.includes('link')
            ? 'link'
            : 'element'
        steps.push(`${stepNumber++}. Locate the ${element} ${elementType}`)
        steps.push(`${stepNumber++}. Click on the ${element} ${elementType}`)
        steps.push(`${stepNumber++}. Verify the action is triggered correctly`)
      }
    },
    {
      pattern: /(?:enter|type|fill|input)\s+(?:the\s+)?([a-z\s]+?)(?:\s+field|\s+input|$)/i,
      generate: match => {
        const field = match[1].trim()
        steps.push(`${stepNumber++}. Locate the ${field} field`)
        steps.push(`${stepNumber++}. Enter valid data in the ${field} field`)
        steps.push(`${stepNumber++}. Verify the data is entered correctly`)
      }
    },
    {
      pattern: /(?:create|add|new)\s+(?:a\s+)?([a-z\s]+?)(?:$|\.)/i,
      generate: match => {
        const item = match[1].trim()
        steps.push(`${stepNumber++}. Navigate to the ${item} creation page`)
        steps.push(`${stepNumber++}. Fill in all required fields with valid data`)
        steps.push(`${stepNumber++}. Click on the 'Create' or 'Save' button`)
      }
    },
    {
      pattern: /(?:update|edit|modify)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.)/i,
      generate: match => {
        const item = match[1].trim()
        steps.push(`${stepNumber++}. Navigate to the ${item} list or detail page`)
        steps.push(`${stepNumber++}. Select an existing ${item} to edit`)
        steps.push(`${stepNumber++}. Modify the desired fields`)
        steps.push(`${stepNumber++}. Click on the 'Update' or 'Save' button`)
      }
    },
    {
      pattern: /(?:delete|remove)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.)/i,
      generate: match => {
        const item = match[1].trim()
        steps.push(`${stepNumber++}. Navigate to the ${item} list or detail page`)
        steps.push(`${stepNumber++}. Select the ${item} to delete`)
        steps.push(`${stepNumber++}. Click on the 'Delete' button`)
        steps.push(`${stepNumber++}. Confirm the deletion in the confirmation dialog`)
      }
    },
    {
      pattern: /(?:search|find|filter)\s+(?:for\s+)?([a-z\s]+?)(?:$|\.)/i,
      generate: match => {
        const query = match[1].trim()
        steps.push(`${stepNumber++}. Locate the search or filter field`)
        steps.push(`${stepNumber++}. Enter search criteria: ${query}`)
        steps.push(`${stepNumber++}. Click on the 'Search' button or press Enter`)
      }
    },
    {
      pattern: /(?:submit|save)\s+(?:the\s+)?([a-z\s]+?)(?:\s+form|$)/i,
      generate: match => {
        steps.push(`${stepNumber++}. Review all entered information`)
        steps.push(`${stepNumber++}. Verify all required fields are filled`)
        steps.push(`${stepNumber++}. Click on the 'Submit' or 'Save' button`)
      }
    }
  ]

  let actionFound = false
  for (const { pattern, generate } of actionPatterns) {
    const match = text.match(pattern)
    if (match) {
      generate(match)
      actionFound = true
      break
    }
  }

  if (!actionFound) {
    // Extract from sentences
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5)
    if (sentences.length > 0) {
      sentences.forEach(sentence => {
        const cleanSentence = sentence
          .trim()
          .replace(/^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i, '')
          .trim()
        if (cleanSentence && !cleanSentence.match(/^(I|user|usuario)\s+(?:am|is|are)/i)) {
          steps.push(
            `${stepNumber++}. ${cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1)}`
          )
        }
      })
    } else {
      steps.push(`${stepNumber++}. Perform the required action`)
    }
  }

  // Add verification steps
  if (lowerText.includes('should') || lowerText.includes('must') || lowerText.includes('verify')) {
    const expectedMatch = text.match(/(?:should|must|will|verify|check|confirm)\s+(.+?)(?:\.|$)/i)
    if (expectedMatch) {
      steps.push(`${stepNumber++}. Verify that ${expectedMatch[1].trim().toLowerCase()}`)
    } else {
      steps.push(`${stepNumber++}. Verify the expected result is achieved`)
    }
    steps.push(`${stepNumber++}. Confirm all expected outcomes are met`)
  } else {
    steps.push(`${stepNumber++}. Verify the operation completed successfully`)
    steps.push(`${stepNumber++}. Confirm the expected result is displayed`)
  }

  return steps.join('\n')
}

function generateStepsFromText(text) {
  return generateDetailedStepsFromText(text)
}

function generateExpectedResult(
  text,
  source,
  functionality = null,
  thenMatch = null,
  title = null,
  steps = null,
  variationIndex = 0,
  totalVariations = 1
) {
  if (!text || typeof text !== 'string') {
    // Final fallback: Use context-based generation
    const contextResult = generateContextBasedExpectedResult(text)
    if (
      contextResult &&
      contextResult !== 'The Expected Outcome Should Be Achieved And Verified Successfully'
    ) {
      return contextResult
    }

    // Last resort: Generate from text analysis
    if (lowerText.includes('page') || lowerText.includes('view') || lowerText.includes('display')) {
      return 'The page or view is displayed correctly with all expected elements and information.'
    }
    if (lowerText.includes('click') || lowerText.includes('select')) {
      return 'The selected action is performed successfully and the expected result is displayed.'
    }
    if (lowerText.includes('navigate') || lowerText.includes('go to')) {
      return 'Navigation is successful and the target page is displayed correctly.'
    }

    return 'The operation completes successfully and the expected behavior is verified.'
  }

  // Generate different expected results based on variation
  const lowerText = text.toLowerCase()

  // For multiple variations, generate specific expected results
  if (totalVariations > 1) {
    if (variationIndex === 0) {
      // Base case: Simple, concise expected result
      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list')
      ) {
        return 'Record details are displayed correctly'
      } else if (lowerText.includes('create') || lowerText.includes('add')) {
        return 'Record is created successfully'
      } else if (lowerText.includes('update') || lowerText.includes('edit')) {
        return 'Record is updated successfully'
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        return 'Record is deleted successfully'
      }
    } else if (variationIndex === 1) {
      // Positive path: Comprehensive expected result
      if (
        lowerText.includes('view') ||
        lowerText.includes('display') ||
        lowerText.includes('list')
      ) {
        return 'All record details are displayed accurately with complete information. All data fields are visible, properly formatted, and match expected values. Navigation and interaction elements function correctly, and the system maintains data integrity.'
      } else if (lowerText.includes('create') || lowerText.includes('add')) {
        return 'New record is created successfully with all entered data saved correctly. The record appears in the list/view with accurate information. System generates appropriate identifiers and maintains data consistency.'
      } else if (lowerText.includes('update') || lowerText.includes('edit')) {
        return 'Record is updated successfully with all changes saved and reflected immediately. Previous values are replaced with new values, and changes persist after page refresh. System maintains data integrity and updates related records if applicable.'
      } else if (lowerText.includes('delete') || lowerText.includes('remove')) {
        return 'Record is deleted successfully and removed from the system. Deletion confirmation is displayed, and the record cannot be accessed after deletion. Related records or dependencies are handled correctly.'
      }
    } else if (variationIndex === 2) {
      // Negative path: Error handling expected result
      return 'Appropriate error message is displayed clearly. The operation is not completed, and system state remains unchanged. User can correct the input and retry the operation.'
    } else if (variationIndex === 3) {
      // Edge case: Boundary handling expected result
      return 'System handles boundary conditions correctly. Both minimum and maximum boundary values are processed appropriately, and the system maintains stability and data integrity.'
    }
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
  const combinedLowerText = combinedText.toLowerCase()

  // Priority 1: Use extracted "Then" match if available
  if (thenMatch && thenMatch[1]) {
    let thenText = thenMatch[1].trim()
    if (thenText.length > 5) {
      // Clean up common prefixes and make it readable
      thenText = thenText.replace(/^(I|should|must|will|debe|será)\s+/i, '').trim()
      // Capitalize first letter and ensure it's a complete sentence
      thenText = thenText.charAt(0).toUpperCase() + thenText.slice(1)
      // Ensure it ends with proper punctuation if it's a sentence
      if (!thenText.match(/[.!?]$/)) {
        thenText = thenText + '.'
      }
      return thenText
    }
  }

  // Priority 2: Extract from explicit "Then" statements in text
  if (source === 'expected' || lowerText.startsWith('then') || lowerText.includes('then')) {
    const thenPattern = text.match(/(?:Then|Entonces)[:\s]+(.+?)(?:\.|$|When|Given)/i)
    if (thenPattern && thenPattern[1] && thenPattern[1].trim().length > 5) {
      return thenPattern[1].trim().charAt(0).toUpperCase() + thenPattern[1].trim().slice(1)
    }
  }

  // Priority 3: Extract from "should" or "debe" statements with better context
  // Handle patterns like "I should be taken to", "should see", "should display"
  const shouldMatch = text.match(
    /(?:I\s+)?(?:should|debe|must|will)\s+(?:be\s+)?(?:taken\s+to|see|view|display|show|receive|get)\s+(.+?)(?:\.|$|and|or|,|showing)/i
  )
  if (shouldMatch && shouldMatch[1]) {
    let resultText = shouldMatch[1].trim()
    // Remove trailing commas and clean up
    resultText = resultText.replace(/,\s*$/, '').trim()
    // Remove "showing" or similar trailing words if they're incomplete
    resultText = resultText.replace(/\s+(showing|with|containing)\s*$/, '').trim()
    if (resultText.length > 5) {
      // Capitalize first letter
      resultText = resultText.charAt(0).toUpperCase() + resultText.slice(1)
      // Ensure it ends with proper punctuation
      if (!resultText.match(/[.!?]$/)) {
        resultText = resultText + '.'
      }
      return resultText
    }
  }

  // Also try simpler "should" pattern
  const simpleShouldMatch = text.match(/(?:should|debe|must|will)\s+(.+?)(?:\.|$|and|or|,)/i)
  if (simpleShouldMatch && simpleShouldMatch[1]) {
    let resultText = simpleShouldMatch[1].trim()
    // Skip if it's too generic
    if (!resultText.match(/^(be|see|view|display|show|get|receive)$/i) && resultText.length > 5) {
      resultText = resultText.replace(/,\s*$/, '').trim()
      resultText = resultText.charAt(0).toUpperCase() + resultText.slice(1)
      if (!resultText.match(/[.!?]$/)) {
        resultText = resultText + '.'
      }
      return resultText
    }
  }

  // Priority 4: Extract from "expected" or "esperado" statements
  const expectedMatch = text.match(/(?:expected|esperado|result)[:\s]+(.+?)(?:\.|$)/i)
  if (expectedMatch && expectedMatch[1] && expectedMatch[1].trim().length > 5) {
    return expectedMatch[1].trim().charAt(0).toUpperCase() + expectedMatch[1].trim().slice(1)
  }

  // Priority 5: Extract from click/navigate actions with specific entities
  const clickEntityMatch = text.match(
    /(?:click|select)\s+(?:on\s+)?(?:a\s+)?([a-z\s]+?)(?:\s+name|\s+button|\s+link|$)/i
  )
  if (clickEntityMatch && clickEntityMatch[1]) {
    const entity = clickEntityMatch[1].trim()
    // Try to find what should happen after clicking
    const resultMatch = text.match(/(?:should|will|must|then)\s+(.+?)(?:\.|$|and|or)/i)
    if (resultMatch && resultMatch[1]) {
      let resultText = resultMatch[1].trim()
      resultText = resultText.replace(/^(I|be|see|view|display)\s+/i, '').trim()
      if (resultText.length > 5) {
        return resultText.charAt(0).toUpperCase() + resultText.slice(1) + '.'
      }
    }
    // Default for click actions
    return `The ${entity} details page is displayed with all relevant information.`
  }

  // Priority 6: Functionality-specific expected results with more context
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
          return 'Error message is displayed indicating invalid credentials.'
        }
        if (funcText.includes('logout') || funcText.includes('sign out')) {
          return 'User is successfully logged out and redirected to login page.'
        }
        return 'User is successfully authenticated and redirected to the appropriate page.'

      case 'crud':
        if (funcText.includes('create') || funcText.includes('add') || funcText.includes('new')) {
          return 'New record is successfully created and visible in the list.'
        }
        if (
          funcText.includes('read') ||
          funcText.includes('view') ||
          funcText.includes('display')
        ) {
          return 'Record details are correctly displayed with all information.'
        }
        if (
          funcText.includes('update') ||
          funcText.includes('edit') ||
          funcText.includes('modify')
        ) {
          return 'Record is successfully updated with the new information.'
        }
        if (funcText.includes('delete') || funcText.includes('remove')) {
          return 'Record is successfully deleted and removed from the system.'
        }
        return 'CRUD operation completes successfully.'

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

  // Final fallback: Use context-based generation
  const contextResult = generateContextBasedExpectedResult(text)
  if (
    contextResult &&
    contextResult !== 'The Expected Outcome Should Be Achieved And Verified Successfully'
  ) {
    return contextResult
  }

  // Last resort: Generate from text analysis
  if (lowerText.includes('page') || lowerText.includes('view') || lowerText.includes('display')) {
    return 'The page or view is displayed correctly with all expected elements and information.'
  }
  if (lowerText.includes('click') || lowerText.includes('select')) {
    return 'The selected action is performed successfully and the expected result is displayed.'
  }
  if (lowerText.includes('navigate') || lowerText.includes('go to')) {
    return 'Navigation is successful and the target page is displayed correctly.'
  }

  return 'The operation completes successfully and the expected behavior is verified.'
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
            return `Given ${capitalizeTitleCase(gherkin.given)}\nWhen ${capitalizeTitleCase(gherkin.when)}\nThen ${capitalizeTitleCase(gherkin.then)}`
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
            return `Given ${capitalizeTitleCase(gherkin.given)}\nWhen ${capitalizeTitleCase(gherkin.when)}\nThen ${capitalizeTitleCase(gherkin.then)}`
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
    return `Given ${capitalizeTitleCase(gherkin.given)}\nWhen ${capitalizeTitleCase(gherkin.when)}\nThen ${capitalizeTitleCase(gherkin.then)}`
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

/**
 * Intelligently extract a clean title from project information
 * Removes common prefixes, limits length, and creates a professional title
 * Uses AI when available for better titles
 */
export async function extractIntelligentTitle(
  projectInfo,
  planType = 'comprehensive',
  useAI = false
) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return 'Test Plan'
  }

  const lines = projectInfo.split('\n').filter(line => line.trim().length > 0)
  let title = ''

  // Try to find a meaningful title from the first few lines
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim()

    // Skip common prefixes and metadata
    const skipPatterns = [
      /^(project|proyecto|sistema|system|aplicación|application|app|feature|funcionalidad|requirement|requisito|user story|historia de usuario|ac|acceptance criteria|criterio de aceptación)[:-\s]+/i,
      /^(title|título|name|nombre)[:-\s]+/i,
      /^#+\s+/,
      /^-\s+/,
      /^\d+\.\s+/
    ]

    let cleanLine = line
    for (const pattern of skipPatterns) {
      cleanLine = cleanLine.replace(pattern, '').trim()
    }

    // Look for lines that seem like titles (not too long, not too short, starts with capital)
    if (cleanLine.length >= 10 && cleanLine.length <= 80 && /^[A-ZÁÉÍÓÚÑ]/.test(cleanLine)) {
      title = cleanLine
      break
    }
  }

  // If no good title found, extract from first line
  if (!title && lines.length > 0) {
    let firstLine = lines[0].trim()

    // Remove common prefixes
    firstLine = firstLine.replace(
      /^(project|proyecto|sistema|system|aplicación|application|app|feature|funcionalidad)[:-\s]+/i,
      ''
    )
    firstLine = firstLine.replace(/^#+\s+/, '')
    firstLine = firstLine.replace(/^-\s+/, '')
    firstLine = firstLine.replace(/^\d+\.\s+/, '')

    // Limit length and clean up
    title = firstLine.substring(0, 60).trim()

    // If title ends with incomplete word, remove last word
    if (
      title.length === 60 &&
      !title.endsWith('.') &&
      !title.endsWith('!') &&
      !title.endsWith('?')
    ) {
      const lastSpace = title.lastIndexOf(' ')
      if (lastSpace > 30) {
        title = title.substring(0, lastSpace)
      }
    }
  }

  // If still no title, generate from detected functionalities
  if (!title || title.length < 5) {
    const analysis = analyzeProjectInfo(projectInfo)
    if (analysis && analysis.detectedFunctionalities.length > 0) {
      const funcs = analysis.detectedFunctionalities
        .slice(0, 2)
        .map(f => f.type.charAt(0).toUpperCase() + f.type.slice(1))
        .join(' & ')
      title = `${funcs} Testing`
    } else {
      title = 'Test Plan'
    }
  }

  // Capitalize first letter if needed
  title = title.charAt(0).toUpperCase() + title.slice(1)

  return title
}

/**
 * Intelligently generate a clean test item name from text
 * Creates professional, concise names instead of copying raw text
 */
export function generateIntelligentItemName(text, planType = 'comprehensive', index = 0) {
  if (!text || text.trim().length === 0) {
    return `Test Item ${index + 1}`
  }

  const cleanText = text.trim()
  const lowerText = cleanText.toLowerCase()

  // Remove common prefixes
  let name = cleanText
    .replace(/^(given|when|then|dado|cuando|entonces)[:-\s]+/i, '')
    .replace(/^(as a|como|user|usuario|i want|quiero|so that|para que)[:-\s]+/i, '')
    .replace(/^(ac|acceptance criteria|criterio de aceptación|requirement|requisito)[:-\s]+/i, '')
    .replace(/^#+\s+/, '')
    .replace(/^-\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .trim()

  // Extract key action or functionality
  const actionPatterns = [
    /(?:should|debe|must|debe|can|puede)\s+(?:be able to|poder)?\s*([^.!?]+)/i,
    /(?:verify|validar|test|probar|check|verificar)\s+([^.!?]+)/i,
    /(?:user|usuario)\s+(?:can|puede|should|debe)\s+([^.!?]+)/i,
    /(?:when|cuando)\s+([^.!?]+)/i,
    /(?:then|entonces)\s+([^.!?]+)/i
  ]

  for (const pattern of actionPatterns) {
    const match = name.match(pattern)
    if (match && match[1]) {
      name = match[1].trim()
      break
    }
  }

  // Detect functionality type and create appropriate name
  const analysis = analyzeProjectInfo(cleanText)
  if (analysis && analysis.detectedFunctionalities.length > 0) {
    const func = analysis.detectedFunctionalities[0]
    const funcName = func.type.charAt(0).toUpperCase() + func.type.slice(1)

    // Create name based on functionality
    if (func.type === 'authentication') {
      if (lowerText.includes('login') || lowerText.includes('iniciar sesión')) {
        name = 'User Authentication'
      } else if (lowerText.includes('logout') || lowerText.includes('cerrar sesión')) {
        name = 'User Logout'
      } else if (lowerText.includes('password') || lowerText.includes('contraseña')) {
        name = 'Password Management'
      } else {
        name = 'Authentication Flow'
      }
    } else if (func.type === 'crud') {
      if (
        lowerText.includes('create') ||
        lowerText.includes('crear') ||
        lowerText.includes('add') ||
        lowerText.includes('agregar')
      ) {
        name = 'Create Record'
      } else if (
        lowerText.includes('read') ||
        lowerText.includes('leer') ||
        lowerText.includes('view') ||
        lowerText.includes('ver')
      ) {
        name = 'View Records'
      } else if (
        lowerText.includes('update') ||
        lowerText.includes('actualizar') ||
        lowerText.includes('edit') ||
        lowerText.includes('editar')
      ) {
        name = 'Update Record'
      } else if (
        lowerText.includes('delete') ||
        lowerText.includes('eliminar') ||
        lowerText.includes('remove') ||
        lowerText.includes('remover')
      ) {
        name = 'Delete Record'
      } else {
        name = 'CRUD Operations'
      }
    } else if (func.type === 'validation') {
      name = 'Input Validation'
    } else if (func.type === 'payment') {
      name = 'Payment Processing'
    } else if (func.type === 'search') {
      name = 'Search Functionality'
    } else if (func.type === 'export') {
      name = 'Data Export'
    } else if (func.type === 'fileUpload') {
      name = 'File Upload'
    } else if (func.type === 'api') {
      name = 'API Integration'
    } else if (func.type === 'workflow') {
      name = 'Workflow Management'
    } else {
      name = `${funcName} Testing`
    }
  } else {
    // If no functionality detected, extract key words
    const words = name.split(/\s+/).filter(w => w.length > 3)
    if (words.length > 0) {
      // Take first 3-5 meaningful words
      name = words.slice(0, Math.min(5, words.length)).join(' ')
    }
  }

  // Clean up and limit length
  name = name.replace(/\s+/g, ' ').trim().substring(0, 60)

  // Remove trailing incomplete words if needed
  if (name.length === 60 && !name.endsWith('.') && !name.endsWith('!') && !name.endsWith('?')) {
    const lastSpace = name.lastIndexOf(' ')
    if (lastSpace > 20) {
      name = name.substring(0, lastSpace)
    }
  }

  // Capitalize first letter
  name = name.charAt(0).toUpperCase() + name.slice(1)

  // Add plan type prefix if needed
  const typePrefixes = {
    performance: 'Performance',
    security: 'Security',
    integration: 'Integration',
    shiftLeft: 'Shift-Left',
    shiftRight: 'Shift-Right',
    continuous: 'Continuous',
    tdd: 'TDD',
    bdd: 'BDD',
    apiFirst: 'API',
    devops: 'DevOps'
  }

  if (
    typePrefixes[planType] &&
    !name.toLowerCase().startsWith(typePrefixes[planType].toLowerCase())
  ) {
    name = `${typePrefixes[planType]}: ${name}`
  }

  return name || `Test Item ${index + 1}`
}
