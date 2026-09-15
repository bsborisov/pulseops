import {
  defineConfig,
  devices,
} from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  fullyParallel: true,

  forbidOnly:
    Boolean(process.env.CI),

  retries:
    process.env.CI ? 2 : 0,

  workers:
    process.env.CI
      ? 1
      : undefined,

  reporter: "list",

  use: {
    baseURL:
      "http://127.0.0.1:5173",

    trace:
      "on-first-retry",

    screenshot:
      "only-on-failure",

    video:
      "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",

      use: {
        ...devices[
        "Desktop Chrome"
        ],
      },
    },
  ],

  webServer: [
    {
      name: "API",

      command:
        "npm run dev:api",

      url:
        "http://127.0.0.1:4000/api/health",

      reuseExistingServer:
        !process.env.CI,

      timeout: 30_000,

      stdout: "pipe",
      stderr: "pipe",
    },

    {
      name: "Web",

      command:
        "npm run dev:web -- --host 127.0.0.1",

      url:
        "http://127.0.0.1:5173",

      reuseExistingServer:
        !process.env.CI,

      timeout: 30_000,

      stdout: "pipe",
      stderr: "pipe",
    },
  ],
});