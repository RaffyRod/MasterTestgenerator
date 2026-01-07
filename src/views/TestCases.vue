<template>
  <div class="test-cases-view">
    <div class="header">
      <h1>{{ $t('testCase.title') }}</h1>
      <p class="subtitle">{{ $t('testCase.subtitle') }}</p>
    </div>

    <div class="input-section">
      <div class="form-group">
        <label for="project-info">{{ $t('testCase.projectInfo') }}</label>
        <textarea
          id="project-info"
          v-model="projectInfo"
          :placeholder="$t('testCase.projectInfoPlaceholder')"
          rows="8"
          class="textarea-input"
        ></textarea>
      </div>

      <div class="form-group">
        <label>{{ $t('testCase.format') }}</label>
        <div class="format-options">
          <label class="radio-option">
            <input type="radio" v-model="format" value="stepByStep" />
            <div class="radio-label-content">
              <span class="radio-label-text">{{ $t('testCase.stepByStep') }}</span>
            </div>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="format" value="gherkin" />
            <div class="radio-label-content">
              <span class="radio-label-text">{{ $t('testCase.gherkin') }}</span>
            </div>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="tests-per-ac" class="form-label">
          {{ $t('testCase.testsPerAC') || 'Test Cases per Acceptance Criteria' }}
        </label>
        <select id="tests-per-ac" v-model="testsPerAC" class="select-input">
          <option :value="1">1 {{ $t('testCase.testCase') || 'Test Case' }}</option>
          <option :value="2">2 {{ $t('testCase.testCases') || 'Test Cases' }}</option>
          <option :value="3">3 {{ $t('testCase.testCases') || 'Test Cases' }}</option>
          <option :value="4">4 {{ $t('testCase.testCases') || 'Test Cases' }}</option>
          <option :value="5">5 {{ $t('testCase.testCases') || 'Test Cases' }}</option>
        </select>
        <small class="form-hint">
          {{
            $t('testCase.testsPerACHint') ||
            'Generate multiple test case variations for each acceptance criteria'
          }}
        </small>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="useAIEnhancement" class="ai-toggle" />
          <span>🤖 {{ $t('testCase.useAI') || 'Use AI Enhancement' }}</span>
        </label>
        <div v-if="useAIEnhancement" class="ai-options">
          <label class="radio-option">
            <input type="radio" v-model="aiProvider" :value="AI_PROVIDERS.ONLINE" />
            <div class="radio-label-content">
              <span class="radio-label-text">🌐 Online AI (Hugging Face)</span>
            </div>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="aiProvider" :value="AI_PROVIDERS.LOCAL" />
            <div class="radio-label-content">
              <span class="radio-label-text">
                💻 Local AI (Ollama)
                <span v-if="ollamaAvailable" class="status-badge available">✓ Available</span>
                <span v-else class="status-badge unavailable">⚠ Not Available</span>
              </span>
            </div>
          </label>
        </div>
        <OllamaStatus
          v-if="useAIEnhancement && aiProvider === AI_PROVIDERS.LOCAL"
          :available="ollamaAvailable"
          :show="!ollamaAvailable"
        />
      </div>

      <div class="button-group">
        <button
          @click="generateTestCases"
          :disabled="!projectInfo.trim() || loading"
          class="btn btn-primary"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>✨</span>
          <span>{{ loading ? $t('testCase.loading') : $t('testCase.generate') }}</span>
        </button>
        <button @click="clearTestCases" class="btn btn-secondary">
          <span>🗑️</span>
          <span>{{ $t('testCase.clear') }}</span>
        </button>
      </div>
    </div>

    <div v-if="testCases.length > 0" class="test-cases-section">
      <div class="section-header">
        <h2>{{ $t('testCase.testCases') }} ({{ testCases.length }})</h2>
        <div class="export-controls">
          <select v-model="selectedTool" class="tool-select">
            <option value="">{{ $t('testCase.selectTool') }}</option>
            <option v-for="tool in testManagementTools" :key="tool.id" :value="tool.id">
              {{ tool.icon }} {{ tool.name }}
            </option>
          </select>
          <button @click="showPreview" :disabled="!selectedTool" class="btn btn-preview">
            <span>👁️</span>
            <span>{{ $t('testCase.preview') }}</span>
          </button>
          <button @click="exportCSV" :disabled="!selectedTool" class="btn btn-export">
            <span>📥</span>
            <span>{{ $t('testCase.export') }}</span>
          </button>
        </div>
      </div>

      <div class="test-cases-grid">
        <article
          v-for="testCase in testCases"
          :key="testCase.id"
          class="test-case-card"
          :aria-label="`Test case: ${testCase.title}`"
        >
          <header class="card-header">
            <h3 class="card-title">{{ testCase.title }}</h3>
            <div class="badges">
              <span
                class="badge badge-priority"
                :class="`priority-${testCase.priority.toLowerCase()}`"
                :aria-label="`Priority: ${testCase.priority}`"
              >
                {{ testCase.priority }}
              </span>
              <span class="badge badge-type" :aria-label="`Type: ${testCase.type}`">
                {{ testCase.type }}
              </span>
            </div>
          </header>

          <div class="card-content">
            <section v-if="testCase.preconditions" class="field">
              <strong>{{ $t('testCase.preconditions') }}:</strong>
              <p>{{ testCase.preconditions }}</p>
            </section>

            <section class="field">
              <strong>{{ $t('testCase.steps') }}:</strong>
              <pre class="steps-content" role="textbox" aria-label="Test steps">{{
                testCase.steps
              }}</pre>
            </section>

            <section class="field">
              <strong>{{ $t('testCase.expectedResult') }}:</strong>
              <p>{{ testCase.expectedResult }}</p>
            </section>
          </div>
        </article>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>{{ $t('testCase.noTestCases') }}</p>
    </div>

    <ExportPreview
      :show="showExportPreview"
      :preview-data="previewData"
      :tool-name="selectedToolName"
      @close="closePreview"
      @download="handleDownload"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  generateTestCases,
  configureAI,
  checkOllamaAvailability,
  AI_PROVIDERS
} from '../utils/testCaseGenerator'
import { initAIService } from '../services/aiService'
import { TEST_MANAGEMENT_TOOLS, exportToCSV, getPreviewData, downloadCSV } from '../utils/csvExport'
import ExportPreview from '../components/ExportPreview.vue'
import OllamaStatus from '../components/OllamaStatus.vue'

