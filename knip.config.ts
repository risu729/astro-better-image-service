import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		// used in .husky/commit-msg, but knip doesn't work properly for bun run
		"@commitlint/cli",
		// sharp cannot be added to dependencies because of the Bun's bug
		// ref: https://github.com/oven-sh/bun/issues/7729#issuecomment-2024889852
		"sharp",
	],
	workspaces: {
		".": {},
		"tests/e2e/fixtures": {},
	},
};

// biome-ignore lint/style/noDefaultExport: required for Knip config
export default config;
