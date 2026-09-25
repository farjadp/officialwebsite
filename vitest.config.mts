// ============================================================================
// Hardware Source: vitest.config.ts
// Version: 1.0.0 — 2026-09-25
// Why: The repo had no test runner. These tests cover the pure functions of
//      the content engine only — no database, no network, no React.
// Env / Identity: Local dev and CI (`npm test`)
// ============================================================================

import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
    test: {
        include: ["src/**/__tests__/**/*.test.ts"],
        environment: "node",
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
