import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAIConfig } from "../src/shared/composables/useAIConfig.js";
import { AI_PROVIDERS } from "../src/core/constants/aiProviders.js";

describe("useAIConfig", () => {
  let localStorageMock;
  let sessionStorageMock;

  beforeEach(() => {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    global.localStorage = localStorageMock;
    global.sessionStorage = sessionStorageMock;

    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
  });

  describe("loadConfig", () => {
    it("should return default config when no saved config exists", () => {
      const { loadConfig } = useAIConfig();
      const config = loadConfig();

      expect(config).toHaveProperty("provider", AI_PROVIDERS.ONLINE);
      expect(config).toHaveProperty("apiKey", "");
      expect(config).toHaveProperty("model", "");
      expect(config).toHaveProperty("customEndpoint", "");
      expect(config).toHaveProperty("ollamaUrl", "http://localhost:11434");
    });

    it("should load saved config from localStorage", () => {
      const savedConfig = {
        provider: AI_PROVIDERS.OPENAI,
        model: "gpt-4",
        customEndpoint: "",
        ollamaUrl: "http://localhost:11434",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedConfig));

      const { loadConfig } = useAIConfig();
      const config = loadConfig();

      expect(config.provider).toBe(AI_PROVIDERS.OPENAI);
      expect(config.model).toBe("gpt-4");
    });

    it("should return default config for invalid saved config", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const { loadConfig } = useAIConfig();
      const config = loadConfig();

      expect(config.provider).toBe(AI_PROVIDERS.ONLINE);
    });
  });

  describe("saveConfig", () => {
    it("should save config to localStorage", () => {
      const { saveConfig } = useAIConfig();
      const newConfig = {
        provider: AI_PROVIDERS.CLAUDE,
        model: "claude-3-5-sonnet-20241022",
        customEndpoint: "",
        ollamaUrl: "http://localhost:11434",
      };

      const result = saveConfig(newConfig);

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.provider).toBe(AI_PROVIDERS.CLAUDE);
      expect(savedData.model).toBe("claude-3-5-sonnet-20241022");
    });

    it("should not save API key in config", () => {
      const { saveConfig } = useAIConfig();
      const newConfig = {
        provider: AI_PROVIDERS.OPENAI,
        model: "gpt-4",
        apiKey: "sk-test123",
        customEndpoint: "",
        ollamaUrl: "http://localhost:11434",
      };

      saveConfig(newConfig);

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).not.toHaveProperty("apiKey");
    });
  });

  describe("getApiKey and saveApiKey", () => {
    it("should save and retrieve API key from sessionStorage", () => {
      const { saveApiKey, getApiKey } = useAIConfig();
      const provider = AI_PROVIDERS.OPENAI;
      const apiKey = "sk-test123";

      saveApiKey(provider, apiKey);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        "ai_config_key_openai",
        apiKey,
      );

      sessionStorageMock.getItem.mockReturnValue(apiKey);
      const retrieved = getApiKey(provider);

      expect(retrieved).toBe(apiKey);
    });

    it("should return empty string when API key does not exist", () => {
      const { getApiKey } = useAIConfig();

      sessionStorageMock.getItem.mockReturnValue(null);
      const retrieved = getApiKey(AI_PROVIDERS.OPENAI);

      expect(retrieved).toBe("");
    });

    it("should remove API key when saving empty string", () => {
      const { saveApiKey } = useAIConfig();
      const provider = AI_PROVIDERS.OPENAI;

      saveApiKey(provider, "");

      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(
        "ai_config_key_openai",
      );
    });
  });

  describe("getDefaultModel", () => {
    it("should return default model for OpenAI provider", () => {
      const { getDefaultModel } = useAIConfig();
      const model = getDefaultModel(AI_PROVIDERS.OPENAI);

      expect(model).toBe("gpt-3.5-turbo");
    });

    it("should return default model for Claude provider", () => {
      const { getDefaultModel } = useAIConfig();
      const model = getDefaultModel(AI_PROVIDERS.CLAUDE);

      expect(model).toBe("claude-3-5-sonnet-20241022");
    });

    it("should return default model for Local provider", () => {
      const { getDefaultModel } = useAIConfig();
      const model = getDefaultModel(AI_PROVIDERS.LOCAL);

      expect(model).toBe("llama3.2:1b");
    });
  });

  describe("getProviderConfig", () => {
    it("should return provider config for valid provider", () => {
      const { getProviderConfig } = useAIConfig();
      const config = getProviderConfig(AI_PROVIDERS.OPENAI);

      expect(config).toBeTruthy();
      expect(config.name).toBe("OpenAI (GPT)");
      expect(config.requiresApiKey).toBe(true);
    });

    it("should return null for invalid provider", () => {
      const { getProviderConfig } = useAIConfig();
      const config = getProviderConfig("invalid-provider");

      expect(config).toBeNull();
    });
  });

  describe("validateApiKey", () => {
    it("should validate OpenAI API key format", () => {
      const { validateApiKey } = useAIConfig();

      const validResult = validateApiKey(AI_PROVIDERS.OPENAI, "sk-test123");
      expect(validResult.valid).toBe(true);

      const invalidResult = validateApiKey(AI_PROVIDERS.OPENAI, "invalid-key");
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.message).toContain("sk-");
    });

    it("should validate Claude API key format", () => {
      const { validateApiKey } = useAIConfig();

      const validResult = validateApiKey(AI_PROVIDERS.CLAUDE, "sk-ant-test123");
      expect(validResult.valid).toBe(true);

      const invalidResult = validateApiKey(AI_PROVIDERS.CLAUDE, "invalid-key");
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.message).toContain("sk-ant-");
    });

    it("should validate Gemini API key format", () => {
      const { validateApiKey } = useAIConfig();

      const validResult = validateApiKey(AI_PROVIDERS.GEMINI, "AIza-test123");
      expect(validResult.valid).toBe(true);

      const invalidResult = validateApiKey(AI_PROVIDERS.GEMINI, "invalid-key");
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.message).toContain("AIza");
    });

    it("should return error for empty API key", () => {
      const { validateApiKey } = useAIConfig();

      const result = validateApiKey(AI_PROVIDERS.OPENAI, "");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("required");
    });

    it("should return valid for providers that do not require format validation", () => {
      const { validateApiKey } = useAIConfig();

      const result = validateApiKey(AI_PROVIDERS.LOCAL, "any-key");
      expect(result.valid).toBe(true);
    });
  });

  describe("testApiKey", () => {
    it("should return success for providers that do not require API key testing", async () => {
      const { testApiKey } = useAIConfig();

      const result = await testApiKey(AI_PROVIDERS.LOCAL, "any-key");

      expect(result.success).toBe(true);
    });

    it("should test OpenAI API key", async () => {
      global.fetch = vi.fn();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
      });

      const { testApiKey } = useAIConfig();
      const result = await testApiKey(
        AI_PROVIDERS.OPENAI,
        "sk-test123",
        "gpt-3.5-turbo",
      );

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/models",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer sk-test123",
          }),
        }),
      );
    });

    it("should return error for invalid OpenAI API key", async () => {
      global.fetch = vi.fn();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      const { testApiKey } = useAIConfig();
      const result = await testApiKey(
        AI_PROVIDERS.OPENAI,
        "sk-invalid",
        "gpt-3.5-turbo",
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid");
    });

    it("should test Claude API key", async () => {
      global.fetch = vi.fn();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
      });

      const { testApiKey } = useAIConfig();
      const result = await testApiKey(
        AI_PROVIDERS.CLAUDE,
        "sk-ant-test123",
        "claude-3-5-sonnet-20241022",
      );

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/messages",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "x-api-key": "sk-ant-test123",
          }),
        }),
      );
    });

    it("should test Gemini API key", async () => {
      global.fetch = vi.fn();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
      });

      const { testApiKey } = useAIConfig();
      const result = await testApiKey(
        AI_PROVIDERS.GEMINI,
        "AIza-test123",
        "gemini-1.5-flash",
      );

      expect(result.success).toBe(true);
    });

    it("should handle network errors gracefully", async () => {
      global.fetch = vi.fn();
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      const { testApiKey } = useAIConfig();
      const result = await testApiKey(
        AI_PROVIDERS.OPENAI,
        "sk-test123",
        "gpt-3.5-turbo",
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain("Connection error");
    });
  });

  describe("clearConfig", () => {
    it("should clear all configuration from storage", () => {
      const { clearConfig } = useAIConfig();

      const result = clearConfig();

      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("ai_config");
      expect(sessionStorageMock.removeItem).toHaveBeenCalled();
    });
  });
});
