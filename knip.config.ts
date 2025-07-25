// ref: https://knip.dev/reference/configuration

import type { KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			// peerDependencies are not recognized as plugins
			astro: true,
			// mise tools are not recognized as plugins
			cspell: true,
			entry: [
				"src/index.ts",
				"tasks/**",
				// knip doesn't have bun:test plugin
				"tests/unit/*.test.ts",
			],
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
		},
		"tests/e2e/fixtures": {},
	},
};

export default config;
