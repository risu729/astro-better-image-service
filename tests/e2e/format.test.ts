import { expect, test } from "@playwright/test";

import {
	AVAILABLE_FORMAT_CONVERSIONS,
	DEFAULT_OUTPUT_FORMAT,
	// biome-ignore lint/nursery/useImportRestrictions: import required for test
} from "./fixtures/src/formats";

test.describe("Image Format Conversion", () => {
	for (const {
		inputFormat,
		outputFormat,
		path,
		name,
	} of AVAILABLE_FORMAT_CONVERSIONS) {
		test(name, async ({ page }) => {
			await page.goto(path);
			const locator = page.locator("img");
			await expect(locator).toHaveAttribute(
				"src",
				new RegExp(
					`.+.${
						outputFormat ??
						(inputFormat === "svg" ? "svg" : DEFAULT_OUTPUT_FORMAT)
					}`,
				),
			);
		});
	}
});
