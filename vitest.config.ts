import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
  },
  plugins: [tsconfigPaths()],
});
