// ref: https://playwright.dev/docs/test-configuration

import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	reporter: "html",
	fullyParallel: true,
	forbidOnly: !!process.env["CI"],

	use: {
		// biome-ignore lint/style/useNamingConvention: following Playwright's naming convention
		baseURL: "http://localhost:4321",
	},

	webServer: {
		command: "mise run test:e2e:fixtures:server",
		url: "http://localhost:4321",
		// set to 5 minutes because image optimization can take a while
		timeout: 5 * 60 * 1000,
	},
});
