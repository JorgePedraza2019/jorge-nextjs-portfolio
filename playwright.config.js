// playwright.config.js
import { defineConfig } from "@playwright/test"; // Import defineConfig from Playwright

export default defineConfig({
  // Specify the browsers to test against
  projects: [
    {
      name: "Chromium",
      use: { browserName: "chromium" }, // Testing in Chromium
    },
    {
      name: "Firefox",
      use: { browserName: "firefox" }, // Testing in Firefox
    },
    {
      name: "WebKit",
      use: { browserName: "webkit" }, // Testing in WebKit (Safari)
    },
  ],
  testMatch: /.*\.spec\.js/, // Only read files that end with .spec.js
});
