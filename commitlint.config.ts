// ref: https://commitlint.js.org/reference/configuration.html

import conventionalConfig from "@commitlint/config-conventional";
import type { UserConfig } from "@commitlint/types";

const excludeQuestions: string[] = [
	// exclude isIssueAffected, issuesBody, and issues because I link branches to issues using GitHub
	"isIssueAffected",
	"issuesBody",
	"issues",
] satisfies (keyof typeof conventionalConfig.prompt.questions)[];

const commitlintConfig: UserConfig = {
	// do not use extends because we cannot exclude properties from the parent
	...conventionalConfig,
	prompt: {
		...conventionalConfig.prompt,
		questions: Object.fromEntries(
			Object.entries(conventionalConfig.prompt.questions).filter(
				([key]) => !excludeQuestions.includes(key),
			),
		),
	},
};

export default commitlintConfig;