export default {
  name: 'TestCases',
  components: {
    ExportPreview,
    OllamaStatus
  },
  setup() {
    const { locale } = useI18n()
    const projectInfo = ref('')
    const format = ref('stepByStep')
    const testsPerAC = ref(1)
    const testCases = ref([])
    const loading = ref(false)
    const selectedTool = ref('')
    const showExportPreview = ref(false)
    const useAIEnhancement = ref(false)
    const aiProvider = ref(AI_PROVIDERS.ONLINE)
    const ollamaAvailable = ref(false)

    const testManagementTools = TEST_MANAGEMENT_TOOLS

    const selectedToolName = computed(() => {
      const tool = testManagementTools.find(t => t.id === selectedTool.value)
      return tool ? tool.name : ''
    })

    const previewData = computed(() => {
      if (!selectedTool.value || testCases.value.length === 0) {
        return { columns: [], rows: [] }
      }
      return getPreviewData(testCases.value, selectedTool.value)
    })

    const checkOllama = async () => {
      try {
        // Get Ollama URL from environment or use default
        const ollamaUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'
        ollamaAvailable.value = await checkOllamaAvailability(ollamaUrl)

        if (ollamaAvailable.value && aiProvider.value === AI_PROVIDERS.LOCAL) {
          configureAI(true, AI_PROVIDERS.LOCAL)
          initAIService(AI_PROVIDERS.LOCAL, ollamaUrl)
        } else if (aiProvider.value === AI_PROVIDERS.ONLINE) {
          configureAI(true, AI_PROVIDERS.ONLINE)
          initAIService(AI_PROVIDERS.ONLINE)
        } else {
          configureAI(false)
        }
      } catch (error) {
        console.error('Error checking Ollama:', error)
        ollamaAvailable.value = false
      }
    }

    const generateTestCasesHandler = async () => {
      if (!projectInfo.value.trim()) {
        console.warn('Project info is empty')
        return
      }

      loading.value = true

      try {
        // Configure AI based on user selection
        if (useAIEnhancement.value) {
          await checkOllama()
        } else {
          configureAI(false)
        }

        const generated = await generateTestCases(
          projectInfo.value,
          format.value,
          locale.value,
          useAIEnhancement.value,
          testsPerAC.value
        )

        if (Array.isArray(generated) && generated.length > 0) {
          testCases.value = generated
          console.log('Test cases generated:', testCases.value.length)
        } else {
          console.warn('No test cases generated, but no error occurred')
          // Fallback: create at least one test case
          testCases.value = [
            {
              id: 1,
              title: 'Test Case: ' + projectInfo.value.substring(0, 50),
              priority: 'Medium',
              type: 'Functional',
              preconditions: 'System is ready',
              steps:
                format.value === 'gherkin'
                  ? 'Given The System Is In A Valid State\nWhen The User Performs The Required Action\nThen The Expected Result Should Be Achieved'
                  : '1. Navigate to the application\n2. Perform the required action\n3. Verify the expected result',
              expectedResult: 'Operation completes successfully'
            }
          ]
        }
      } catch (error) {
        console.error('Error generating test cases:', error)
        // Show error to user
        alert(
          `Error generating test cases: ${error.message}. Falling back to intelligent analyzer.`
        )
        // Fallback to non-AI generation
        try {
          const generated = await generateTestCases(
            projectInfo.value,
            format.value,
            locale.value,
            false
          )
          if (Array.isArray(generated) && generated.length > 0) {
            testCases.value = generated
          }
        } catch (fallbackError) {
          console.error('Fallback generation also failed:', fallbackError)
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      // Check Ollama availability on mount
      await checkOllama()

      // Also check periodically if Local AI is selected
      const checkInterval = setInterval(async () => {
        if (aiProvider.value === AI_PROVIDERS.LOCAL) {
          await checkOllama()
        }
      }, 10000) // Check every 10 seconds

      // Cleanup on unmount
      onUnmounted(() => {
        clearInterval(checkInterval)
      })
    })

    // Watch for provider changes
    watch(aiProvider, async newProvider => {
      if (newProvider === AI_PROVIDERS.LOCAL) {
        await checkOllama()
      }
    })

    const clearTestCases = () => {
      projectInfo.value = ''
      testCases.value = []
      selectedTool.value = ''
    }

    const showPreview = () => {
      if (!selectedTool.value) return
      showExportPreview.value = true
    }

    const closePreview = () => {
      showExportPreview.value = false
    }

    const handleDownload = () => {
      exportCSV()
      closePreview()
    }

    const exportCSV = () => {
      if (!selectedTool.value || testCases.value.length === 0) return

      const csvContent = exportToCSV(testCases.value, selectedTool.value)
      const tool = testManagementTools.find(t => t.id === selectedTool.value)
      const filename = `test-cases-${tool?.name.toLowerCase() || 'export'}-${Date.now()}.csv`
      downloadCSV(csvContent, filename)
    }

    return {
      projectInfo,
      format,
      testsPerAC,
      testCases,
      loading,
      selectedTool,
      testManagementTools,
      selectedToolName,
      previewData,
      showExportPreview,
      useAIEnhancement,
      aiProvider,
      ollamaAvailable,
      generateTestCases: generateTestCasesHandler,
      clearTestCases,
      showPreview,
      closePreview,
      handleDownload,
      exportCSV,
      AI_PROVIDERS
    }
  }
}
</script>

<style scoped>
.test-cases-view {
  padding: 0;
  animation: fadeIn 0.4s ease-in;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: 100vh;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme='light'] .header h1 {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
}

[data-theme='dark'] .header h1 {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.input-section {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
  transition: var(--transition);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

[data-theme='light'] .input-section {
  background: #ffffff !important;
  border-color: #e0e0e0 !important;
}

[data-theme='dark'] .input-section {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
}

.input-section:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label,
.form-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
  visibility: visible;
  opacity: 1;
}

[data-theme='light'] .form-group label {
  color: #000000 !important;
}

[data-theme='dark'] .form-group label {
  color: #ffffff !important;
}

.textarea-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  resize: vertical;
  transition: var(--transition);
  background: var(--bg-secondary);
  color: var(--text-primary);
  min-height: 180px;
}

.textarea-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.textarea-input::placeholder {
  color: var(--text-tertiary);
}

[data-theme='light'] .textarea-input {
  font-family: inherit;
}

.format-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1.25rem 1.75rem;
  border-radius: 12px;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex: 1;
  min-width: 200px;
  color: var(--text-primary);
  position: relative;
}

