import type { UserConfig } from "@commitlint/types";

const commitlintConfig: UserConfig = {
	extends: ["@commitlint/config-conventional"],
};

// biome-ignore lint/style/noDefaultExport: required for commitlint config
export default commitlintConfig;
