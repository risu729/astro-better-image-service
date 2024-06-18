import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		// bun run cannot be detected by Knip
		"@commitlint/cli",
		"semantic-release",
	],
	workspaces: {
		".": {},
		"tests/e2e/fixtures": {},
	},
};

// biome-ignore lint/style/noDefaultExport: required for Knip config
export default config;
