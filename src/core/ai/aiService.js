/**
 * AI Service for Test Plan and Test Case Generation
 * Supports multiple AI providers: Ollama, Hugging Face, OpenAI, Claude, Gemini
 */

import { AI_PROVIDERS, DEFAULT_OLLAMA_URL } from '@core/constants/aiProviders.js'

let currentProvider = AI_PROVIDERS.ONLINE // Default to online
let ollamaBaseUrl = DEFAULT_OLLAMA_URL // Default Ollama URL
let currentConfig = {
  provider: AI_PROVIDERS.ONLINE,
  apiKey: '',
  model: '',
  customEndpoint: ''
}

/**
 * Initialize AI service
 * @param {string} provider - Provider ID (local, online, openai, claude, gemini, custom)
 * @param {object} config - Configuration object with apiKey, model, customEndpoint, ollamaUrl
 */
export function initAIService(provider = AI_PROVIDERS.ONLINE, config = {}) {
  currentProvider = provider
  currentConfig = {
    provider,
    apiKey: config.apiKey || '',
    model: config.model || '',
    customEndpoint: config.customEndpoint || '',
    ollamaUrl: config.ollamaUrl || DEFAULT_OLLAMA_URL
  }
  if (config.ollamaUrl) {
    ollamaBaseUrl = config.ollamaUrl
  }
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
  switch (currentProvider) {
    case AI_PROVIDERS.LOCAL:
      return await generateWithOllama(projectInfo, format, language)
    case AI_PROVIDERS.OPENAI:
      return await generateWithOpenAI(projectInfo, format, language)
    case AI_PROVIDERS.CLAUDE:
      return await generateWithClaude(projectInfo, format, language)
    case AI_PROVIDERS.GEMINI:
      return await generateWithGemini(projectInfo, format, language)
    case AI_PROVIDERS.CUSTOM:
      return await generateWithCustom(projectInfo, format, language)
    case AI_PROVIDERS.ONLINE:
    default:
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
  switch (currentProvider) {
    case AI_PROVIDERS.LOCAL:
      return await generateTestPlanWithOllama(projectInfo, planType, language)
    case AI_PROVIDERS.OPENAI:
      return await generateTestPlanWithOpenAI(projectInfo, planType, language)
    case AI_PROVIDERS.CLAUDE:
      return await generateTestPlanWithClaude(projectInfo, planType, language)
    case AI_PROVIDERS.GEMINI:
      return await generateTestPlanWithGemini(projectInfo, planType, language)
    case AI_PROVIDERS.CUSTOM:
      return await generateTestPlanWithCustom(projectInfo, planType, language)
    case AI_PROVIDERS.ONLINE:
    default:
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
 * Generate with OpenAI
 */
async function generateWithOpenAI(projectInfo, format, language) {
  try {
    const prompt = buildTestCasePrompt(projectInfo, format, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_OPENAI_API_KEY || ''
    const model = currentConfig.model || 'gpt-3.5-turbo'

    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || ''
    return parseAIResponse(generatedText, format)
  } catch (error) {
    console.error('Error generating with OpenAI:', error)
    throw new Error(`OpenAI generation failed: ${error.message}`)
  }
}

/**
 * Generate test plan with OpenAI
 */
async function generateTestPlanWithOpenAI(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_OPENAI_API_KEY || ''
    const model = currentConfig.model || 'gpt-3.5-turbo'

    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || ''
    return parseTestPlanResponse(generatedText, planType)
  } catch (error) {
    console.error('Error generating test plan with OpenAI:', error)
    throw new Error(`OpenAI test plan generation failed: ${error.message}`)
  }
}

/**
 * Generate with Claude
 */
async function generateWithClaude(projectInfo, format, language) {
  try {
    const prompt = buildTestCasePrompt(projectInfo, format, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_CLAUDE_API_KEY || ''
    const model = currentConfig.model || 'claude-3-5-sonnet-20241022'

    if (!apiKey) {
      throw new Error('Claude API key is required')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Claude API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.content?.[0]?.text || ''
    return parseAIResponse(generatedText, format)
  } catch (error) {
    console.error('Error generating with Claude:', error)
    throw new Error(`Claude generation failed: ${error.message}`)
  }
}

/**
 * Generate test plan with Claude
 */
async function generateTestPlanWithClaude(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_CLAUDE_API_KEY || ''
    const model = currentConfig.model || 'claude-3-5-sonnet-20241022'

    if (!apiKey) {
      throw new Error('Claude API key is required')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Claude API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.content?.[0]?.text || ''
    return parseTestPlanResponse(generatedText, planType)
  } catch (error) {
    console.error('Error generating test plan with Claude:', error)
    throw new Error(`Claude test plan generation failed: ${error.message}`)
  }
}

/**
 * Generate with Gemini
 */
async function generateWithGemini(projectInfo, format, language) {
  try {
    const prompt = buildTestCasePrompt(projectInfo, format, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
    const model = currentConfig.model || 'gemini-1.5-flash'

    if (!apiKey) {
      throw new Error('Gemini API key is required')
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseAIResponse(generatedText, format)
  } catch (error) {
    console.error('Error generating with Gemini:', error)
    throw new Error(`Gemini generation failed: ${error.message}`)
  }
}

/**
 * Generate test plan with Gemini
 */
async function generateTestPlanWithGemini(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
    const model = currentConfig.model || 'gemini-1.5-flash'

    if (!apiKey) {
      throw new Error('Gemini API key is required')
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000
        }
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseTestPlanResponse(generatedText, planType)
  } catch (error) {
    console.error('Error generating test plan with Gemini:', error)
    throw new Error(`Gemini test plan generation failed: ${error.message}`)
  }
}

/**
 * Generate with Custom Provider
 */
async function generateWithCustom(projectInfo, format, language) {
  try {
    const prompt = buildTestCasePrompt(projectInfo, format, language)
    const apiKey = currentConfig.apiKey || ''
    const endpoint = currentConfig.customEndpoint || ''

    if (!endpoint) {
      throw new Error('Custom endpoint is required')
    }

    // Try OpenAI-compatible format first
    const response = await fetch(`${endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        model: currentConfig.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || data.response || ''
    return parseAIResponse(generatedText, format)
  } catch (error) {
    console.error('Error generating with Custom provider:', error)
    throw new Error(`Custom provider generation failed: ${error.message}`)
  }
}

/**
 * Generate test plan with Custom Provider
 */
async function generateTestPlanWithCustom(projectInfo, planType, language) {
  try {
    const prompt = buildTestPlanPrompt(projectInfo, planType, language)
    const apiKey = currentConfig.apiKey || ''
    const endpoint = currentConfig.customEndpoint || ''

    if (!endpoint) {
      throw new Error('Custom endpoint is required')
    }

    const response = await fetch(`${endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        model: currentConfig.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || data.response || ''
    return parseTestPlanResponse(generatedText, planType)
  } catch (error) {
    console.error('Error generating test plan with Custom provider:', error)
    throw new Error(`Custom provider test plan generation failed: ${error.message}`)
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
   - Preconditions (ALWAYS include "User has accessed the application" as the first precondition)
   - Detailed steps (in ${formatType} format)
   - Specific expected results (not generic)
3. Make the steps and expected results intelligent and context-aware
4. Ensure each test case is unique and specific
5. IMPORTANT: Every test case MUST have "User has accessed the application" as the first precondition before any other operation

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
          preconditions: tc.preconditions || 'User has accessed the application; System is ready',
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
 * Generate bug report using AI
 * @param {object} bugInfo - Bug information object with title, description, priority, severity, environment, etc.
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<object>} Generated bug report with steps, expected result, actual result, etc.
 */
export async function generateBugReportWithAI(bugInfo, language = 'en') {
  switch (currentProvider) {
    case AI_PROVIDERS.LOCAL:
      return await generateBugReportWithOllama(bugInfo, language)
    case AI_PROVIDERS.OPENAI:
      return await generateBugReportWithOpenAI(bugInfo, language)
    case AI_PROVIDERS.CLAUDE:
      return await generateBugReportWithClaude(bugInfo, language)
    case AI_PROVIDERS.GEMINI:
      return await generateBugReportWithGemini(bugInfo, language)
    case AI_PROVIDERS.CUSTOM:
      return await generateBugReportWithCustom(bugInfo, language)
    case AI_PROVIDERS.ONLINE:
    default:
      return await generateBugReportWithHuggingFace(bugInfo, language)
  }
}

/**
 * Build prompt for bug report generation
 */
function buildBugReportPrompt(bugInfo, language) {
  const lang = language === 'es' ? 'español' : 'English'
  
  const environmentInfo = []
  if (bugInfo.environment) environmentInfo.push(`Environment: ${bugInfo.environment}`)
  if (bugInfo.browser) environmentInfo.push(`Browser: ${bugInfo.browser}`)
  if (bugInfo.operatingSystem) environmentInfo.push(`OS: ${bugInfo.operatingSystem}`)
  if (bugInfo.version) environmentInfo.push(`Version: ${bugInfo.version}`)
  
  const envText = environmentInfo.length > 0 ? `\nEnvironment Information:\n${environmentInfo.join('\n')}` : ''

  return `You are an expert QA engineer specialized in creating detailed, actionable bug reproduction steps. Your task is to analyze bug descriptions and generate specific, step-by-step instructions that developers can follow exactly.

Language: ${lang}

Bug Information:
Title: ${bugInfo.title}
Description: ${bugInfo.description}
Priority: ${bugInfo.priority}
Severity: ${bugInfo.severity}${envText}
${bugInfo.additionalInfo ? `Additional Information: ${bugInfo.additionalInfo}` : ''}

CRITICAL INSTRUCTIONS FOR STEP GENERATION:
1. Extract SPECIFIC details from the description:
   - Exact URLs, routes, or page paths (e.g., "/dashboard", "/users/123", "https://app.example.com/login")
   - Specific UI elements (button names, field labels, menu items, form fields)
   - Exact actions (click "Save", type "test@example.com", select "Option A")
   - Specific data or inputs mentioned
   - Browser interactions (refresh, navigate, scroll)
   - Error messages or console errors mentioned

2. Generate steps that are:
   - SPECIFIC: Include exact element names, URLs, and actions (NOT generic like "access the page")
   - ACTIONABLE: Each step should be a single, clear action that can be executed
   - SEQUENTIAL: Steps must follow a logical order
   - COMPLETE: Include all necessary context (navigation, inputs, interactions)

3. AVOID generic steps like:
   - "Navigate to the application" (use specific URL/page)
   - "Access the page or feature mentioned" (name the exact page/feature)
   - "Perform the action described" (describe the exact action)
   - "Observe the issue" (be specific about what to observe)

4. GOOD step examples:
   - "1. Open the application and navigate to https://app.example.com/dashboard"
   - "2. Click on the 'Create User' button in the top navigation bar"
   - "3. Fill in the 'Email' field with 'test@example.com'"
   - "4. Click the 'Submit' button"
   - "5. Observe that the page shows error message 'Email already exists' instead of creating the user"

5. BAD step examples (too generic):
   - "1. Navigate to the application"
   - "2. Access the page or feature mentioned in the description"
   - "3. Perform the action described in the bug"
   - "4. Observe the issue or unexpected behavior"

6. Expected Result: Describe what SHOULD happen when following the steps correctly
7. Actual Result: Describe what ACTUALLY happens based on the bug description

Generate the bug report in JSON format with the following structure:
{
  "stepsToReproduce": "1. Specific step with exact details\n2. Another specific step\n3. Final specific step",
  "expectedResult": "What should happen (be specific)",
  "actualResult": "What actually happened (be specific based on description)",
  "additionalInfo": "Any additional technical details, error messages, or context"
}

IMPORTANT: Make every step SPECIFIC and ACTIONABLE. Extract all details from the description. Do not use generic placeholder text.

Generate the bug report now:`
}

/**
 * Generate bug report with Ollama
 */
async function generateBugReportWithOllama(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)

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
    return parseBugReportResponse(data.response)
  } catch (error) {
    console.error('Error generating bug report with Ollama:', error)
    throw new Error(`Local AI bug report generation failed: ${error.message}`)
  }
}

/**
 * Generate bug report with OpenAI
 */
async function generateBugReportWithOpenAI(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_OPENAI_API_KEY || ''
    const model = currentConfig.model || 'gpt-3.5-turbo'

    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || ''
    return parseBugReportResponse(generatedText)
  } catch (error) {
    console.error('Error generating bug report with OpenAI:', error)
    throw new Error(`OpenAI bug report generation failed: ${error.message}`)
  }
}

/**
 * Generate bug report with Claude
 */
async function generateBugReportWithClaude(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_CLAUDE_API_KEY || ''
    const model = currentConfig.model || 'claude-3-5-sonnet-20241022'

    if (!apiKey) {
      throw new Error('Claude API key is required')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Claude API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.content?.[0]?.text || ''
    return parseBugReportResponse(generatedText)
  } catch (error) {
    console.error('Error generating bug report with Claude:', error)
    throw new Error(`Claude bug report generation failed: ${error.message}`)
  }
}

/**
 * Generate bug report with Gemini
 */
async function generateBugReportWithGemini(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)
    const apiKey = currentConfig.apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
    const model = currentConfig.model || 'gemini-1.5-flash'

    if (!apiKey) {
      throw new Error('Gemini API key is required')
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500
        }
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseBugReportResponse(generatedText)
  } catch (error) {
    console.error('Error generating bug report with Gemini:', error)
    throw new Error(`Gemini bug report generation failed: ${error.message}`)
  }
}

/**
 * Generate bug report with Custom Provider
 */
async function generateBugReportWithCustom(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)
    const apiKey = currentConfig.apiKey || ''
    const endpoint = currentConfig.customEndpoint || ''

    if (!endpoint) {
      throw new Error('Custom endpoint is required')
    }

    const response = await fetch(`${endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        model: currentConfig.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || data.response || ''
    return parseBugReportResponse(generatedText)
  } catch (error) {
    console.error('Error generating bug report with Custom provider:', error)
    throw new Error(`Custom provider bug report generation failed: ${error.message}`)
  }
}

/**
 * Generate bug report with Hugging Face
 */
async function generateBugReportWithHuggingFace(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)
    const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY || ''

    if (!apiKey) {
      return await generateBugReportWithHuggingFacePublic(bugInfo, language)
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
    return parseBugReportResponse(generatedText)
  } catch (error) {
    console.error('Error generating bug report with Hugging Face:', error)
    return await generateBugReportWithHuggingFacePublic(bugInfo, language)
  }
}

/**
 * Generate bug report with Hugging Face Public Endpoint
 */
async function generateBugReportWithHuggingFacePublic(bugInfo, language) {
  try {
    const prompt = buildBugReportPrompt(bugInfo, language)

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
        return generateBugReportWithHuggingFacePublic(bugInfo, language)
      }
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text
    return parseBugReportResponse(generatedText)
  } catch (error) {
    console.error('Error with Hugging Face public endpoint:', error)
    throw new Error(`Online AI bug report generation failed: ${error.message}`)
  }
}

/**
 * Parse AI response for bug report
 */
function parseBugReportResponse(response) {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        stepsToReproduce: parsed.stepsToReproduce || '',
        expectedResult: parsed.expectedResult || '',
        actualResult: parsed.actualResult || '',
        additionalInfo: parsed.additionalInfo || ''
      }
    }

    // Fallback: try to extract information from text
    const stepsMatch = response.match(/steps?[:\s]+(.*?)(?=expected|actual|$)/is)
    const expectedMatch = response.match(/expected[:\s]+(.*?)(?=actual|$)/is)
    const actualMatch = response.match(/actual[:\s]+(.*?)(?=additional|$)/is)

    return {
      stepsToReproduce: stepsMatch?.[1]?.trim() || '',
      expectedResult: expectedMatch?.[1]?.trim() || '',
      actualResult: actualMatch?.[1]?.trim() || '',
      additionalInfo: ''
    }
  } catch (error) {
    console.error('Error parsing bug report response:', error)
    return {
      stepsToReproduce: '',
      expectedResult: '',
      actualResult: '',
      additionalInfo: ''
    }
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

/**
 * Generate intelligent title from text using AI
 * @param {string} text - Text to generate title from (AC, requirement, etc.)
 * @param {string} language - 'en' or 'es'
 * @param {string} type - 'testCase' or 'testPlan'
 * @returns {Promise<string>} - Generated intelligent title
 */
export async function generateIntelligentTitle(text, language = 'en', type = 'testCase') {
  if (!text || text.trim().length === 0) {
    return type === 'testCase' ? 'Test Case' : type === 'bugReport' ? 'Bug Report' : 'Test Plan'
  }

  const lang = language === 'es' ? 'español' : 'English'
  const typeLabel = type === 'testCase' ? 'test case' : type === 'bugReport' ? 'bug report title' : 'test plan'
  const maxLength = type === 'bugReport' ? 20 : 60

  const prompt = type === 'bugReport' 
    ? `You are an expert QA engineer. Analyze the bug description and create a concise, descriptive bug title.

Language: ${lang}
Bug Description: ${text}

Requirements:
1. Analyze the issue/problem described, NOT just copy text
2. Create a title that describes the bug/problem (maximum ${maxLength} characters)
3. Focus on: what is broken, what doesn't work, what error occurs
4. Use action verbs: "not loading", "fails to", "error in", "broken", "missing", etc.
5. Be specific about the issue, not generic
6. Do NOT copy the description verbatim - analyze and summarize the problem
7. Return ONLY the title, nothing else

Examples:
- "When I reload the page, it shows a blank screen" → "Page blank on reload"
- "The login button doesn't work when I click it" → "Login button fails"
- "Error: Cannot read property 'name' of null" → "Null reference error"
- "The dashboard page is not loading properly after refresh" → "Dashboard not loading"

Generate the bug title now:`
    : `You are an expert QA engineer. Generate a concise, professional ${typeLabel} title from the following text.

Language: ${lang}
Text: ${text}

Requirements:
1. Create a short, clear title (maximum ${maxLength} characters)
2. Remove all Gherkin keywords (Given, When, Then, etc.)
3. Remove common prefixes (AC, Acceptance Criteria, etc.)
4. Focus on the main action and object
5. Use professional QA terminology
6. Do NOT copy the text verbatim - create a smart, concise title
7. Return ONLY the title, nothing else

Examples:
- "Given I am on the login page, When I enter valid credentials, Then I should be logged in" → "User Login with Valid Credentials"
- "The Browse province section is expanded, I view it, I should successfully see a list of provinces" → "View Province List"
- "AC1: User can create a new order" → "Create New Order"

Generate the title now:`

  try {
    if (currentProvider === AI_PROVIDERS.LOCAL) {
      return await generateTitleWithOllama(prompt, type)
    } else {
      return await generateTitleWithHuggingFace(prompt, type)
    }
  } catch (error) {
    console.warn('AI title generation failed, using fallback:', error)
    // Fallback to intelligent non-AI generation
    return generateIntelligentTitleFallback(text, type)
  }
}

/**
 * Generate title with Ollama
 */
async function generateTitleWithOllama(prompt, type = 'testCase') {
  const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:1b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 100
      }
    })
  })

  if (!response.ok) {
    throw new Error('Ollama API error')
  }

  const data = await response.json()
  const title = data.response?.trim() || ''

  // Clean up the response
  const cleaned = title
    .replace(/^Title:\s*/i, '')
    .replace(/^"|"$/g, '')
    .replace(/^h[1-6]\.\s*/gi, '') // Remove Jira heading format if present
    .replace(/\s*h[1-6]\.\s*/gi, ' ') // Remove heading format anywhere in text
    .trim()
  
  // Limit to 20 characters for bug reports, 60 for others
  const maxLength = type === 'bugReport' ? 20 : 60
  return cleaned.substring(0, maxLength)
}

/**
 * Generate title with Hugging Face
 */
async function generateTitleWithHuggingFace(prompt, type = 'testCase') {
  const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY || ''

  const response = await fetch(
    'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.3,
          return_full_text: false
        }
      })
    }
  )

  if (!response.ok) {
    throw new Error('Hugging Face API error')
  }

  const data = await response.json()
  const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text
  const title = generatedText?.trim() || ''

  // Clean up the response
  const cleaned = title
    .replace(/^Title:\s*/i, '')
    .replace(/^"|"$/g, '')
    .replace(/^h[1-6]\.\s*/gi, '') // Remove Jira heading format if present
    .replace(/\s*h[1-6]\.\s*/gi, ' ') // Remove heading format anywhere in text
    .trim()
  
  // Limit to 20 characters for bug reports, 60 for others
  const maxLength = type === 'bugReport' ? 20 : 60
  return cleaned.substring(0, maxLength)
}

/**
 * Fallback intelligent title generation without AI
 */
function generateIntelligentTitleFallback(text, type = 'testCase') {
  if (!text || typeof text !== 'string') {
    return type === 'testCase' ? 'Test Case' : type === 'bugReport' ? 'Bug Report' : 'Test Plan'
  }
  
  const maxLength = type === 'bugReport' ? 20 : 60

  // Remove common prefixes
  let title = text
    .replace(/^AC[:\s]+\d*[:\s]*/i, '')
    .replace(/^Acceptance\s+Criteria[:\s]+\d*[:\s]*/i, '')
    .replace(/^(Given|When|Then|As a|I want|User story|Scenario|Dado|Cuando|Entonces)[:\s]+/i, '')
    .trim()

  // Remove Gherkin keywords
  title = title.replace(/(?:Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/gi, ' ')

  // Extract key action and object
  const lowerTitle = title.toLowerCase()

  // For bug reports, analyze the issue/problem intelligently
  if (type === 'bugReport') {
    let issueTitle = ''
    
    // Priority order: most specific patterns first
    // 1. Failing + reload/refresh
    if ((lowerTitle.includes('failing') || lowerTitle.includes('fails')) && 
        (lowerTitle.includes('reload') || lowerTitle.includes('refresh'))) {
      issueTitle = 'App fails on reload'
    }
    // 2. Not loading
    else if (lowerTitle.includes('not loading') || lowerTitle.includes('doesn\'t load') || lowerTitle.includes('won\'t load')) {
      if (lowerTitle.includes('page')) {
        issueTitle = 'Page not loading'
      } else if (lowerTitle.includes('app')) {
        issueTitle = 'App not loading'
      } else {
        issueTitle = 'Not loading'
      }
    }
    // 3. Not working
    else if (lowerTitle.includes('not working') || lowerTitle.includes('doesn\'t work') || lowerTitle.includes('won\'t work')) {
      if (lowerTitle.includes('button')) {
        issueTitle = 'Button not working'
      } else if (lowerTitle.includes('feature')) {
        issueTitle = 'Feature not working'
      } else {
        issueTitle = 'Not working'
      }
    }
    // 4. Error messages
    else if (lowerTitle.includes('error') || lowerTitle.includes('exception')) {
      const errorMatch = text.match(/(?:error|exception)[:\s]+([^.!?\n]{0,12})/i)
      if (errorMatch && errorMatch[1].trim().length > 0) {
        const errorText = errorMatch[1].trim()
        issueTitle = errorText.length > 12 ? `Error: ${errorText.substring(0, 9)}...` : `Error: ${errorText}`
      } else {
        issueTitle = 'Error occurred'
      }
    }
    // 5. Broken
    else if (lowerTitle.includes('broken')) {
      issueTitle = 'Feature broken'
    }
    // 6. Missing/not showing
    else if (lowerTitle.includes('missing') || lowerTitle.includes('not showing')) {
      issueTitle = 'Content missing'
    }
    // 7. Display issues
    else if (lowerTitle.includes('display') || lowerTitle.includes('not displayed') || lowerTitle.includes('not displaying')) {
      if (lowerTitle.includes('blank')) {
        issueTitle = 'Blank screen'
      } else {
        issueTitle = 'Display issue'
      }
    }
    // 8. Reload/refresh issues (without failing)
    else if (lowerTitle.includes('reload') || lowerTitle.includes('refresh')) {
      issueTitle = 'Issue on reload'
    }
    // 9. Failing (general)
    else if (lowerTitle.includes('failing') || lowerTitle.includes('fails')) {
      issueTitle = 'App failing'
    }
    // 10. Extract key words and create concise title
    else {
      // Try to extract the main issue from first sentence
      const firstSentence = text.split(/[.!?]/)[0]?.trim() || text.trim()
      const lowerFirst = firstSentence.toLowerCase()
      
      // Extract key action words
      if (lowerFirst.includes('cannot') || lowerFirst.includes('can\'t')) {
        const actionMatch = firstSentence.match(/cannot\s+(?:read|access|open|load|find|see|do|perform)\s+([^.!?\n]{0,10})/i)
        if (actionMatch) {
          issueTitle = `Cannot ${actionMatch[1].trim()}`
        } else {
          issueTitle = 'Cannot perform action'
        }
      } else if (lowerFirst.includes('unable')) {
        issueTitle = 'Unable to perform'
      } else {
        // Take first 3-4 key words
        const words = firstSentence.split(/\s+/).filter(w => 
          w.length > 2 && 
          !['the', 'a', 'an', 'is', 'are', 'was', 'were', 'when', 'after', 'before', 'during'].includes(w.toLowerCase())
        )
        if (words.length > 0) {
          issueTitle = words.slice(0, 3).join(' ')
        } else {
          issueTitle = 'Bug report'
        }
      }
    }
    
    // Ensure title is max 20 characters, cut at word boundary if possible
    if (issueTitle.length > maxLength) {
      const words = issueTitle.split(' ')
      let shortened = ''
      for (const word of words) {
        if ((shortened + ' ' + word).length <= maxLength - 3) {
          shortened += (shortened ? ' ' : '') + word
        } else {
          break
        }
      }
      issueTitle = shortened || issueTitle.substring(0, maxLength - 3)
      if (issueTitle.length < issueTitle.split(' ').join('').length) {
        issueTitle += '...'
      }
    }
    
    title = issueTitle.substring(0, maxLength).trim()
    title = title.charAt(0).toUpperCase() + title.slice(1)
    return title || 'Bug Report'
  }

  // Pattern-based title generation (for test cases)
  const patterns = [
    // View/Display patterns
    {
      pattern:
        /(?:view|display|show|see|browse|list)\s+(?:the\s+)?(?:list\s+of\s+)?([a-z\s]+?)(?:$|\.|,)/i,
      format: match => `View ${capitalizeWords(match[1])}`
    },
    // Create patterns
    {
      pattern: /(?:create|add|new)\s+(?:a\s+)?(?:new\s+)?([a-z\s]+?)(?:$|\.|,)/i,
      format: match => `Create ${capitalizeWords(match[1])}`
    },
    // Update patterns
    {
      pattern: /(?:update|edit|modify|change)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.|,)/i,
      format: match => `Update ${capitalizeWords(match[1])}`
    },
    // Delete patterns
    {
      pattern: /(?:delete|remove)\s+(?:the\s+)?([a-z\s]+?)(?:$|\.|,)/i,
      format: match => `Delete ${capitalizeWords(match[1])}`
    },
    // Login patterns
    {
      pattern: /(?:login|sign in|authenticate)/i,
      format: () => 'User Login'
    },
    // Search patterns
    {
      pattern: /(?:search|find|filter)\s+(?:for\s+)?([a-z\s]+?)(?:$|\.|,)/i,
      format: match => `Search ${capitalizeWords(match[1])}`
    }
  ]

  for (const { pattern, format } of patterns) {
    const match = title.match(pattern)
    if (match) {
      title = format(match)
      break
    }
  }

  // Clean up: take first meaningful phrase
  const sentences = title.split(/[.!?,]/)
  title = sentences[0]?.trim() || title

  // Remove trailing filler words
  title = title.replace(
    /\s+(is|are|should|must|will|can|may|the|a|an|successfully|successful)\s*$/i,
    ''
  )

  // Limit length and capitalize
  title = title.trim().substring(0, 60)
  title = title.charAt(0).toUpperCase() + title.slice(1)

  return title || (type === 'testCase' ? 'Test Case' : 'Test Plan')
}

function capitalizeWords(text) {
  return text
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .substring(0, 40)
}

export { AI_PROVIDERS } from '@core/constants/aiProviders.js'
