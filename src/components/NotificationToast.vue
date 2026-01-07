<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="['toast', `toast-${notification.type}`]"
      @click="removeNotification(notification.id)"
    >
      <span class="toast-icon">{{ notification.icon }}</span>
      <div class="toast-content">
        <p class="toast-message">{{ notification.message }}</p>
      </div>
      <button
        class="toast-close"
        @click.stop="removeNotification(notification.id)"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </TransitionGroup>
</template>

<script>
import { computed } from 'vue'
import { useNotification } from '../composables/useNotification'

export default {
  name: 'NotificationToast',
  setup() {
    const { notifications, removeNotification } = useNotification()

    return {
      notifications,
      removeNotification
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  width: calc(100% - 2rem);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  pointer-events: auto;
  transition: var(--transition);
  animation: slideInRight 0.3s ease-out;
  min-width: 280px;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: var(--shadow-lg);
}

.toast-success {
  border-left: 4px solid var(--success-color);
  background: var(--bg-secondary);
}

.toast-error {
  border-left: 4px solid var(--danger-color);
  background: var(--bg-secondary);
}

.toast-warning {
  border-left: 4px solid var(--warning-color);
  background: var(--bg-secondary);
}

.toast-info {
  border-left: 4px solid var(--info-color);
  background: var(--bg-secondary);
}

[data-theme='light'] .toast {
  background: #ffffff;
  border-color: #e0e0e0;
  color: #000000;
}

[data-theme='dark'] .toast {
  background: #1a1a1a;
  border-color: #3a3a3a;
  color: #ffffff;
}

.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
  word-wrap: break-word;
}

[data-theme='light'] .toast-message {
  color: #000000;
}

[data-theme='dark'] .toast-message {
  color: #ffffff;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: var(--transition);
  flex-shrink: 0;
  line-height: 1;
  touch-action: manipulation;
}

.toast-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-container {
    top: 70px;
    right: 0.5rem;
    left: 0.5rem;
    max-width: 100%;
    width: calc(100% - 1rem);
  }

  .toast {
    min-width: auto;
    padding: 0.875rem 1rem;
  }

  .toast-message {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .toast-container {
    top: 60px;
    right: 0.5rem;
    left: 0.5rem;
  }

  .toast {
    padding: 0.75rem;
  }

  .toast-icon {
    font-size: 1.25rem;
  }

  .toast-message {
    font-size: 0.85rem;
  }
}
</style>
