// ref: https://commitlint.js.org/reference/configuration.html
import type { UserConfig } from "@commitlint/types";

const commitlintConfig: UserConfig = {
	extends: ["@commitlint/config-conventional"],
};

export default commitlintConfig;
