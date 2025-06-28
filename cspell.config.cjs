// https://cspell.org/docs/Configuration

"use strict";

/**
 * @type {import("@cspell/cspell-types").CSpellUserSettings}
 */
module.exports = {
	dictionaries: ["typescript", "node", "npm", "bash", "markdown"],
	enableGlobDot: true,
	ignorePaths: [
		".git/",
		// ignore auto-generated files
		".gitignore",
		"bun.lock",
		// ignore license files
		"LICENSE",
		// ignore binary files
		"*.avif",
	],
	language: "en",
	useGitignore: true,
	version: "0.2",
	words: [
		// often used
		"buni",
		// tools
		"ghalint",
		"pinact",
		"taplo",
		"yamlfmt",
		"jschema",
		"zizmor",
		// package.json
		"risu",
		"astro",
		"withastro",
		"biomejs",
		"knip",
		"commitlint",
	],
};
