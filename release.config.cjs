/**
 * @type {import("semantic-release").GlobalConfig}
 */
module.exports = {
	// default branch is master in default
	// ref: https://github.com/semantic-release/semantic-release/issues/1581
	branches: [{ name: "main" }],
};