[data-theme='light'] .radio-option {
  background: #f0f0f0 !important;
  color: #000000 !important;
  border-color: #d0d0d0 !important;
}

[data-theme='dark'] .radio-option {
  background: #1a1a1a !important;
  color: #ffffff !important;
  border-color: #3a3a3a !important;
}

.radio-option:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

[data-theme='light'] .radio-option:hover {
  background: #e0e0e0 !important;
  color: #000000 !important;
}

[data-theme='dark'] .radio-option:hover {
  background: #2a2a2a !important;
  color: #ffffff !important;
}

.radio-option input[type='radio'] {
  cursor: pointer;
  width: 20px;
  height: 20px;
  accent-color: var(--primary-color);
  flex-shrink: 0;
  margin: 0;
  position: relative;
  z-index: 1;
  align-self: center;
}

.radio-label-content {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 0.75rem;
}

.radio-label-text {
  font-size: 1rem;
  line-height: 1.5;
  color: inherit;
  display: flex;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  min-width: auto;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--primary-gradient) !important;
  color: white !important;
  box-shadow: var(--shadow-sm);
  visibility: visible !important;
  opacity: 1 !important;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
  visibility: visible !important;
  opacity: 1 !important;
}

[data-theme='light'] .btn-secondary {
  background: #e8e8e8 !important;
  color: #000000 !important;
  border-color: #d0d0d0 !important;
}

