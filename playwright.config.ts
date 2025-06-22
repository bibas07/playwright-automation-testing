import { defineConfig } from "playwright/test";
import * as os from "node:os";

export default defineConfig({
  retries: process.env.CI ? 2 : 1,
  workers: 2,
  reporter: [
    ["line"],
    [
      "allure-playwright",
      {
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    video: "retry-with-video",
    screenshot: "on-first-failure",
  },
});
