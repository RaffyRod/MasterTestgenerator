import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@core": fileURLToPath(new URL("./src/core", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
      "@i18n": fileURLToPath(new URL("./src/i18n", import.meta.url)),
      "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
    },
  },
  server: {
    port: parseInt(process.env.PORT) || 3000,
    strictPort: false,
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    deps: {
      inline: ["@exodus/bytes", "html-encoding-sniffer"],
    },
    reporters:
      process.env.CI || process.env.VITEST_CI
        ? ["default", "junit", "json"]
        : ["default"],
    outputFile:
      process.env.CI || process.env.VITEST_CI
        ? {
            junit: "./test-results/junit.xml",
            json: "./test-results/results.json",
          }
        : undefined,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        "**/*.config.js",
        "**/setup.js",
      ],
    },
  },
});
