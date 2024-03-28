import { defineConfig } from "@playwright/test";

// biome-ignore lint/style/noDefaultExport: required for Playwright config
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
		// don't build automatically in CI to see logs
		command: `${process.env["CI"] ? "" : "bun run build && "}bun run preview`,
		cwd: "tests/e2e/fixtures",
		url: "http://localhost:4321",
		// set to 5 minutes because image optimization can take a while
		timeout: 5 * 60 * 1000,
	},
});
