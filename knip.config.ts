import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		// used in .husky/commit-msg, but knip doesn't work properly for bun run
		"@commitlint/cli",
	],
	workspaces: {
		".": {},
		"tests/e2e/fixtures": {},
	},
};

// biome-ignore lint/style/noDefaultExport: required for Knip config
export default config;
