<template>
  <Teleport to="body">
    <div v-if="show" class="plan-type-modal-overlay" @click.self="handleClose">
      <div class="plan-type-modal-container">
        <div class="modal-header">
          <h2>{{ $t("testPlan.selectType") }}</h2>
          <button
            @click="handleClose"
            class="modal-close-btn"
            :aria-label="$t('testPlan.closeModal')"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-description">
            {{ $t("testPlan.selectTypeDescription") }}
          </p>
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
          <button @click="handleClose" class="btn btn-secondary">
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="handleConfirm"
            :disabled="!selectedType"
            class="btn btn-primary"
          >
            {{ $t("testPlan.generatePlan") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "PlanTypeModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selectedType: {
      type: String,
      default: null,
    },
  },
  emits: ["close", "select", "confirm"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const testPlanTypes = computed(() => {
      const typeIds = [
        "functional",
        "performance",
        "security",
        "integration",
        "system",
        "acceptance",
        "regression",
        "comprehensive",
        "shiftLeft",
        "shiftRight",
        "continuous",
        "tdd",
        "bdd",
        "apiFirst",
        "devops",
      ];

      const icons = {
        functional: "⚙️",
        performance: "⚡",
        security: "🔒",
        integration: "🔗",
        system: "🖥️",
        acceptance: "✅",
        regression: "🔄",
        comprehensive: "📋",
        shiftLeft: "⬅️",
        shiftRight: "➡️",
        continuous: "🔄",
        tdd: "🧪",
        bdd: "📖",
        apiFirst: "🔌",
        devops: "🚀",
      };

      return typeIds.map((id) => ({
        id,
        name: t(`testPlan.planTypes.${id}.name`),
        icon: icons[id],
        description: t(`testPlan.planTypes.${id}.description`),
      }));
    });

    const handleClose = () => {
      emit("close");
    };

    const handleSelect = (typeId) => {
      emit("select", typeId);
    };

    const handleConfirm = () => {
      if (props.selectedType) {
        emit("confirm", props.selectedType);
      }
    };

    // Handle Escape key
    const handleEscape = (event) => {
      if (event.key === "Escape" && props.show) {
        handleClose();
      }
    };

    watch(
      () => props.show,
      (isVisible) => {
        if (isVisible) {
          window.addEventListener("keydown", handleEscape);
        } else {
          window.removeEventListener("keydown", handleEscape);
        }
      },
    );

    return {
      testPlanTypes,
      handleClose,
      handleSelect,
      handleConfirm,
      t,
    };
  },
};
</script>

<style scoped>
.plan-type-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 10000;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  animation: fadeIn 0.3s ease;
}

[data-theme="light"] .plan-type-modal-overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
}

.plan-type-modal-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.3s ease;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 10001;
}

[data-theme="light"] .plan-type-modal-container {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] .plan-type-modal-container {
  background: rgba(26, 26, 26, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10001;
}

[data-theme="light"] .modal-header {
  border-bottom-color: rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background: rgba(26, 26, 26, 0.2);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

[data-theme="light"] .modal-header h2 {
  color: #000000;
}

[data-theme="dark"] .modal-header h2 {
  color: #ffffff;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: var(--text-primary);
  transform: scale(1.1);
}

[data-theme="light"] .modal-close-btn {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.15);
}

[data-theme="dark"] .modal-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] .modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
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

[data-theme="light"] .modal-description {
  color: #666666;
}

[data-theme="dark"] .modal-description {
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
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 100px;
  touch-action: manipulation;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

[data-theme="light"] .plan-type-card {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(0, 0, 0, 0.1);
  color: #000000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .plan-type-card {
  background: rgba(42, 42, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.plan-type-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(91, 141, 239, 0.5);
  background: rgba(255, 255, 255, 0.8);
}

[data-theme="light"] .plan-type-card:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

[data-theme="dark"] .plan-type-card:hover {
  background: rgba(42, 42, 42, 0.75);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.plan-type-card.active {
  border-color: rgba(91, 141, 239, 0.8);
  background: rgba(91, 141, 239, 0.15);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  box-shadow:
    0 0 0 3px rgba(91, 141, 239, 0.2),
    0 6px 20px rgba(91, 141, 239, 0.15);
  transform: translateY(-2px);
}

[data-theme="light"] .plan-type-card.active {
  background: rgba(232, 242, 255, 0.9);
  border-color: rgba(91, 141, 239, 0.6);
}

[data-theme="dark"] .plan-type-card.active {
  background: rgba(42, 58, 74, 0.7);
  border-color: rgba(91, 141, 239, 0.7);
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
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  align-items: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  bottom: 0;
  z-index: 10001;
}

[data-theme="light"] .modal-footer {
  border-top-color: rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.2);
}

[data-theme="dark"] .modal-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
  background: rgba(26, 26, 26, 0.2);
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

[data-theme="light"] .btn-secondary {
  background: #e8e8e8;
  color: #000000;
  border-color: #d0d0d0;
}

[data-theme="dark"] .btn-secondary {
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
