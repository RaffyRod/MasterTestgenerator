/**
 * AI Provider Constants
 * Centralized constants for AI service providers
 */

export const AI_PROVIDERS = {
  LOCAL: "local",
  ONLINE: "online",
  OPENAI: "openai",
  CLAUDE: "claude",
  GEMINI: "gemini",
  CUSTOM: "custom",
};

export const DEFAULT_OLLAMA_URL = "http://localhost:11434";

/**
 * AI Provider Configuration
 * Configuration for each AI provider including endpoints, models, and requirements
 */
export const AI_PROVIDER_CONFIG = {
  [AI_PROVIDERS.LOCAL]: {
    name: "Local AI (Ollama)",
    icon: "💻",
    description: "Run AI models locally on your machine",
    requiresApiKey: false,
    endpoint: DEFAULT_OLLAMA_URL,
    defaultModel: "llama3.2:1b",
    models: ["llama3.2:1b", "llama3.2:3b", "llama3.2"],
  },
  [AI_PROVIDERS.ONLINE]: {
    name: "Online AI (Hugging Face)",
    icon: "🌐",
    description: "Cloud-based AI service",
    requiresApiKey: false,
    endpoint: "https://api-inference.huggingface.co",
    defaultModel: "microsoft/Phi-3-mini-4k-instruct",
    models: [
      "microsoft/Phi-3-mini-4k-instruct",
      "meta-llama/Meta-Llama-3-8B-Instruct",
    ],
  },
  [AI_PROVIDERS.OPENAI]: {
    name: "OpenAI (GPT)",
    icon: "🤖",
    description: "OpenAI GPT models (GPT-4, GPT-3.5)",
    requiresApiKey: true,
    endpoint: "https://api.openai.com/v1",
    defaultModel: "gpt-3.5-turbo",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"],
    apiKeyPlaceholder: "sk-...",
    apiKeyHelpUrl: "https://platform.openai.com/api-keys",
  },
  [AI_PROVIDERS.CLAUDE]: {
    name: "Anthropic Claude",
    icon: "🧠",
    description: "Anthropic Claude models",
    requiresApiKey: true,
    endpoint: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
    ],
    apiKeyPlaceholder: "sk-ant-...",
    apiKeyHelpUrl: "https://console.anthropic.com/settings/keys",
  },
  [AI_PROVIDERS.GEMINI]: {
    name: "Google Gemini",
    icon: "💎",
    description: "Google Gemini models",
    requiresApiKey: true,
    endpoint: "https://generativelanguage.googleapis.com/v1",
    defaultModel: "gemini-1.5-flash",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"],
    apiKeyPlaceholder: "AIza...",
    apiKeyHelpUrl: "https://makersuite.google.com/app/apikey",
  },
  [AI_PROVIDERS.CUSTOM]: {
    name: "Custom Provider",
    icon: "⚙️",
    description: "Custom AI provider with custom endpoint",
    requiresApiKey: true,
    endpoint: "",
    defaultModel: "",
    models: [],
    apiKeyPlaceholder: "Enter API key...",
    apiKeyHelpUrl: "",
  },
};
