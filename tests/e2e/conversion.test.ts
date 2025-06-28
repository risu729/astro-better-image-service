import { readdir } from "node:fs/promises";
import process from "node:process";
import { setTimeout } from "node:timers/promises";
import { expect, test } from "@playwright/test";
// biome-ignore lint/nursery/useImportRestrictions: import required for test
import { AVAILABLE_FORMAT_CONVERSIONS } from "./fixtures/src/formats.ts";

// intended to run on CI, with the expected snapshots taken with the default image service

test.describe("Consistent Image Conversion between Image Services", () => {
	for (const {
		inputFormat,
		outputFormat,
		path,
		name,
	} of AVAILABLE_FORMAT_CONVERSIONS) {
		test(name, async ({ page }, { snapshotDir }) => {
			const snapshotBaseFilename = `${name.replaceAll(" ", "-")}`;

			let snapshots: string[] = [];
			// use try-catch instead of exists to avoid race condition
			try {
				snapshots = await readdir(snapshotDir);
			} catch (_) {
				// ignore error and assume snapshots do not exist
			}

			// test fails if snapshot does not exist, so we need to check if it exists
			if (
				snapshots.some((snapshot) => snapshot.includes(snapshotBaseFilename))
			) {
				test.fail(
					inputFormat === "svg" &&
						(outputFormat === "jpeg" || outputFormat === "jpg"),
					"svg with transparent background to jpeg/jpg conversion results in black background when using astro-better-image-service",
				);
			}

			await page.goto(path);
			// svg rendering takes longer (svg is always converted to svg when using sharpImageService)
			if (
				inputFormat === "svg" &&
				(process.env["USE_DEFAULT_IMAGE_SERVICE"] ||
					outputFormat === undefined ||
					outputFormat === "svg")
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
