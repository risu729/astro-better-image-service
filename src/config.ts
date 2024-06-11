// import from astro instead of astro/config because ImageServiceConfig in astro/config is not generic
import type { ImageServiceConfig } from "astro";
import type { SharpImageServiceConfig } from "astro/config";
import type {
	AvifOptions,
	JpegOptions,
	PngOptions,
	SharpOptions,
	WebpOptions,
} from "sharp";
import type { Config as SvgoConfig } from "svgo";

interface LibrariesConfig {
	/**
	 * Configuration for sharp.
	 */
	sharp?: {
		/**
		 * Configuration for sharp constructor.
		 */
		sharp?: SharpOptions;
		png?: PngOptions;
		jpeg?: JpegOptions;
		webp?: WebpOptions;
		avif?: AvifOptions;
	};
	/**
	 * Configuration for svgo.
	 */
	svgo?: SvgoConfig;
}

/**
 * Type of the configuration for the image optimization libraries.
 */
export type Config = LibrariesConfig & SharpImageServiceConfig;

/**
 * Type of the merged configuration for the image optimization libraries.
 */
export type MergedConfig = Omit<
	Required<Config>,
	"sharp" | "limitInputPixels"
> & {
	sharp: Required<Required<Config>["sharp"]>;
};

/**
 * Default configuration for the image optimization libraries.
 */
export const defaultConfig = {
	sharp: {
		sharp: {
			failOnError: false,
			pages: -1,
		},
		png: {
			compressionLevel: 9,
			palette: true,
			effort: 10,
		},
		jpeg: {
			// cspell:ignore mozjpeg
			mozjpeg: true,
		},
		webp: {
			effort: 6,
		},
		avif: {
			// cspell:ignore subsampling
			chromaSubsampling: "4:2:0",
			effort: 9,
		},
	},
	svgo: {
		// cspell:ignore multipass
		multipass: true,
		js2svg: {
			indent: 0,
			pretty: false,
		},
		plugins: [
			{
				name: "preset-default",
				params: {
					overrides: {
						// viewBox is important for some use cases
						// ref: https://github.com/svg/svgo/issues/1128
						removeViewBox: false,
					},
				},
			},
		],
	},
} as const satisfies Required<LibrariesConfig>;

/**
 * Create an Astro image service configuration that uses the better image service.
 * @param config Configuration for the image optimization libraries.
 * @returns Astro image service configuration.
 */
export const betterImageService = (
	config: Config & SharpImageServiceConfig = {},
): ImageServiceConfig<MergedConfig> => {
	if (
		"limitInputPixels" in config &&
		config.sharp?.sharp &&
		"limitInputPixels" in config.sharp.sharp
	) {
		throw new Error(
			"limitInputPixels should not be set in both the root and sharp.sharp configuration. It is recommended to set it in the sharp.sharp configuration.",
		);
	}
	return {
		entrypoint: "astro-better-image-service/image-service",
		config: {
			// shallow merge for sharp configuration
			sharp: {
				sharp: {
					...defaultConfig.sharp.sharp,
					...("limitInputPixels" in config
						? { limitInputPixels: config.limitInputPixels }
						: {}),
					...(config.sharp?.sharp ?? {}),
				},
				png: {
					...defaultConfig.sharp.png,
					...(config.sharp?.png ?? {}),
				},
				jpeg: {
					...defaultConfig.sharp.jpeg,
					...(config.sharp?.jpeg ?? {}),
				},
				webp: {
					...defaultConfig.sharp.webp,
					...(config.sharp?.webp ?? {}),
				},
				avif: {
					...defaultConfig.sharp.avif,
					...(config.sharp?.avif ?? {}),
				},
			},
			// shallow merge for svgo configuration except for js2svg
			svgo: {
				...defaultConfig.svgo,
				...(config.svgo ?? {}),
				js2svg: {
					...defaultConfig.svgo.js2svg,
					...(config.svgo?.js2svg ?? {}),
				},
			},
		},
	};
};
