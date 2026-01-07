/**
 * Composable for managing AI configuration
 * Handles saving and loading AI provider settings from localStorage
 */

import { ref, watch } from 'vue'
import { AI_PROVIDERS, AI_PROVIDER_CONFIG } from '@core/constants/aiProviders.js'

const STORAGE_KEY = 'ai_config'
const DEFAULT_CONFIG = {
  provider: AI_PROVIDERS.ONLINE,
  apiKey: '',
  model: '',
  customEndpoint: '',
  ollamaUrl: 'http://localhost:11434'
}

const config = ref(loadConfig())

/**
 * Load AI configuration from localStorage
 */
function loadConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate provider exists
      if (AI_PROVIDER_CONFIG[parsed.provider]) {
        return {
          ...DEFAULT_CONFIG,
          ...parsed
        }
      }
    }
  } catch (error) {
    console.error('Error loading AI config:', error)
  }
  return { ...DEFAULT_CONFIG }
}

/**
 * Save AI configuration to localStorage
 */
function saveConfig(newConfig) {
  try {
    // Don't save API keys in plain text (in production, consider encryption)
    const configToSave = {
      provider: newConfig.provider,
      model: newConfig.model || getDefaultModel(newConfig.provider),
      customEndpoint: newConfig.customEndpoint || '',
      ollamaUrl: newConfig.ollamaUrl || 'http://localhost:11434'
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave))
    config.value = { ...config.value, ...newConfig }
    return true
  } catch (error) {
    console.error('Error saving AI config:', error)
    return false
  }
}

/**
 * Get API key from secure storage (separate from config)
 */
function getApiKey(provider) {
  try {
    const key = sessionStorage.getItem(`${STORAGE_KEY}_key_${provider}`)
    return key || ''
  } catch (error) {
    console.error('Error getting API key:', error)
    return ''
  }
}

/**
 * Save API key to secure storage
 */
function saveApiKey(provider, apiKey) {
  try {
    if (apiKey) {
      sessionStorage.setItem(`${STORAGE_KEY}_key_${provider}`, apiKey)
    } else {
      sessionStorage.removeItem(`${STORAGE_KEY}_key_${provider}`)
    }
    return true
  } catch (error) {
    console.error('Error saving API key:', error)
    return false
  }
}

/**
 * Get default model for provider
 */
function getDefaultModel(provider) {
  const providerConfig = AI_PROVIDER_CONFIG[provider]
  return providerConfig?.defaultModel || ''
}

/**
 * Get current provider configuration
 */
function getProviderConfig(provider = null) {
  const providerId = provider || config.value.provider
  return AI_PROVIDER_CONFIG[providerId] || null
}

/**
 * Validate API key format (basic validation)
 */
function validateApiKey(provider, apiKey) {
  if (!apiKey || apiKey.trim().length === 0) {
    return { valid: false, message: 'API key is required' }
  }

  const providerId = provider || config.value.provider
  const key = apiKey.trim()

  // Basic format validation based on provider
  switch (providerId) {
    case AI_PROVIDERS.OPENAI:
      if (!key.startsWith('sk-')) {
        return { valid: false, message: 'OpenAI API key should start with "sk-"' }
      }
      break
    case AI_PROVIDERS.CLAUDE:
      if (!key.startsWith('sk-ant-')) {
        return { valid: false, message: 'Claude API key should start with "sk-ant-"' }
      }
      break
    case AI_PROVIDERS.GEMINI:
      if (!key.startsWith('AIza')) {
        return { valid: false, message: 'Gemini API key should start with "AIza"' }
      }
      break
  }

  return { valid: true, message: '' }
}

/**
 * Test API key by making a simple request
 */
async function testApiKey(provider, apiKey, model = null) {
  try {
    const providerConfig = getProviderConfig(provider)
    if (!providerConfig) {
      return { success: false, message: 'Invalid provider' }
    }

    const testModel = model || providerConfig.defaultModel

    // Test based on provider
    switch (provider) {
      case AI_PROVIDERS.OPENAI:
        return await testOpenAIKey(apiKey, testModel)
      case AI_PROVIDERS.CLAUDE:
        return await testClaudeKey(apiKey, testModel)
      case AI_PROVIDERS.GEMINI:
        return await testGeminiKey(apiKey, testModel)
      default:
        return { success: true, message: 'API key format is valid' }
    }
  } catch (error) {
    return { success: false, message: error.message || 'Failed to test API key' }
  }
}

/**
 * Test OpenAI API key
 */
async function testOpenAIKey(apiKey, model) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (response.ok) {
      return { success: true, message: 'API key is valid' }
    } else if (response.status === 401) {
      return { success: false, message: 'Invalid API key' }
    } else {
      return { success: false, message: `API error: ${response.statusText}` }
    }
  } catch (error) {
    return { success: false, message: `Connection error: ${error.message}` }
  }
}

/**
 * Test Claude API key
 */
async function testClaudeKey(apiKey, model) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      })
    })

    if (response.ok || response.status === 400) {
      // 400 might be due to short message, but key is valid
      return { success: true, message: 'API key is valid' }
    } else if (response.status === 401 || response.status === 403) {
      return { success: false, message: 'Invalid API key' }
    } else {
      return { success: false, message: `API error: ${response.statusText}` }
    }
  } catch (error) {
    return { success: false, message: `Connection error: ${error.message}` }
  }
}

/**
 * Test Gemini API key
 */
async function testGeminiKey(apiKey, model) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}?key=${apiKey}`
    const response = await fetch(url, {
      method: 'GET'
    })

    if (response.ok) {
      return { success: true, message: 'API key is valid' }
    } else if (response.status === 400 || response.status === 403) {
      return { success: false, message: 'Invalid API key' }
    } else {
      return { success: false, message: `API error: ${response.statusText}` }
    }
  } catch (error) {
    return { success: false, message: `Connection error: ${error.message}` }
  }
}

/**
 * Clear all AI configuration
 */
function clearConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    // Clear all API keys from session storage
    Object.values(AI_PROVIDERS).forEach(provider => {
      sessionStorage.removeItem(`${STORAGE_KEY}_key_${provider}`)
    })
    config.value = { ...DEFAULT_CONFIG }
    return true
  } catch (error) {
    console.error('Error clearing AI config:', error)
    return false
  }
}

export function useAIConfig() {
  // Watch for config changes and save automatically
  watch(
    () => config.value.provider,
    newProvider => {
      // Update model to default when provider changes
      if (config.value.model === '') {
        config.value.model = getDefaultModel(newProvider)
      }
    }
  )

  return {
    config,
    saveConfig,
    getApiKey,
    saveApiKey,
    getDefaultModel,
    getProviderConfig,
    validateApiKey,
    testApiKey,
    clearConfig,
    loadConfig: () => {
      config.value = loadConfig()
      return config.value
    }
  }
}

