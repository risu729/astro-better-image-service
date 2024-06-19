// ref: https://knip.dev/reference/configuration

import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreBinaries: ["mise"],
	workspaces: {
		".": {
			ignoreDependencies: [
				// mise.toml is not recognized by Knip
				"@biomejs/biome",
				"cspell",
				"ignore-sync",
				"markdownlint-cli2",
				"renovate",
				// bun run cannot be detected by Knip
				"@commitlint/cli",
				"semantic-release",
			],
			entry: ["src/index.ts", "**/scripts/**"],
		},
		"tests/e2e/fixtures": {},
	},
};

export default config;
