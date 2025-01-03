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
				// referenced in resolved config of commitlint.config.ts but not a dependency
				"conventional-changelog-conventionalcommits",
			],
			entry: ["src/index.ts", "**/scripts/**", "tasks/**"],
			// peerDependencies are not recognized as plugins
			astro: true,
			// mise tools are not recognized as plugins
			cspell: true,
		},
		"tests/e2e/fixtures": {},
	},
};

export default config;
