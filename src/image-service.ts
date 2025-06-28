import type {
	ImageOutputFormat,
	ImageTransform,
	LocalImageService,
} from "astro";
import { baseService } from "astro/assets";
import { isESMImportedImage } from "astro/assets/utils";
import type { FormatEnum } from "sharp";
import sharp from "sharp";
import { optimize as svgo } from "svgo";
import {
	type BaseServiceTransform,
	parseQuality,
	qualityTable,
	type VALID_OUTPUT_FORMATS,
} from "./astro-internals.js";
import type { MergedConfig } from "./config.js";

type OutputFormat = Extract<
	keyof FormatEnum,
	(typeof VALID_OUTPUT_FORMATS)[number]
>;

/**
 * Image service with better compression for Astro
 */
const betterImageService: LocalImageService<MergedConfig> = {
	// biome-ignore lint/style/useNamingConvention: following the Astro API
	// biome-ignore lint/style/noNonNullAssertion: optional method but baseService implements it
	getHTMLAttributes: baseService.getHTMLAttributes!,

	// biome-ignore lint/style/noNonNullAssertion: optional method but baseService implements it
	getSrcSet: baseService.getSrcSet!,
	// biome-ignore lint/style/useNamingConvention: following the Astro API
	getURL: baseService.getURL,

	// biome-ignore lint/style/useNamingConvention: following the Astro API
	parseURL: baseService.parseURL,

	// based on sharp image service
	// https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/sharp.ts#L44-L89
	// biome-ignore lint/nursery/useExplicitType: type should be inferred
	async transform(
		inputBuffer,
		transformOptions,
		config,
	): Promise<{
		data: Uint8Array;
		format: ImageOutputFormat;
	}> {
		const imageServiceConfig = config.service.config;

		const { width, height, format, quality } =
			transformOptions as BaseServiceTransform & {
				format: OutputFormat;
			};

		// SVG to SVG optimization
		if (format === "svg") {
			const svgString = new TextDecoder().decode(inputBuffer);
			const result = svgo(svgString, imageServiceConfig.svgo);
			return {
				data: new TextEncoder().encode(result.data),
				format: "svg",
			};
		}

		// SVG or raster image to raster image optimization
		const result = sharp(inputBuffer, imageServiceConfig.sharp.sharp);

		// cspell:ignore exif
		// always call rotate to adjust for EXIF data orientation
		result.rotate();

		// Never resize using both width and height at the same time, prioritizing width.
		if (height && !width) {
			result.resize({ height: Math.round(height) });
		} else if (width) {
			result.resize({ width: Math.round(width) });
		}

		let sharpQuality: number | undefined;
		if (quality) {
			const parsedQuality = parseQuality(quality);
			if (typeof parsedQuality === "number") {
				sharpQuality = parsedQuality;
			} else {
				sharpQuality =
					quality in qualityTable ? qualityTable[quality] : undefined;
			}
		}

		result.toFormat(format, {
			quality: sharpQuality,
			...imageServiceConfig.sharp[format === "jpg" ? "jpeg" : format],
		});

		const { data, info } = await result.toBuffer({ resolveWithObject: true });

		return {
			data,
			format: info.format as ImageOutputFormat,
		};
	},

	// biome-ignore lint/nursery/useExplicitType: type should be inferred
	async validateOptions(options, imageConfig): Promise<ImageTransform> {
		// save the original format for later use, because baseService.validateOptions
		// changes the options.format to SVG if options.src.format is SVG
		// ref: https://github.com/withastro/astro/blob/8d5ea2df5d52ad9a311c407533b9f4226480faa8/packages/astro/src/assets/services/service.ts#L200-L203
		const targetFormat = options.format;

		// biome-ignore lint/style/noNonNullAssertion: optional method but baseService implements it
		const result = await baseService.validateOptions!(options, imageConfig);

		// restore the original format
		if (
			isESMImportedImage(options.src) &&
			options.src.format === "svg" &&
			targetFormat
		) {
			result.format = targetFormat;
		}
		return result;
	},
};

// biome-ignore lint/style/noDefaultExport: required for Astro image service
export default betterImageService;
