<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="export-preview-overlay"
        @click.self="close"
        @keydown.escape="close"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="export-preview-modal" @click.stop>
          <div class="modal-header">
            <h2 id="modal-title">{{ $t("export.preview") }}</h2>
            <button
              @click="close"
              class="close-btn"
              :aria-label="$t('export.closeModal')"
              @keydown.enter="close"
            >
              &times;
            </button>
          </div>

          <div class="modal-content">
            <div class="preview-info">
              <div class="info-item">
                <strong>{{ $t("export.tool") }}:</strong>
                {{ toolName }}
              </div>
              <div class="info-item">
                <strong>{{ $t("export.columns") }}:</strong>
                {{ previewData.columns.length }}
              </div>
              <div class="info-item">
                <strong>{{ $t("export.rows") }}:</strong>
                {{ previewData.rows.length }}
              </div>
            </div>

            <p class="preview-note">{{ $t("export.previewNote") }}</p>

            <div class="preview-table-container">
              <table class="preview-table">
                <thead>
                  <tr>
                    <th v-for="column in previewData.columns" :key="column">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in previewData.rows.slice(0, 5)"
                    :key="index"
                  >
                    <td v-for="column in previewData.columns" :key="column">
                      {{ formatCellValue(row[column]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="previewData.rows.length > 5" class="more-rows">
                {{
                  $t("export.moreRows", { count: previewData.rows.length - 5 })
                }}
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button
              @click="download"
              class="btn btn-download"
              @keydown.enter="download"
              :aria-label="$t('export.download')"
            >
              <span>📥</span>
              <span>{{ $t("export.download") }}</span>
            </button>
            <button
              @click="close"
              class="btn btn-cancel"
              @keydown.enter="close"
              :aria-label="$t('export.close')"
            >
              {{ $t("export.close") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { watch, onMounted, onUnmounted } from "vue";

export default {
  name: "ExportPreview",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    previewData: {
      type: Object,
      default: () => ({ columns: [], rows: [] }),
    },
    toolName: {
      type: String,
      default: "",
    },
  },
  emits: ["close", "download"],
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };

    const download = () => {
      emit("download");
    };

    const formatCellValue = (value) => {
      if (!value) return "-";
      if (typeof value === "string" && value.length > 50) {
        return value.substring(0, 50) + "...";
      }
      return value;
    };

    // Trap focus within modal when open
    const handleTabKey = (e) => {
      if (!props.show) return;

      const modal = document.querySelector(".export-preview-modal");
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    watch(
      () => props.show,
      (isOpen) => {
        if (isOpen) {
          document.body.style.overflow = "hidden";
          setTimeout(() => {
            const modal = document.querySelector(".export-preview-modal");
            if (modal) {
              const firstButton = modal.querySelector("button");
              if (firstButton) firstButton.focus();
            }
          }, 100);
        } else {
          document.body.style.overflow = "";
        }
      },
    );

    onMounted(() => {
      document.addEventListener("keydown", handleTabKey);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && props.show) {
          close();
        }
      });
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", handleTabKey);
      document.body.style.overflow = "";
    });

    return {
      close,
      download,
      formatCellValue,
    };
  },
};
</script>

<style scoped>
.export-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;
  padding: 1rem;
}

[data-theme="light"] .export-preview-overlay {
  background: rgba(0, 0, 0, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.export-preview-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-enter-active {
  transition: opacity 0.2s ease;
}

.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-active .export-preview-modal {
  animation: slideUp 0.3s ease-out;
}

.modal-leave-active .export-preview-modal {
  animation: slideUp 0.2s ease-in reverse;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%);
  border-radius: 16px 16px 0 0;
}

[data-theme="light"] .modal-header {
  background: var(--bg-secondary);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-header h2::before {
  content: "👁️";
  font-size: 1.25rem;
}

.close-btn {
  background: var(--bg-tertiary);
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.modal-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

.preview-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.info-item {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.info-item strong {
  color: var(--text-primary);
  margin-right: 0.5rem;
  font-weight: 600;
}

.preview-note {
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 3px solid var(--info-color);
}

.preview-table-container {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.preview-table thead {
  background: var(--primary-gradient);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.preview-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
  font-size: 0.95rem;
}

.preview-table td {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  max-width: 300px;
  word-wrap: break-word;
  color: var(--text-secondary);
  background: var(--bg-primary);
}

.preview-table tbody tr:hover {
  background: var(--bg-secondary);
}

.preview-table tbody tr:nth-child(even) {
  background: var(--bg-tertiary);
}

.preview-table tbody tr:nth-child(even):hover {
  background: var(--bg-secondary);
}

.more-rows {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.modal-footer {
  padding: 1.75rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: var(--bg-secondary);
  border-radius: 0 0 16px 16px;
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

.btn-download {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-cancel {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--bg-primary);
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .export-preview-modal {
    max-width: 95%;
  }

  .preview-table-container {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .export-preview-overlay {
    padding: 0.5rem;
    align-items: flex-end;
  }

  .export-preview-modal {
    width: 100%;
    max-height: 95vh;
    border-radius: 16px 16px 0 0;
    animation: slideUpMobile 0.3s ease-out;
  }

  @keyframes slideUpMobile {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1.25rem;
  }

  .modal-header {
    border-radius: 16px 16px 0 0;
  }

  .preview-info {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .info-item {
    font-size: 0.9rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.75rem;
    border-radius: 0 0 16px 16px;
  }

  .btn {
    width: 100%;
    justify-content: center;
    min-height: 48px;
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .preview-table-container {
    border-radius: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .preview-table {
    font-size: 0.8rem;
    min-width: 600px;
  }

  .preview-table th,
  .preview-table td {
    padding: 0.75rem 0.5rem;
    white-space: nowrap;
  }

  .preview-table td {
    white-space: normal;
    word-break: break-word;
  }

  .close-btn {
    min-width: 44px;
    min-height: 44px;
  }
}

@media (max-width: 480px) {
  .export-preview-overlay {
    padding: 0;
  }

  .export-preview-modal {
    max-height: 100vh;
    border-radius: 16px 16px 0 0;
    width: 100%;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-header h2 {
    font-size: 1.125rem;
  }

  .modal-header h2::before {
    font-size: 1rem;
  }

  .modal-content {
    padding: 1rem;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .preview-info {
    padding: 0.875rem;
    gap: 0.75rem;
  }

  .info-item {
    font-size: 0.85rem;
  }

  .preview-note {
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  .preview-table {
    font-size: 0.7rem;
    min-width: 500px;
  }

  .preview-table th,
  .preview-table td {
    padding: 0.5rem 0.375rem;
    max-width: 120px;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column-reverse;
  }

  .btn {
    min-height: 48px;
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }

  .close-btn {
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
  }
}
</style>
