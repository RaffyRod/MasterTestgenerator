/**
 * AI Service for Test Plan and Test Case Generation
 * Supports both local (Ollama) and online (Hugging Face) AI models
 */

const AI_PROVIDERS = {
  LOCAL: 'local',
  ONLINE: 'online'
}

let currentProvider = AI_PROVIDERS.ONLINE // Default to online
let ollamaBaseUrl = 'http://localhost:11434' // Default Ollama URL

/**
 * Initialize AI service
 * @param {string} provider - 'local' or 'online'
 * @param {string} ollamaUrl - Ollama server URL (default: http://localhost:11434)
 */
export function initAIService(
  provider = AI_PROVIDERS.ONLINE,
  ollamaUrl = 'http://localhost:11434'
) {
  currentProvider = provider
  ollamaBaseUrl = ollamaUrl
}

/**
 * Check if Ollama is available locally
 * @param {string} customUrl - Optional custom Ollama URL
 */
export async function checkOllamaAvailability(customUrl = null) {
  const url = customUrl || ollamaBaseUrl || 'http://localhost:11434'

  try {
    // Use AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout (increased for slower connections)

    // Try to fetch from Ollama API
    const response = await fetch(`${url}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit' // Don't send credentials
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      try {
        // Also verify we can actually get models
        const data = await response.json()
        const hasModels =
          data && (Array.isArray(data.models) || (data.models && data.models.length > 0))

        if (hasModels) {
          console.log('✅ Ollama is available with models')
          return true
        } else {
          console.warn('⚠️ Ollama is running but no models found. Run: ollama pull llama3.2:1b')
          return false
        }
      } catch (parseError) {
        // If we can't parse JSON, but got 200, Ollama is probably running
        console.warn('⚠️ Ollama responded but response format unexpected')
        return true // Assume it's working
      }
    }

    return false
  } catch (error) {
    // Handle different error types
    if (error.name === 'AbortError') {
      console.warn('⏱️ Ollama check timed out - Ollama may not be running or is slow')
    } else if (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('CORS')
    ) {
      console.warn('🔌 Cannot connect to Ollama at', url)
      console.warn('')
      console.warn('📋 To fix this:')
      console.warn('   1. Install Ollama from: https://ollama.com/download')
      console.warn('   2. Start Ollama (usually starts automatically after installation)')
      console.warn('   3. Pull a model: ollama pull llama3.2:1b')
      console.warn('   4. Verify: ollama list (should show your models)')
      console.warn('')
      console.warn(
        "💡 Tip: You can use Online AI (Hugging Face) instead if you don't want to install Ollama"
      )
    } else {
      console.warn('❌ Ollama check failed:', error.message)
      console.warn('💡 Make sure Ollama is installed and running. Visit: https://ollama.com')
    }
    return false
  }
}

/**
 * Generate test cases using AI
 * @param {string} projectInfo - Project information or acceptance criteria
 * @param {string} format - 'stepByStep' or 'gherkin'
 * @param {string} language - 'en' or 'es'
 */
export async function generateTestCasesWithAI(projectInfo, format = 'stepByStep', language = 'en') {
  if (currentProvider === AI_PROVIDERS.LOCAL) {
    return await generateWithOllama(projectInfo, format, language)
  } else {
    return await generateWithHuggingFace(projectInfo, format, language)
  }
}

/**
 * Generate test plan using AI
 * @param {string} projectInfo - Project information
 * @param {string} planType - Type of test plan
 * @param {string} language - 'en' or 'es'
 */
export async function generateTestPlanWithAI(
  projectInfo,
  planType = 'comprehensive',
  language = 'en'
) {
  if (currentProvider === AI_PROVIDERS.LOCAL) {
    return await generateTestPlanWithOllama(projectInfo, planType, language)
  } else {
    return await generateTestPlanWithHuggingFace(projectInfo, planType, language)
  }
}

/**
 * Generate with Ollama (Local AI)
 */
async function generateWithOllama(projectInfo, format, language) {
  try {
    const prompt = buildTestCasePrompt(projectInfo, format, language)

    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.2:1b', // Small model, can be changed to llama3.2:3b for better results
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return parseAIResponse(data.response, format)
  } catch (error) {
    console.error('Error generating with Ollama:', error)
    throw new Error(`Local AI generation failed: ${error.message}`)
  }
}

/**
 * Generate test plan with Ollama
 */
async function generateTestPlanWithOllama(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)

    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return parseTestPlanResponse(data.response, planType)
  } catch (error) {
    console.error('Error generating test plan with Ollama:', error)
    throw new Error(`Local AI test plan generation failed: ${error.message}`)
  }
}

/**
 * Generate with Hugging Face (Online AI)
 */
async function generateWithHuggingFace(projectInfo, format, language) {
  try {
    // Using Hugging Face Inference API (free tier available)
    // Model: meta-llama/Meta-Llama-3-8B-Instruct or microsoft/Phi-3-mini-4k-instruct
    const prompt = buildTestCasePrompt(projectInfo, format, language)

    // Note: This requires a Hugging Face API token (free tier available)
    // Set HUGGING_FACE_API_KEY in environment variables
    const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY || ''

    if (!apiKey) {
      // Fallback to public inference endpoint (slower, rate limited)
      return await generateWithHuggingFacePublic(projectInfo, format, language)
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text
    return parseAIResponse(generatedText, format)
  } catch (error) {
    console.error('Error generating with Hugging Face:', error)
    // Fallback to public endpoint
    return await generateWithHuggingFacePublic(projectInfo, format, language)
  }
}

/**
 * Generate with Hugging Face Public Endpoint (no API key required, but slower)
 */
async function generateWithHuggingFacePublic(projectInfo, format, language) {
  try {
    const prompt = buildTestCasePrompt(projectInfo, format, language)

    // Using a smaller, faster model for public access
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    )

    if (!response.ok) {
      // If model is loading, wait and retry
      if (response.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        return generateWithHuggingFacePublic(projectInfo, format, language)
      }
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text
    return parseAIResponse(generatedText, format)
  } catch (error) {
    console.error('Error with Hugging Face public endpoint:', error)
    throw new Error(
      `Online AI generation failed: ${error.message}. Please check your internet connection or configure a Hugging Face API key.`
    )
  }
}

/**
 * Generate test plan with Hugging Face
 */
async function generateTestPlanWithHuggingFace(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)
    const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY || ''

    if (!apiKey) {
      return await generateTestPlanWithHuggingFacePublic(projectInfo, planType, language)
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text
    return parseTestPlanResponse(generatedText, planType)
  } catch (error) {
    console.error('Error generating test plan with Hugging Face:', error)
    return await generateTestPlanWithHuggingFacePublic(projectInfo, planType, language)
  }
}

async function generateTestPlanWithHuggingFacePublic(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    )

    if (!response.ok) {
      if (response.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        return generateTestPlanWithHuggingFacePublic(projectInfo, planType, language)
      }
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text
    return parseTestPlanResponse(generatedText, planType)
  } catch (error) {
    console.error('Error with Hugging Face public endpoint:', error)
    throw new Error(`Online AI test plan generation failed: ${error.message}`)
  }
}

/**
 * Build prompt for test case generation
 */
function buildTestCasePrompt(projectInfo, format, language) {
  const lang = language === 'es' ? 'español' : 'English'
  const formatType = format === 'gherkin' ? 'Gherkin (Given-When-Then)' : 'Step-by-step'

  return `You are an expert QA engineer. Generate comprehensive test cases based on the following project information or acceptance criteria.

Language: ${lang}
Format: ${formatType}

Project Information/Acceptance Criteria:
${projectInfo}

Instructions:
1. Analyze the provided information carefully
2. Generate detailed test cases with:
   - Clear and specific titles
   - Appropriate priority (High, Medium, Low)
   - Preconditions
   - Detailed steps (in ${formatType} format)
   - Specific expected results (not generic)
3. Make the steps and expected results intelligent and context-aware
4. Ensure each test case is unique and specific

Generate the test cases in JSON format with the following structure:
{
  "testCases": [
    {
      "title": "Test case title",
      "priority": "High|Medium|Low",
      "type": "Functional|Integration|etc",
      "preconditions": "Preconditions",
      "steps": "Steps in ${formatType} format",
      "expectedResult": "Specific expected result"
    }
  ]
}

Generate comprehensive test cases now:`
}

/**
 * Build prompt for test plan generation
 */
function buildTestPlanPrompt(projectInfo, planType, language) {
  const lang = language === 'es' ? 'español' : 'English'

  return `You are an expert QA engineer. Generate a comprehensive ${planType} test plan based on the following project information.

Language: ${lang}
Test Plan Type: ${planType}

Project Information:
${projectInfo}

Instructions:
1. Analyze the project information thoroughly
2. Generate a detailed test plan including:
   - Objectives
   - Scope
   - Test Strategy
   - Test Items
   - Resources needed
   - Schedule
   - Risks and mitigation
3. Make it comprehensive and specific to the project

Generate the test plan in JSON format with the following structure:
{
  "title": "Test plan title",
  "objectives": ["Objective 1", "Objective 2"],
  "scope": "Scope description",
  "testStrategy": "Test strategy description",
  "testItems": ["Item 1", "Item 2"],
  "resources": ["Resource 1", "Resource 2"],
  "schedule": "Schedule description",
  "risks": ["Risk 1", "Risk 2"]
}

Generate the test plan now:`
}

/**
 * Parse AI response for test cases
 */
function parseAIResponse(response, format) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.testCases && Array.isArray(parsed.testCases)) {
        return parsed.testCases.map((tc, index) => ({
          id: index + 1,
          title: tc.title || 'Test Case',
          priority: tc.priority || 'Medium',
          type: tc.type || 'Functional',
          preconditions: tc.preconditions || 'System is ready',
          steps: tc.steps || '',
          expectedResult: tc.expectedResult || 'Operation completes successfully'
        }))
      }
    }

    // Fallback: return empty array if parsing fails
    return []
  } catch (error) {
    console.error('Error parsing AI response:', error)
    return []
  }
}

/**
 * Parse AI response for test plan
 */
function parseTestPlanResponse(response, planType) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || 'Test Plan',
        type: planType,
        objectives: parsed.objectives || [],
        scope: parsed.scope || '',
        testStrategy: parsed.testStrategy || '',
        testItems: parsed.testItems || [],
        resources: parsed.resources || [],
        schedule: parsed.schedule || '',
        risks: parsed.risks || []
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing test plan response:', error)
    return null
  }
}

export { AI_PROVIDERS }