[data-theme='dark'] .btn-secondary {
  background: #2a2a2a !important;
  color: #ffffff !important;
  border-color: #3a3a3a !important;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

[data-theme='light'] .btn-secondary:hover {
  background: #d8d8d8 !important;
  color: #000000 !important;
}

[data-theme='dark'] .btn-secondary:hover {
  background: #3a3a3a !important;
  color: #ffffff !important;
}

.btn-preview {
  background: var(--info-color);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-preview:hover:not(:disabled) {
  background: #1976d2;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-export {
  background: var(--success-color);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-export:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.test-cases-section {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
}

[data-theme='light'] .test-cases-section {
  background: #ffffff !important;
  border-color: #e0e0e0 !important;
}

[data-theme='dark'] .test-cases-section {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.section-header h2 {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 700;
}

[data-theme='light'] .section-header h2 {
  color: #000000 !important;
}

[data-theme='dark'] .section-header h2 {
  color: #ffffff !important;
}

.export-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.tool-select {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  min-width: 220px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: var(--transition);
}

.tool-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.test-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.test-case-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-left: 3px solid var(--primary-color);
  transition: var(--transition);
  position: relative;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

[data-theme='light'] .test-case-card {
  background: #fafafa !important;
  color: #000000 !important;
  border-color: #e0e0e0 !important;
}

[data-theme='dark'] .test-case-card {
  background: #1a1a1a !important;
  color: #ffffff !important;
  border-color: #3a3a3a !important;
}

.test-case-card:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  gap: 1rem;
  min-width: 0;
  flex-wrap: wrap;
}

.card-title {
  color: var(--text-primary);
  font-size: 1.15rem;
  margin: 0;
  flex: 1;
  min-width: 0;
  font-weight: 600;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme='light'] .card-title {
  color: #000000 !important;
}

[data-theme='dark'] .card-title {
  color: #ffffff !important;
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-end;
}

.badge {
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-priority {
  color: white;
}

.priority-high {
  background: var(--danger-color);
}

.priority-medium {
  background: var(--warning-color);
}

.priority-low {
  background: var(--success-color);
}

.badge-type {
  background: var(--info-color);
  color: white;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
  flex: 1;
}

.field {
  color: var(--text-secondary);
  min-width: 0;
  width: 100%;
}

.field strong {
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.field p {
  margin: 0;
  line-height: 1.7;
  color: var(--text-secondary);
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.steps-content {
  background: var(--bg-tertiary);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 0;
  line-height: 1.7;
  color: var(--text-primary);
  overflow-x: auto;
  overflow-y: auto;
  max-height: 400px;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

[data-theme='light'] .steps-content {
  background: #f5f5f5 !important;
}

[data-theme='dark'] .steps-content {
  background: #2a2a2a !important;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px dashed var(--border-color);
  color: var(--text-secondary);
}

.empty-state::before {
  content: '📝';
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

@media (max-width: 1200px) {
  .test-cases-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  }
}

@media (max-width: 1024px) {
  .test-cases-grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 1.25rem;
  }

  .test-case-card {
    padding: 1.25rem;
  }
}

@media (max-width: 768px) {
  .test-cases-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
    margin-bottom: 0;
  }

  .export-controls {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }

  .tool-select {
    width: 100%;
    min-width: 100%;
  }

  .format-options {
    flex-direction: column;
  }

  .radio-option {
    min-width: 100%;
  }

  .input-section,
  .test-cases-section {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .badges {
    width: 100%;
    justify-content: flex-start;
  }

  .steps-content {
    max-height: 300px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.75rem;
  }

  .input-section,
  .test-cases-section {
    padding: 1rem;
  }

  .button-group,
  .export-controls {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .test-case-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1rem;
    -webkit-line-clamp: 2;
  }

  .steps-content {
    max-height: 250px;
    font-size: 0.8rem;
    padding: 0.75rem;
  }

  .field strong {
    font-size: 0.9rem;
  }

  .field p {
    font-size: 0.9rem;
  }

  .section-header h2 {
    font-size: 1.25rem;
  }
}

.ai-toggle {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.ai-options {
  margin-top: 1rem;
  padding-left: 1.5rem;
  border-left: 2px solid var(--border-color);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.status-badge.available {
  background: var(--success-color);
  color: white;
}

.status-badge.unavailable {
  background: var(--warning-color);
  color: white;
}

.status-hint {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
  font-style: italic;
}

[data-theme='light'] .status-hint {
  color: #666666 !important;
}

[data-theme='dark'] .status-hint {
  color: #b0b0b0 !important;
}

.select-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: var(--transition);
  margin-top: 0.5rem;
  display: block;
  visibility: visible;
  opacity: 1;
  appearance: menulist;
  -webkit-appearance: menulist;
  -moz-appearance: menulist;
}

.select-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

[data-theme='light'] .select-input {
  background: #f5f5f5 !important;
  color: #000000 !important;
  border-color: #e0e0e0 !important;
}

[data-theme='dark'] .select-input {
  background: #1a1a1a !important;
  color: #ffffff !important;
  border-color: #3a3a3a !important;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

[data-theme='light'] .form-hint {
  color: #666666 !important;
}

[data-theme='dark'] .form-hint {
  color: #e0e0e0 !important;
}
</style>
