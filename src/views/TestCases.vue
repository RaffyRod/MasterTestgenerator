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
            <input
              type="radio"
              v-model="format"
              value="stepByStep"
            />
            <span>{{ $t('testCase.stepByStep') }}</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              v-model="format"
              value="gherkin"
            />
            <span>{{ $t('testCase.gherkin') }}</span>
          </label>
        </div>
      </div>

      <div class="button-group">
        <button @click="generateTestCases" :disabled="!projectInfo.trim() || loading" class="btn btn-primary">
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
          <button 
            @click="showPreview" 
            :disabled="!selectedTool" 
            class="btn btn-preview"
          >
            <span>👁️</span>
            <span>{{ $t('testCase.preview') }}</span>
          </button>
          <button 
            @click="exportCSV" 
            :disabled="!selectedTool" 
            class="btn btn-export"
          >
            <span>📥</span>
            <span>{{ $t('testCase.export') }}</span>
          </button>
        </div>
      </div>

      <div class="test-cases-grid">
        <div v-for="testCase in testCases" :key="testCase.id" class="test-case-card">
          <div class="card-header">
            <h3>{{ testCase.title }}</h3>
            <div class="badges">
              <span class="badge badge-priority" :class="`priority-${testCase.priority.toLowerCase()}`">
                {{ testCase.priority }}
              </span>
              <span class="badge badge-type">{{ testCase.type }}</span>
            </div>
          </div>
          
          <div class="card-content">
            <div v-if="testCase.preconditions" class="field">
              <strong>{{ $t('testCase.preconditions') }}:</strong>
              <p>{{ testCase.preconditions }}</p>
            </div>
            
            <div class="field">
              <strong>{{ $t('testCase.steps') }}:</strong>
              <pre class="steps-content">{{ testCase.steps }}</pre>
            </div>
            
            <div class="field">
              <strong>{{ $t('testCase.expectedResult') }}:</strong>
              <p>{{ testCase.expectedResult }}</p>
            </div>
          </div>
        </div>
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
import { ref, computed } from 'vue'
import { generateTestCases } from '../utils/testCaseGenerator'
import { TEST_MANAGEMENT_TOOLS, exportToCSV, getPreviewData, downloadCSV } from '../utils/csvExport'
import ExportPreview from '../components/ExportPreview.vue'

export default {
  name: 'TestCases',
  components: {
    ExportPreview
  },
  setup() {
    const projectInfo = ref('')
    const format = ref('stepByStep')
    const testCases = ref([])
    const loading = ref(false)
    const selectedTool = ref('')
    const showExportPreview = ref(false)

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

    const generateTestCasesHandler = () => {
      if (!projectInfo.value.trim()) return
      
      loading.value = true
      setTimeout(() => {
        testCases.value = generateTestCases(projectInfo.value, format.value)
        loading.value = false
      }, 500)
    }

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
      testCases,
      loading,
      selectedTool,
      testManagementTools,
      selectedToolName,
      previewData,
      showExportPreview,
      generateTestCases: generateTestCasesHandler,
      clearTestCases,
      showPreview,
      closePreview,
      handleDownload,
      exportCSV
    }
  }
}
</script>

<style scoped>
.test-cases-view {
  padding: 0;
  animation: fadeIn 0.4s ease-in;
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
}

.input-section:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
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

[data-theme="light"] .textarea-input {
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
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  flex: 1;
  min-width: 200px;
}

.radio-option:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.radio-option input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
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
  to { transform: rotate(360deg); }
}

.test-cases-section {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.test-case-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-left: 3px solid var(--primary-color);
  transition: var(--transition);
  position: relative;
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
}

.card-header h3 {
  color: var(--text-primary);
  font-size: 1.15rem;
  margin: 0;
  flex: 1;
  font-weight: 600;
  line-height: 1.4;
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
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
}

.field {
  color: var(--text-secondary);
}

.field strong {
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.field p {
  margin: 0;
  line-height: 1.7;
  color: var(--text-secondary);
}

.steps-content {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  line-height: 1.7;
  color: var(--text-primary);
  overflow-x: auto;
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

@media (max-width: 1024px) {
  .test-cases-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .test-cases-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .export-controls {
    flex-direction: column;
    width: 100%;
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
  }
  
  .btn {
    width: 100%;
  }
  
  .test-case-card {
    padding: 1rem;
  }
}
</style>

