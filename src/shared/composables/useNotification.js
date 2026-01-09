import { ref } from "vue";

const notifications = ref([]);

let notificationIdCounter = 0;

export function useNotification() {
  const showNotification = (message, type = "info", duration = 5000) => {
    const id = ++notificationIdCounter;

    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    const notification = {
      id,
      message,
      type,
      icon: icons[type] || icons.info,
    };

    notifications.value.push(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
  };

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAll,
  };
}
