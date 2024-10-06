import { $ } from "bun";
// cspell:ignore rcompare
import { parse, rcompare, satisfies } from "semver";
import packageJson from "../../../package.json" with { type: "json" };

$.throws(true);

const peerRange = packageJson.peerDependencies.astro as string;

const versions = (await $`npm view astro versions --json`.json()) as string[];

const versionsInRange = versions
	.filter((version) => satisfies(version, peerRange))
	// sort in descending order
	.sort(rcompare);

const versionsToTest = Object.values(
	Object.groupBy(versionsInRange, (version) => {
		const semver = parse(version);
		if (!semver) {
			throw new Error(`Invalid version: ${version}`);
		}
		return `${semver.major}.${semver.minor}`;
	}),
)
	// test the latest 5 versions for the latest minor version, and the latest version for the rest
	.flatMap((versions, index) => versions?.slice(0, index === 0 ? 5 : 1))
	.filter((version) => version !== undefined);

console.write(JSON.stringify(versionsToTest));
