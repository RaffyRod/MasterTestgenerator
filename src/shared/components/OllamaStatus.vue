<template>
  <div v-if="show && !available" class="ollama-status-help">
    <div class="help-header">
      <span class="help-icon">💡</span>
      <strong>Ollama Not Available</strong>
    </div>
    <div class="help-content">
      <p>To use Local AI, you need to install and run Ollama:</p>
      <ol class="help-steps">
        <li>
          <strong>Install Ollama:</strong>
          <ul>
            <li>
              Windows/Mac: Download from
              <a href="https://ollama.com" target="_blank" rel="noopener">ollama.com</a>
            </li>
            <li>
              Linux:
              <code>curl -fsSL https://ollama.com/install.sh | sh</code>
            </li>
          </ul>
        </li>
        <li>
          <strong>Start Ollama</strong>
          (usually starts automatically after installation)
        </li>
        <li>
          <strong>Pull a model:</strong>
          <code>ollama pull llama3.2:1b</code>
          <small>(or llama3.2:3b for better quality)</small>
        </li>
        <li>
          <strong>Verify:</strong>
          Run
          <code>ollama list</code>
          to see available models
        </li>
      </ol>
      <p class="help-note">
        💡 The app will automatically detect Ollama once it's running. You can also use Online AI
        (Hugging Face) which doesn't require installation.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OllamaStatus',
  props: {
    available: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.ollama-status-help {
  margin-top: 1rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  border-left: 4px solid var(--warning-color);
}

[data-theme='light'] .ollama-status-help {
  background: #fff8e1 !important;
  border-color: #ffc107 !important;
}

[data-theme='dark'] .ollama-status-help {
  background: #2a2a1a !important;
  border-color: #ffc107 !important;
}

.help-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.help-icon {
  font-size: 1.25rem;
}

.help-content {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.help-content p {
  margin: 0 0 1rem 0;
}

.help-steps {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.help-steps li {
  margin-bottom: 0.75rem;
}

.help-steps code {
  background: var(--bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  display: inline-block;
  margin: 0.25rem 0;
}

.help-steps small {
  display: block;
  margin-top: 0.25rem;
  color: var(--text-tertiary);
  font-style: italic;
}

.help-steps ul {
  margin-top: 0.5rem;
  padding-left: 1.25rem;
}

.help-steps a {
  color: var(--primary-color);
  text-decoration: none;
}

.help-steps a:hover {
  text-decoration: underline;
}

.help-note {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-style: italic;
  color: var(--text-secondary);
}

[data-theme='light'] .help-content {
  color: #333333 !important;
}

[data-theme='dark'] .help-content {
  color: #e0e0e0 !important;
}
</style>
