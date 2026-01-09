<template>
  <Teleport to="body">
    <div v-if="show" class="plan-type-modal-overlay" @click.self="handleClose">
      <div class="plan-type-modal-container">
        <div class="modal-header">
          <h2>Select Test Plan Type</h2>
          <button @click="handleClose" class="modal-close-btn" aria-label="Close modal">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">Choose the type of test plan you want to generate:</p>
          <div class="plan-type-grid">
            <button
              v-for="type in testPlanTypes"
              :key="type.id"
              @click="handleSelect(type.id)"
              class="plan-type-card"
              :class="{ active: selectedType === type.id }"
            >
              <span class="plan-type-icon">{{ type.icon }}</span>
              <h3>{{ type.name }}</h3>
              <p>{{ type.description }}</p>
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="handleClose" class="btn btn-secondary">Cancel</button>
          <button @click="handleConfirm" :disabled="!selectedType" class="btn btn-primary">
            Generate Plan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PlanTypeModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectedType: {
      type: String,
      default: null
    }
  },
  emits: ['close', 'select', 'confirm'],
  setup(props, { emit }) {
    const testPlanTypes = [
      {
        id: 'functional',
        name: 'Functional Test Plan',
        icon: '⚙️',
        description: 'Tests functional requirements and user stories'
      },
      {
        id: 'performance',
        name: 'Performance Test Plan',
        icon: '⚡',
        description: 'Tests system performance, load, and stress'
      },
      {
        id: 'security',
        name: 'Security Test Plan',
        icon: '🔒',
        description: 'Tests security vulnerabilities and threats'
      },
      {
        id: 'integration',
        name: 'Integration Test Plan',
        icon: '🔗',
        description: 'Tests integration between components and systems'
      },
      {
        id: 'system',
        name: 'System Test Plan',
        icon: '🖥️',
        description: 'End-to-end system testing'
      },
      {
        id: 'acceptance',
        name: 'Acceptance Test Plan',
        icon: '✅',
        description: 'User acceptance testing (UAT)'
      },
      {
        id: 'regression',
        name: 'Regression Test Plan',
        icon: '🔄',
        description: 'Tests to ensure existing functionality still works'
      },
      {
        id: 'comprehensive',
        name: 'Comprehensive Test Plan',
        icon: '📋',
        description: 'Complete test plan covering all test types'
      },
      {
        id: 'shiftLeft',
        name: 'Shift-Left Test Plan',
        icon: '⬅️',
        description: 'Early testing in SDLC, TDD, unit and integration tests'
      },
      {
        id: 'shiftRight',
        name: 'Shift-Right Test Plan',
        icon: '➡️',
        description: 'Production testing, monitoring, and user feedback'
      },
      {
        id: 'continuous',
        name: 'Continuous Testing Plan',
        icon: '🔄',
        description: 'CI/CD integrated testing with automated pipelines'
      },
      {
        id: 'tdd',
        name: 'TDD Test Plan',
        icon: '🧪',
        description: 'Test-Driven Development methodology'
      },
      {
        id: 'bdd',
        name: 'BDD Test Plan',
        icon: '📖',
        description: 'Behavior-Driven Development with Gherkin scenarios'
      },
      {
        id: 'apiFirst',
        name: 'API-First Test Plan',
        icon: '🔌',
        description: 'API contract testing and integration validation'
      },
      {
        id: 'devops',
        name: 'DevOps Test Plan',
        icon: '🚀',
        description: 'Testing in DevOps pipeline with automation focus'
      }
    ]

    const handleClose = () => {
      emit('close')
    }

    const handleSelect = typeId => {
      emit('select', typeId)
    }

    const handleConfirm = () => {
      if (props.selectedType) {
        emit('confirm', props.selectedType)
      }
    }

    // Handle Escape key
    const handleEscape = event => {
      if (event.key === 'Escape' && props.show) {
        handleClose()
      }
    }

    watch(
      () => props.show,
      isVisible => {
        if (isVisible) {
          window.addEventListener('keydown', handleEscape)
        } else {
          window.removeEventListener('keydown', handleEscape)
        }
      }
    )

    return {
      testPlanTypes,
      handleClose,
      handleSelect,
      handleConfirm
    }
  }
}
</script>

<style scoped>
.plan-type-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 10000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

[data-theme='light'] .plan-type-modal-overlay {
  background: rgba(0, 0, 0, 0.4);
}

.plan-type-modal-container {
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 10001;
}

[data-theme='light'] .plan-type-modal-container {
  background: #ffffff;
  border-color: #e0e0e0;
}

[data-theme='dark'] .plan-type-modal-container {
  background: #1a1a1a;
  border-color: #3a3a3a;
}

@media (min-width: 1024px) {
  .plan-type-modal-overlay {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .plan-type-modal-container {
    width: 800px !important;
    max-width: 800px !important;
    margin: 0 !important;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  background: var(--bg-primary);
  position: sticky;
  top: 0;
  z-index: 10001;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

[data-theme='light'] .modal-header h2 {
  color: #000000;
}

[data-theme='dark'] .modal-header h2 {
  color: #ffffff;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
  line-height: 1;
}

.modal-close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

.modal-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

[data-theme='light'] .modal-description {
  color: #666666;
}

[data-theme='dark'] .modal-description {
  color: #e0e0e0;
}

.plan-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .plan-type-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .plan-type-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.plan-type-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 100px;
  touch-action: manipulation;
}

.plan-type-card:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .plan-type-card {
    padding: 0.875rem;
    min-height: 95px;
  }

  .plan-type-card h3 {
    font-size: 0.85rem;
  }

  .plan-type-card p {
    font-size: 0.7rem;
  }

  .plan-type-icon {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .plan-type-card {
    padding: 0.75rem;
    min-height: 90px;
    gap: 0.4rem;
  }

  .plan-type-icon {
    font-size: 1.5rem;
  }

  .plan-type-card h3 {
    font-size: 0.8rem;
  }

  .plan-type-card p {
    font-size: 0.65rem;
    line-height: 1.3;
  }
}

[data-theme='light'] .plan-type-card {
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #000000;
}

[data-theme='dark'] .plan-type-card {
  background: #2a2a2a;
  border-color: #3a3a3a;
  color: #ffffff;
}

.plan-type-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.plan-type-card.active {
  border-color: var(--primary-color);
  background: var(--bg-tertiary);
  box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.2);
}

[data-theme='light'] .plan-type-card.active {
  background: #e8f2ff;
  border-color: #5b8def;
}

[data-theme='dark'] .plan-type-card.active {
  background: #2a3a4a;
  border-color: #5b8def;
}

.plan-type-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.plan-type-card h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.plan-type-card p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  align-items: center;
  flex-shrink: 0;
  background: var(--bg-primary);
  position: sticky;
  bottom: 0;
  z-index: 10001;
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
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

[data-theme='light'] .btn-secondary {
  background: #e8e8e8;
  color: #000000;
  border-color: #d0d0d0;
}

[data-theme='dark'] .btn-secondary {
  background: #2a2a2a;
  color: #ffffff;
  border-color: #3a3a3a;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .plan-type-modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .plan-type-grid {
    grid-template-columns: 1fr;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>
