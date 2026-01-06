import { generateIntelligentTestCases, analyzeProjectInfo } from './intelligentAnalyzer'
import {
  generateTestCasesWithAI,
  checkOllamaAvailability,
  AI_PROVIDERS
} from '../services/aiService'

let useAI = false
let aiProvider = AI_PROVIDERS.ONLINE

/**
 * Configure AI usage
 * @param {boolean} enabled - Enable/disable AI
 * @param {string} provider - 'local' or 'online'
 */
export function configureAI(enabled = false, provider = AI_PROVIDERS.ONLINE) {
  useAI = enabled
  aiProvider = provider
}

/**
 * Generate test cases with optional AI enhancement
 * @param {string} projectInfo - Project information or acceptance criteria
 * @param {string} format - 'stepByStep' or 'gherkin'
 * @param {string} language - 'en' or 'es'
 * @param {boolean} useAIEnhancement - Enable AI enhancement
 * @param {number} testsPerAC - Number of test cases to generate per acceptance criteria (1-5)
 */
export async function generateTestCases(
  projectInfo,
  format = 'stepByStep',
  language = 'en',
  useAIEnhancement = false,
  testsPerAC = 1
) {
  if (!projectInfo || projectInfo.trim().length === 0) {
    return []
  }

  // Validate testsPerAC
  const validTestsPerAC = Math.max(1, Math.min(5, parseInt(testsPerAC) || 1))

  // Try AI generation if enabled
  if (useAIEnhancement && useAI) {
    try {
      const aiTestCases = await generateTestCasesWithAI(projectInfo, format, language)
      if (aiTestCases && aiTestCases.length > 0) {
        // If AI generated test cases, we can't control testsPerAC easily
        // So we return as-is or duplicate if needed
        return aiTestCases
      }
    } catch (error) {
      console.warn('AI generation failed, falling back to intelligent analyzer:', error)
      // Fall through to intelligent analyzer
    }
  }

  // Use intelligent analyzer for better test case generation
  const analysis = analyzeProjectInfo(projectInfo)
  const testCases = generateIntelligentTestCases(projectInfo, format, analysis, validTestsPerAC)

  return testCases
}

export { checkOllamaAvailability, AI_PROVIDERS }

function extractTitle(text) {
  if (text.startsWith('AC:') || text.startsWith('AC ')) {
    return text.replace(/^AC:?\s*/i, '').trim()
  }
  if (text.startsWith('Given') || text.startsWith('When') || text.startsWith('Then')) {
    return text.substring(0, 50) + (text.length > 50 ? '...' : '')
  }
  return text.substring(0, 100) + (text.length > 100 ? '...' : '')
}

function extractPriority(text) {
  const priorityKeywords = {
    high: ['critical', 'urgent', 'must', 'blocker', 'crítico', 'urgente', 'debe'],
    low: ['nice to have', 'optional', 'opcional', 'deseable']
  }

  const lowerText = text.toLowerCase()

  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return priority === 'high' ? 'High' : 'Low'
    }
  }

  return 'Medium'
}

function extractPreconditions(text) {
  const preconditions = []

  if (text.toLowerCase().includes('user') || text.toLowerCase().includes('usuario')) {
    preconditions.push('User is logged in')
  }

  if (text.toLowerCase().includes('data') || text.toLowerCase().includes('datos')) {
    preconditions.push('Test data is available')
  }

  return preconditions.length > 0 ? preconditions.join('; ') : 'System is ready'
}

function extractExpectedResult(text) {
  if (text.toLowerCase().includes('should') || text.toLowerCase().includes('debe')) {
    const match = text.match(/(should|debe)\s+(.+?)(?:\.|$)/i)
    if (match) {
      return match[2].trim()
    }
  }

  if (text.toLowerCase().includes('verify') || text.toLowerCase().includes('verificar')) {
    return 'Expected behavior is verified'
  }

  return 'Operation completes successfully'
}

function generateGherkinSteps(text) {
  const steps = []
  const lowerText = text.toLowerCase()

  if (lowerText.includes('given') || lowerText.includes('dado')) {
    const givenMatch = text.match(/(?:Given|Dado)\s+(.+?)(?:\s+When|\s+Cuando|$)/i)
    if (givenMatch) {
      steps.push(`Given ${capitalizeTitleCase(givenMatch[1].trim())}`)
    }
  } else {
    steps.push(`Given The System Is In A Valid State`)
  }

  if (lowerText.includes('when') || lowerText.includes('cuando')) {
    const whenMatch = text.match(/(?:When|Cuando)\s+(.+?)(?:\s+Then|\s+Entonces|$)/i)
    if (whenMatch) {
      steps.push(`When ${capitalizeTitleCase(whenMatch[1].trim())}`)
    } else {
      const actionMatch = text.match(/(?:user|usuario)\s+(.+?)(?:\.|$)/i)
      if (actionMatch) {
        steps.push(`When ${capitalizeTitleCase(actionMatch[1].trim())}`)
      } else {
        steps.push(`When The User Performs An Action`)
      }
    }
  } else {
    steps.push(`When The User Performs The Required Action`)
  }

  if (lowerText.includes('then') || lowerText.includes('entonces')) {
    const thenMatch = text.match(/(?:Then|Entonces)\s+(.+?)(?:\.|$)/i)
    if (thenMatch) {
      steps.push(`Then ${capitalizeTitleCase(thenMatch[1].trim())}`)
    } else {
      steps.push(`Then The Expected Result Should Be Achieved`)
    }
  } else {
    steps.push(`Then The Expected Result Should Be Achieved`)
  }

  return steps.join('\n')
}

function generateStepByStep(text) {
  const steps = []
  const sentences = text.split(/[.!?]\s+/).filter(s => s.trim().length > 0)

  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim()
    if (trimmed.length > 0) {
      steps.push(`${index + 1}. ${trimmed}`)
    }
  })

  if (steps.length === 0) {
    steps.push('1. Navigate to the application')
    steps.push('2. Perform the required action')
    steps.push('3. Verify the expected result')
  }

  return steps.join('\n')
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
    expectedResult: 'Operation completes successfully'
  }
}

function capitalizeTitleCase(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
