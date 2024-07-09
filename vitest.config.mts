import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    watch: false,
    include: [],
    exclude: [],
    coverage: {
      provider: "v8",
      include: [],
      exclude: [],
    },
    benchmark: {
      include: [],
      exclude: [],
    },
    setupFiles: [],
  },
})
