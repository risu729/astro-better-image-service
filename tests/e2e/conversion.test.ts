import { setTimeout } from "node:timers/promises";
import { expect, test } from "@playwright/test";
import { AVAILABLE_FORMAT_CONVERSIONS } from "./fixtures/src/formats.ts";

// intended to run on CI, with the expected snapshots taken with the default image service

test.describe("Consistent Image Conversion between Image Services", () => {
	for (const {
		inputFormat,
		outputFormat,
		path,
		name,
	} of AVAILABLE_FORMAT_CONVERSIONS) {
		test(name, async ({ page }) => {
			const snapshotBaseFilename = `${name.replaceAll(" ", "-")}`;

			await page.goto(path);
			// svg rendering takes longer
			if (
				inputFormat === "svg" &&
				(outputFormat === undefined || outputFormat === "svg")
			) {
				await setTimeout(1000);
			}
			await expect(page).toHaveScreenshot(`${snapshotBaseFilename}.png`, {
				fullPage: true,
				// compression config is different between services so we allow a small difference
				maxDiffPixelRatio: 0.01,
				omitBackground: true,
			});
		});
	}
});
