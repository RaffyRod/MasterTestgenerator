<template>
  <div class="test-plans-view">
    <div class="header">
      <h1>{{ $t('testPlan.title') }}</h1>
      <p class="subtitle">{{ $t('testPlan.subtitle') }}</p>
    </div>

    <div class="content-grid">
      <div class="input-section">
        <div class="form-group">
          <label for="project-info">{{ $t('testPlan.projectInfo') }}</label>
          <textarea
            id="project-info"
            v-model="projectInfo"
            :placeholder="$t('testPlan.projectInfoPlaceholder')"
            rows="10"
            class="textarea-input"
          ></textarea>
        </div>
        <div class="button-group">
          <button
            @click="openPlanTypeModal"
            :disabled="!projectInfo.trim() || loading"
            class="btn btn-primary"
          >
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? $t('testPlan.loading') : $t('testPlan.generate') }}</span>
          </button>
          <button @click="clearPlan" class="btn btn-secondary">
            <span>🗑️</span>
            <span>{{ $t('testPlan.clear') }}</span>
          </button>
        </div>
      </div>

      <div class="output-section" v-if="testPlan">
        <div class="plan-header">
          <h2>{{ testPlan.title }}</h2>
          <button @click="showExportModal = true" class="btn btn-export">
            <span>📥</span>
            <span>{{ $t('testPlan.export') }}</span>
          </button>
        </div>

        <div class="plan-content">
          <section class="plan-section">
            <h3>{{ $t('testPlan.objectives') }}</h3>
            <ul>
              <li v-for="(objective, index) in testPlan.objectives" :key="index">
                {{ objective }}
              </li>
            </ul>
          </section>

          <section class="plan-section">
            <h3>{{ $t('testPlan.scope') }}</h3>
            <div class="scope-content">
              <div>
                <h4>In Scope:</h4>
                <ul>
                  <li v-for="(item, index) in testPlan.scope.inScope" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <h4>Out of Scope:</h4>
                <ul>
                  <li v-for="(item, index) in testPlan.scope.outOfScope" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section class="plan-section">
            <h3>{{ $t('testPlan.testStrategy') }}</h3>
            <div
              v-for="(strategy, index) in testPlan.testStrategy"
              :key="index"
              class="strategy-item"
            >
              <strong>{{ strategy.type }}:</strong>
              {{ strategy.description }}
            </div>
          </section>

          <section class="plan-section">
            <h3>{{ $t('testPlan.testItems') }}</h3>
            <div class="test-items">
              <div v-for="item in testPlan.testItems" :key="item.id" class="test-item">
                <strong>{{ item.id }}:</strong>
                {{ item.name }}
              </div>
            </div>
          </section>

          <section class="plan-section">
            <h3>{{ $t('testPlan.resources') }}</h3>
            <div v-for="(resource, index) in testPlan.resources" :key="index" class="resource-item">
              <strong>{{ resource.role }}:</strong>
              {{ resource.responsibility }}
            </div>
          </section>

          <section class="plan-section">
            <h3>{{ $t('testPlan.schedule') }}</h3>
            <div v-for="(phase, index) in testPlan.schedule.phases" :key="index" class="phase-item">
              <strong>{{ phase.phase }}</strong>
              ({{ phase.duration }})
              <ul>
                <li v-for="(activity, actIndex) in phase.activities" :key="actIndex">
                  {{ activity }}
                </li>
              </ul>
            </div>
          </section>

          <section class="plan-section">
            <h3>{{ $t('testPlan.risks') }}</h3>
            <div v-for="(risk, index) in testPlan.risks" :key="index" class="risk-item">
              <div class="risk-header">
                <strong>{{ risk.risk }}</strong>
                <span class="impact-badge" :class="`impact-${risk.impact.toLowerCase()}`">
                  {{ risk.impact }}
                </span>
              </div>
              <p class="mitigation">Mitigation: {{ risk.mitigation }}</p>
            </div>
          </section>

          <section
            v-if="testPlan.recommendations && testPlan.recommendations.length > 0"
            class="plan-section recommendations-section"
          >
            <h3>💡 Recommendations</h3>
            <div
              v-for="(rec, index) in testPlan.recommendations"
              :key="index"
              class="recommendation-item"
              :class="`rec-${rec.type}`"
            >
              <div class="rec-header">
                <strong>{{ rec.type === 'warning' ? '⚠️' : '💡' }} {{ rec.message }}</strong>
                <span class="priority-badge" :class="`priority-${rec.priority.toLowerCase()}`">
                  {{ rec.priority }}
                </span>
              </div>
            </div>
          </section>

          <section v-if="testPlan.analysis" class="plan-section analysis-section">
            <h3>📊 Analysis Summary</h3>
            <div class="analysis-grid">
              <div class="analysis-item">
                <strong>Complexity:</strong>
                <span
                  class="complexity-badge"
                  :class="`complexity-${testPlan.analysis.complexity.toLowerCase()}`"
                >
                  {{ testPlan.analysis.complexity }}
                </span>
              </div>
              <div class="analysis-item">
                <strong>Estimated Test Cases:</strong>
                {{ testPlan.analysis.estimatedTestCases }}
              </div>
              <div
                class="analysis-item"
                v-if="
                  testPlan.analysis.detectedFunctionalities &&
                  testPlan.analysis.detectedFunctionalities.length > 0
                "
              >
                <strong>Detected Functionalities:</strong>
                <div class="functionality-tags">
                  <span
                    v-for="func in testPlan.analysis.detectedFunctionalities"
                    :key="func"
                    class="func-tag"
                  >
                    {{ func }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Modal for selecting test plan type -->
    <PlanTypeModal
      :show="showPlanTypeModal"
      :selected-type="selectedPlanType"
      @close="closePlanTypeModal"
      @select="selectPlanType"
      @confirm="confirmPlanType"
    />

    <!-- Modal for export format selection -->
    <div v-if="showExportModal" class="export-modal" @click.self="showExportModal = false">
      <div class="export-modal-content">
        <div class="export-modal-header">
          <h3>{{ $t('testPlan.exportFormat') || 'Select Export Format' }}</h3>
          <button @click="showExportModal = false" class="close-btn">×</button>
        </div>
        <div class="export-modal-body">
          <button @click="exportPlan('markdown')" class="export-format-btn">
            <span>📄</span>
            <span>Markdown (.md)</span>
          </button>
          <button @click="exportPlan('doc')" class="export-format-btn">
            <span>📝</span>
            <span>Word Document (.docx)</span>
          </button>
          <button @click="exportPlan('pdf')" class="export-format-btn">
            <span>📄</span>
            <span>PDF Document (.pdf)</span>
          </button>
          <button @click="exportPlan('json')" class="export-format-btn">
            <span>📋</span>
            <span>JSON (.json)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateTestPlan } from '@features/test-plans/generators/testPlanGenerator.js'
