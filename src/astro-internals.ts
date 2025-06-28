// copy-pasted from Astro's source code because it's not exported

import type { ImageQualityPreset } from "astro";
import type { SharpOptions } from "sharp";

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/consts.ts#L28
export const VALID_OUTPUT_FORMATS = [
	"avif",
	"png",
	"webp",
	"jpeg",
	"jpg",
	"svg",
] as const;

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/service.ts#L113-L119
export type BaseServiceTransform = {
	src: string;
	width?: number;
	height?: number;
	format: string;
	quality?: string | null;
};

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/service.ts#L19-L26
export const parseQuality = (quality: string): string | number => {
	const result = Number.parseInt(quality, 10);
	if (Number.isNaN(result)) {
		return quality;
	}
	return result;
};

// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/sharp.ts#L20
export const qualityTable: Record<ImageQualityPreset, number> = {
	high: 80,
	low: 25,
	max: 100,
	mid: 50,
};

// import type { SharpImageServiceConfig } from "astro/config"; // NOT available in Astro 5 anymore
// https://github.com/withastro/astro/blob/a6a4a66f10d85363b90ff4b7cd5bdd8c2b3c81fb/packages/astro/src/assets/services/sharp.ts#L11
export interface SharpImageServiceConfig {
	/**
	 * The `limitInputPixels` option passed to Sharp. See https://sharp.pixelplumbing.com/api-constructor for more information
	 */
	limitInputPixels?: SharpOptions["limitInputPixels"];
}
