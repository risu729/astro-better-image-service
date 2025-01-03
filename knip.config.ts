// ref: https://knip.dev/reference/configuration

import type { KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			ignoreBinaries: [
				// mise tools are not detected as binaries
				"semantic-release",
			],
			ignoreDependencies: [
				// cannot be detected automatically
				"@commitlint/cli",
				"markdownlint-cli2",
			],
			entry: ["src/index.ts", "**/scripts/**"],
			// peerDependencies are not recognized as plugins
			astro: true,
			// mise tools are not recognized as plugins
			cspell: true,
		},
		"tests/e2e/fixtures": {},
	},
};

export default config;
