#!/usr/bin/env bun
//MISE description="List astro versions to test"
//MISE hide=true
//MISE depends=["buni --silent"]

import { $ } from "bun";
import { compare, parse, satisfies } from "semver";
import packageJson from "../../package.json" with { type: "json" };

const peerRange: string = packageJson.peerDependencies.astro;

const allVersions =
	(await $`npm view astro versions --json`.json()) as string[];

const versionsInRange: string[] = allVersions
	.filter((version) => satisfies(version, peerRange))
	.sort(compare);

const groupedVersions: Record<string, string[] | undefined> = Object.groupBy(
	versionsInRange,
	(version) => {
		const semver = parse(version);
		if (!semver) {
			throw new Error(`Invalid version: ${version}`);
		}
		return `${semver.major}.${semver.minor}`;
	},
);

const versionsToTest: string[] = [
	...new Set([
		// oldest 3 versions
		...versionsInRange.slice(0, 3),
		// oldest version of each major version
		...Object.entries(groupedVersions)
			.filter(([key]) => key.endsWith(".0"))
			.map(([, versions]) => versions?.at(0)),
		// latest version of each minor version
		...Object.values(groupedVersions).map((versions) => versions?.at(-1)),
		// latest 5 versions
		...versionsInRange.slice(-5),
	]),
].filter((version) => version !== undefined);

console.write(JSON.stringify(versionsToTest));
