import { setTimeout } from "node:timers/promises";
import { expect, test } from "@playwright/test";
// biome-ignore lint/nursery/useImportRestrictions: import required for test
import { AVAILABLE_FORMAT_CONVERSIONS } from "./fixtures/src/formats.ts";

test.describe("Visual Regression", () => {
	for (const {
		inputFormat,
		outputFormat,
		path,
		name,
	} of AVAILABLE_FORMAT_CONVERSIONS) {
		test(name, async ({ page }) => {
			await page.goto(path);
			// svg rendering takes longer
			if (
				inputFormat === "svg" &&
				(outputFormat === undefined || outputFormat === "svg")
			) {
				await setTimeout(1000);
			}
			await expect(page).toHaveScreenshot(`${name.replaceAll(" ", "-")}.png`, {
				fullPage: true,
				// to detect changes of image quality
				maxDiffPixelRatio: 0,
				omitBackground: true,
			});
		});
	}
});
