// ref: https://knip.dev/reference/configuration

import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreBinaries: ["mise"],
	workspaces: {
		".": {
			ignoreDependencies: [
				// mise.toml is not recognized
				"@biomejs/biome",
				"cspell",
				"ignore-sync",
				"markdownlint-cli2",
				"renovate",
				// bun run cannot be detected
				"@commitlint/cli",
				"semantic-release",
			],
			entry: ["src/index.ts", "**/scripts/**"],
			// peerDependencies are not recognized as plugins
			astro: true,
		},
		"tests/e2e/fixtures": {
			ignoreBinaries: ["astro"],
		},
	},
};

export default config;
