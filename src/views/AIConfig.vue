<template>
  <div class="ai-config-view">
    <div class="header">
      <h1>{{ $t('aiConfig.title') }}</h1>
      <p class="subtitle">{{ $t('aiConfig.subtitle') }}</p>
    </div>

    <div class="config-section">
      <div class="form-group">
        <label for="provider-select">{{ $t('aiConfig.selectProvider') }}</label>
        <select id="provider-select" v-model="selectedProvider" @change="onProviderChange" class="select-input">
          <option
            v-for="(config, providerId) in availableProviders"
            :key="providerId"
            :value="providerId"
          >
            {{ config.icon }} {{ config.name }}
          </option>
        </select>
        <small v-if="currentProviderConfig?.description" class="form-hint">
          {{ currentProviderConfig.description }}
        </small>
      </div>

      <div v-if="currentProviderConfig?.requiresApiKey" class="form-group">
        <label for="api-key">
          {{ $t('aiConfig.apiKey') }}
          <a
            v-if="currentProviderConfig.apiKeyHelpUrl"
            :href="currentProviderConfig.apiKeyHelpUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="help-link"
          >
            {{ $t('aiConfig.getApiKey') }}
          </a>
        </label>
        <div class="input-with-button">
          <input
            id="api-key"
            v-model="apiKey"
            :type="showApiKey ? 'text' : 'password'"
            :placeholder="currentProviderConfig.apiKeyPlaceholder || $t('aiConfig.apiKeyPlaceholder')"
            class="text-input"
          />
          <button
            @click="showApiKey = !showApiKey"
            type="button"
            class="btn-icon"
            :title="showApiKey ? $t('aiConfig.hideApiKey') : $t('aiConfig.showApiKey')"
          >
            {{ showApiKey ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
        <div v-if="apiKeyValidation.message" class="validation-message" :class="apiKeyValidation.valid ? 'valid' : 'invalid'">
          {{ apiKeyValidation.message }}
        </div>
      </div>

      <div v-if="currentProviderConfig?.models && currentProviderConfig.models.length > 0" class="form-group">
        <label for="model-select">{{ $t('aiConfig.selectModel') }}</label>
        <select id="model-select" v-model="selectedModel" class="select-input">
          <option v-for="model in currentProviderConfig.models" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
        <small class="form-hint">
          {{ $t('aiConfig.modelHint') }}
        </small>
      </div>

      <div v-if="selectedProvider === 'custom'" class="form-group">
        <label for="custom-endpoint">{{ $t('aiConfig.customEndpoint') }}</label>
        <input
          id="custom-endpoint"
          v-model="customEndpoint"
          type="url"
          placeholder="https://api.example.com"
          class="text-input"
        />
        <small class="form-hint">
          {{ $t('aiConfig.customEndpointHint') }}
        </small>
      </div>

      <div v-if="selectedProvider === 'local'" class="form-group">
        <label for="ollama-url">{{ $t('aiConfig.ollamaUrl') }}</label>
        <input
          id="ollama-url"
          v-model="ollamaUrl"
          type="url"
          placeholder="http://localhost:11434"
          class="text-input"
        />
        <small class="form-hint">
          {{ $t('aiConfig.ollamaUrlHint') }}
        </small>
      </div>

      <div class="button-group">
        <button
          @click="testApiKey"
          :disabled="testingApiKey || !canTestApiKey"
          class="btn btn-secondary"
        >
          <span v-if="testingApiKey" class="spinner"></span>
          <span v-else>🔍</span>
          <span>{{ testingApiKey ? $t('aiConfig.testing') : $t('aiConfig.testApiKey') }}</span>
        </button>
        <button @click="saveConfig" :disabled="saving" class="btn btn-primary">
          <span v-if="saving" class="spinner"></span>
          <span v-else>💾</span>
          <span>{{ saving ? $t('aiConfig.saving') : $t('aiConfig.save') }}</span>
        </button>
        <button @click="resetConfig" class="btn btn-secondary">
          <span>🔄</span>
          <span>{{ $t('aiConfig.reset') }}</span>
        </button>
      </div>

      <div v-if="saveStatus.message" class="status-message" :class="saveStatus.type">
        {{ saveStatus.message }}
      </div>
    </div>

    <div class="info-section">
      <h2>{{ $t('aiConfig.currentConfig') }}</h2>
      <div class="config-display">
        <div class="config-item">
          <span class="config-label">{{ $t('aiConfig.provider') }}:</span>
          <span class="config-value">
            {{ currentProviderConfig?.icon }} {{ currentProviderConfig?.name || selectedProvider }}
          </span>
        </div>
        <div v-if="selectedModel" class="config-item">
          <span class="config-label">{{ $t('aiConfig.model') }}:</span>
          <span class="config-value">{{ selectedModel }}</span>
        </div>
        <div v-if="apiKey && currentProviderConfig?.requiresApiKey" class="config-item">
          <span class="config-label">{{ $t('aiConfig.apiKey') }}:</span>
          <span class="config-value">{{ maskApiKey(apiKey) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAIConfig } from '@shared/composables/useAIConfig.js'
import { AI_PROVIDERS, AI_PROVIDER_CONFIG } from '@core/constants/aiProviders.js'
import { initAIService } from '@core/ai/aiService.js'
import { useNotification } from '@shared/composables/useNotification.js'

export default {
  name: 'AIConfig',
  setup() {
    const { t } = useI18n()
    const { showNotification } = useNotification()
    const {
      config,
      saveConfig: saveAIConfig,
      getApiKey,
      saveApiKey,
      getDefaultModel,
      getProviderConfig,
      validateApiKey,
      testApiKey: testApiKeyService,
      loadConfig
    } = useAIConfig()

    const selectedProvider = ref(AI_PROVIDERS.ONLINE)
    const apiKey = ref('')
    const selectedModel = ref('')
    const customEndpoint = ref('')
    const ollamaUrl = ref('http://localhost:11434')
    const showApiKey = ref(false)
    const testingApiKey = ref(false)
    const saving = ref(false)
    const apiKeyValidation = ref({ valid: false, message: '' })
    const saveStatus = ref({ type: '', message: '' })

    const availableProviders = computed(() => AI_PROVIDER_CONFIG)
    const currentProviderConfig = computed(() => getProviderConfig(selectedProvider.value))

    const canTestApiKey = computed(() => {
      if (!currentProviderConfig.value?.requiresApiKey) return false
      if (!apiKey.value || apiKey.value.trim().length === 0) return false
      return true
    })

    onMounted(() => {
      loadSavedConfig()
    })

    function loadSavedConfig() {
      const savedConfig = loadConfig()
      selectedProvider.value = savedConfig.provider || AI_PROVIDERS.ONLINE
      selectedModel.value = savedConfig.model || getDefaultModel(selectedProvider.value)
      customEndpoint.value = savedConfig.customEndpoint || ''
      ollamaUrl.value = savedConfig.ollamaUrl || 'http://localhost:11434'
      
      // Load API key from secure storage
      const savedApiKey = getApiKey(selectedProvider.value)
      if (savedApiKey) {
        apiKey.value = savedApiKey
      }
    }

    function onProviderChange() {
      // Reset API key when provider changes
      apiKey.value = getApiKey(selectedProvider.value) || ''
      selectedModel.value = getDefaultModel(selectedProvider.value)
      customEndpoint.value = ''
      apiKeyValidation.value = { valid: false, message: '' }
      saveStatus.value = { type: '', message: '' }
    }

    function maskApiKey(key) {
      if (!key || key.length < 8) return '••••••••'
      return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4)
    }

    async function testApiKey() {
      if (!canTestApiKey.value) return

      testingApiKey.value = true
      apiKeyValidation.value = { valid: false, message: '' }

      try {
        // First validate format
        const formatValidation = validateApiKey(selectedProvider.value, apiKey.value)
        if (!formatValidation.valid) {
          apiKeyValidation.value = formatValidation
          testingApiKey.value = false
          return
        }

        // Then test the API key
        const result = await testApiKeyService(selectedProvider.value, apiKey.value, selectedModel.value)
        apiKeyValidation.value = {
          valid: result.success,
          message: result.message || (result.success ? t('aiConfig.apiKeyValid') : t('aiConfig.apiKeyInvalid'))
        }

        if (result.success) {
          showNotification('success', t('aiConfig.apiKeyValid'))
        } else {
          showNotification('error', result.message || t('aiConfig.apiKeyInvalid'))
        }
      } catch (error) {
        apiKeyValidation.value = {
          valid: false,
          message: error.message || t('aiConfig.testError')
        }
        showNotification('error', error.message || t('aiConfig.testError'))
      } finally {
        testingApiKey.value = false
      }
    }

    async function saveConfig() {
      saving.value = true
      saveStatus.value = { type: '', message: '' }

      try {
        // Validate API key format if required
        if (currentProviderConfig.value?.requiresApiKey && apiKey.value) {
          const validation = validateApiKey(selectedProvider.value, apiKey.value)
          if (!validation.valid) {
            saveStatus.value = {
              type: 'error',
              message: validation.message
            }
            saving.value = false
            return
          }
        }

        // Save configuration
        const configToSave = {
          provider: selectedProvider.value,
          model: selectedModel.value || getDefaultModel(selectedProvider.value),
          customEndpoint: customEndpoint.value,
          ollamaUrl: ollamaUrl.value
        }

        const saved = saveAIConfig(configToSave)

        // Save API key to secure storage
        if (apiKey.value && currentProviderConfig.value?.requiresApiKey) {
          saveApiKey(selectedProvider.value, apiKey.value)
        }

        // Initialize AI service with new config
        initAIService(selectedProvider.value, {
          apiKey: apiKey.value,
          model: selectedModel.value || getDefaultModel(selectedProvider.value),
          customEndpoint: customEndpoint.value,
          ollamaUrl: ollamaUrl.value
        })

        if (saved) {
          saveStatus.value = {
            type: 'success',
            message: t('aiConfig.saveSuccess')
          }
          showNotification('success', t('aiConfig.saveSuccess'))
        } else {
          throw new Error(t('aiConfig.saveError'))
        }
      } catch (error) {
        saveStatus.value = {
          type: 'error',
          message: error.message || t('aiConfig.saveError')
        }
        showNotification('error', error.message || t('aiConfig.saveError'))
      } finally {
        saving.value = false
      }
    }

    function resetConfig() {
      selectedProvider.value = AI_PROVIDERS.ONLINE
      apiKey.value = ''
      selectedModel.value = getDefaultModel(AI_PROVIDERS.ONLINE)
      customEndpoint.value = ''
      ollamaUrl.value = 'http://localhost:11434'
      showApiKey.value = false
      apiKeyValidation.value = { valid: false, message: '' }
      saveStatus.value = { type: '', message: '' }
    }

    return {
      AI_PROVIDERS,
      selectedProvider,
      apiKey,
      selectedModel,
      customEndpoint,
      ollamaUrl,
      showApiKey,
      testingApiKey,
      saving,
      apiKeyValidation,
      saveStatus,
      availableProviders,
      currentProviderConfig,
      canTestApiKey,
      onProviderChange,
      maskApiKey,
      testApiKey,
      saveConfig,
      resetConfig
    }
  }
}
</script>

<style scoped>
.ai-config-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.config-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.help-link {
  margin-left: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: normal;
}

.help-link:hover {
  text-decoration: underline;
}

.text-input,
.select-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.2s ease;
  appearance: menulist;
  -webkit-appearance: menulist;
  -moz-appearance: menulist;
}

.text-input:focus,
.select-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Dark mode styles for select */
[data-theme='dark'] .select-input {
  background: #1a1a1a !important;
  color: #ffffff !important;
  border-color: #3a3a3a !important;
}

[data-theme='dark'] .select-input option {
  background: #1a1a1a !important;
  color: #ffffff !important;
  padding: 0.5rem;
}

[data-theme='dark'] .select-input option:hover,
[data-theme='dark'] .select-input option:checked {
  background: #2a2a2a !important;
  color: #ffffff !important;
}

[data-theme='dark'] .select-input:hover {
  border-color: var(--primary-color) !important;
  background: #1a1a1a !important;
  color: #ffffff !important;
}

[data-theme='dark'] .select-input:focus {
  border-color: var(--primary-color) !important;
  background: #1a1a1a !important;
  color: #ffffff !important;
}

[data-theme='dark'] .select-input:focus option {
  background: #1a1a1a !important;
  color: #ffffff !important;
}

/* Light mode styles for select */
[data-theme='light'] .select-input {
  background: #f5f5f5 !important;
  color: #000000 !important;
  border-color: #e0e0e0 !important;
}

[data-theme='light'] .select-input option {
  background: #ffffff !important;
  color: #000000 !important;
  padding: 0.5rem;
}

[data-theme='light'] .select-input option:hover,
[data-theme='light'] .select-input option:checked {
  background: #f0f0f0 !important;
  color: #000000 !important;
}

[data-theme='light'] .select-input:hover {
  border-color: var(--primary-color) !important;
  background: #ffffff !important;
  color: #000000 !important;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-with-button .text-input {
  flex: 1;
}

.btn-icon {
  padding: 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.validation-message {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.validation-message.valid {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.validation-message.invalid {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--primary-color);
  background: var(--input-bg);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.status-message.success {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-message.error {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.info-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.info-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.config-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--input-bg);
  border-radius: 8px;
}

.config-label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 100px;
}

.config-value {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .ai-config-view {
    padding: 1rem;
  }

  .config-section,
  .info-section {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

