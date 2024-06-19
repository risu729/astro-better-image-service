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

export default config;