import PlanTypeModal from '@features/test-plans/components/PlanTypeModal.vue'
import {
  exportTestPlanToMarkdown,
  exportTestPlanToDoc,
  exportTestPlanToPDF,
  downloadFile
} from '@features/test-plans/utils/testPlanExport.js'
import { useNotification } from '@shared/composables/useNotification.js'

export default {
  name: 'TestPlans',
  components: {
    PlanTypeModal
  },
  setup() {
    const { t } = useI18n()
    const { showNotification } = useNotification()
    const projectInfo = ref('')
    const testPlan = ref(null)
    const loading = ref(false)
    const showPlanTypeModal = ref(false)
    const selectedPlanType = ref(null)
    const showExportModal = ref(false)

    const selectPlanType = typeId => {
      selectedPlanType.value = typeId
    }

    const confirmPlanType = typeId => {
      if (!typeId || !projectInfo.value.trim()) return
      closePlanTypeModal()
      generatePlan(typeId)
    }

    const generatePlan = async (planType = 'comprehensive') => {
      if (!projectInfo.value.trim()) {
        showNotification(t('notifications.invalidInput'), 'warning', 3000)
        return
      }

      loading.value = true
      try {
        // For now, we don't have a UI toggle for AI in test plans, but we can enable it in the future
        const useAIForTitle = false // Can be made configurable later
        testPlan.value = await generateTestPlan(projectInfo.value, planType, useAIForTitle)
        console.log('Test plan generated:', testPlan.value)
        if (testPlan.value) {
          showNotification(t('notifications.testPlanGenerated'), 'success', 4000)
        } else {
          showNotification(t('notifications.noTestPlan'), 'warning', 4000)
        }
      } catch (error) {
        console.error('Error generating test plan:', error)
        showNotification(t('notifications.testPlanError'), 'error', 5000)
      } finally {
        loading.value = false
      }
    }

    const clearPlan = () => {
      projectInfo.value = ''
      testPlan.value = null
      selectedPlanType.value = null
      showNotification(t('notifications.clearSuccess'), 'success', 2000)
    }

    const openPlanTypeModal = () => {
      selectedPlanType.value = null
      showPlanTypeModal.value = true
    }

    const closePlanTypeModal = () => {
      showPlanTypeModal.value = false
    }

    const exportPlan = async format => {
      if (!testPlan.value) {
        showNotification(t('notifications.exportError'), 'error', 3000)
        return
      }

      showExportModal.value = false

      try {
        let content
        let filename
        let mimeType

        switch (format) {
          case 'markdown':
            content = exportTestPlanToMarkdown(testPlan.value)
            filename = 'test-plan.md'
            mimeType = 'text/markdown'
            downloadFile(content, filename, mimeType)
            showNotification(t('notifications.exportSuccess'), 'success', 3000)
            break

          case 'doc':
            const blob = await exportTestPlanToDoc(testPlan.value)
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'test-plan.docx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            showNotification(t('notifications.exportSuccess'), 'success', 3000)
            break

          case 'pdf':
            const pdfDoc = exportTestPlanToPDF(testPlan.value)
            if (pdfDoc) {
              pdfDoc.save('test-plan.pdf')
              showNotification(t('notifications.exportSuccess'), 'success', 3000)
            } else {
              showNotification(t('notifications.exportError'), 'error', 4000)
            }
            break

          case 'json':
          default:
            content = JSON.stringify(testPlan.value, null, 2)
            filename = 'test-plan.json'
            mimeType = 'application/json'
            downloadFile(content, filename, mimeType)
            showNotification(t('notifications.exportSuccess'), 'success', 3000)
            break
        }
      } catch (error) {
        console.error('Error exporting test plan:', error)
        showNotification(t('notifications.exportError'), 'error', 4000)
      }
    }

    return {
      projectInfo,
      testPlan,
      loading,
      showPlanTypeModal,
      selectedPlanType,
      showExportModal,
      selectPlanType,
      confirmPlanType,
      openPlanTypeModal,
      closePlanTypeModal,
      generatePlan,
      clearPlan,
      exportPlan
    }
  }
}
</script>

<style scoped>
.test-plans-view {
  padding: 0;
  animation: fadeIn 0.4s ease-in;
}

.header {
  margin-bottom: 2rem;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .content-grid {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.input-section {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: var(--transition);
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

.output-section {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  max-height: 85vh;
  overflow-y: auto;
  position: sticky;
  top: 100px;
}

[data-theme='light'] .output-section {
  background: #ffffff !important;
  border-color: #e0e0e0 !important;
}

[data-theme='dark'] .output-section {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
}

.output-section::-webkit-scrollbar {
  width: 8px;
}

.output-section::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.output-section::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.output-section::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

.form-group {
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.625rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
  align-self: flex-start;
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
  min-height: 200px;
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
  background: var(--bg-secondary);
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 0.5rem;
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
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  visibility: visible;
  opacity: 1;
  min-height: 44px;
  touch-action: manipulation;
  vertical-align: middle;
  line-height: 1.5;
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

.btn-export {
  background: var(--success-color);
  color: white;
  padding: 0.625rem 1.25rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-export:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.export-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.export-modal-content {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

[data-theme='light'] .export-modal-content {
  background: #ffffff !important;
  border-color: #e0e0e0 !important;
}

[data-theme='dark'] .export-modal-content {
  background: var(--bg-primary) !important;
  border-color: var(--border-color) !important;
}

.export-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.export-modal-header h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: var(--transition);
  touch-action: manipulation;
}

.close-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.close-btn:hover {
  background: var(--bg-secondary);
}

.export-modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.export-format-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  width: 100%;
  min-height: 56px;
  touch-action: manipulation;
}

.export-format-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

[data-theme='light'] .export-format-btn {
  background: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
  color: #000000 !important;
}

[data-theme='dark'] .export-format-btn {
  background: #1a1a1a !important;
  border-color: #3a3a3a !important;
  color: #ffffff !important;
}

.export-format-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.export-format-btn span:first-child {
  font-size: 1.5rem;
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

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  flex-wrap: wrap;
  gap: 1rem;
}

.plan-header h2 {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 700;
}

.plan-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan-section {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.plan-section:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
}

.plan-section h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

[data-theme='light'] .plan-section h3 {
  color: #000000 !important;
}

[data-theme='dark'] .plan-section h3 {
  color: #ffffff !important;
}

.plan-section h3::before {
  content: '▸';
  color: var(--primary-color);
}

.plan-section ul {
  margin-left: 1.5rem;
  margin-top: 0.75rem;
  list-style-type: disc;
}

.plan-section li {
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.scope-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.scope-content h4 {
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.strategy-item,
.resource-item,
.test-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--primary-color);
  transition: var(--transition);
}

.strategy-item:hover,
.resource-item:hover,
.test-item:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.test-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.phase-item {
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--info-color);
  transition: var(--transition);
}

.phase-item:hover {
  background: var(--bg-tertiary);
  transform: translateX(5px);
}

.risk-item {
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--warning-color);
  transition: var(--transition);
}

.risk-item:hover {
  background: var(--bg-tertiary);
  border-color: var(--warning-color);
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.impact-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.impact-high {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.impact-medium {
  background: rgba(255, 152, 0, 0.2);
  color: var(--warning-color);
}

.mitigation {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 0.75rem;
  line-height: 1.6;
}

.recommendations-section {
  border-left: 4px solid var(--info-color);
}

.recommendation-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 6px;
  border-left: 3px solid var(--info-color);
}

.rec-warning {
  border-left-color: var(--warning-color);
}

.rec-suggestion {
  border-left-color: var(--info-color);
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.priority-high {
  background: rgba(244, 67, 54, 0.2);
  color: var(--danger-color);
}

.priority-medium {
  background: rgba(255, 152, 0, 0.2);
  color: var(--warning-color);
}

.analysis-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid var(--primary-color);
}

.analysis-grid {
  display: grid;
  gap: 1rem;
}

.analysis-item {
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.complexity-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.complexity-high {
  background: rgba(244, 67, 54, 0.2);
  color: var(--danger-color);
}

.complexity-medium {
  background: rgba(255, 152, 0, 0.2);
  color: var(--warning-color);
}

.complexity-low {
  background: rgba(76, 175, 80, 0.2);
  color: var(--success-color);
}

.functionality-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.func-tag {
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .output-section {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .scope-content {
    grid-template-columns: 1fr;
  }

  .input-section,
  .output-section {
    padding: 1.5rem;
  }

  .plan-section {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.75rem;
  }

  .input-section,
  .output-section {
    padding: 1rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
