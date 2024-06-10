import { describe, expect, test } from "bun:test";
// biome-ignore lint/nursery/useImportRestrictions:
import { betterImageService, defaultConfig } from "../../src/config";

describe("default config", () => {
	test("should load the default config", () => {
		const config = betterImageService();
		expect(config.config).toEqual(defaultConfig);
	});
});

describe("limitInputPixels config", () => {
	test("should override the default limitInputPixels config", () => {
		const config = betterImageService({ limitInputPixels: 100 });
		expect(config.config?.["sharp"].sharp.limitInputPixels).toBe(100);
	});

	test("should throw an error if limitInputPixels is set in both the root and sharp.sharp configuration", () => {
		expect(() =>
			betterImageService({
				limitInputPixels: true,
				sharp: {
					sharp: {
						limitInputPixels: true,
					},
				},
			}),
		).toThrow();
	});
});

describe("sharp config", () => {
	test("should override the default sharp config", () => {
		const config = betterImageService({
			sharp: {
				sharp: {
					pages: 0,
				},
			},
		});
		expect(config.config?.["sharp"].sharp.pages).toBe(0);
	});

	test("should shallow merge with the default sharp config", () => {
		const config = betterImageService({
			sharp: {
				sharp: {
					limitInputPixels: 100,
				},
			},
		});
		expect(config.config?.["sharp"].sharp.pages).toBe(
			defaultConfig.sharp.sharp.pages,
		);
	});

	test("should override the default png config", () => {
		const config = betterImageService({
			sharp: {
				png: {
					compressionLevel: 5,
				},
			},
		});
		expect(config.config?.["sharp"].png.compressionLevel).toBe(5);
	});

	test("should shallow merge with the default png config", () => {
		const config = betterImageService({
			sharp: {
				png: {
					progressive: true,
				},
			},
		});
		expect(config.config?.["sharp"].png.compressionLevel).toBe(
			defaultConfig.sharp.png.compressionLevel,
		);
	});

	test("should override the default jpeg config", () => {
		const config = betterImageService({
			sharp: {
				jpeg: {
					// cspell:ignore mozjpeg
					mozjpeg: false,
				},
			},
		});
		expect(config.config?.["sharp"].jpeg.mozjpeg).toBe(false);
	});

	test("should shallow merge with the default jpeg config", () => {
		const config = betterImageService({
			sharp: {
				jpeg: {
					// cspell:ignore subsampling
					chromaSubsampling: "4:4:4",
				},
			},
		});
		expect(config.config?.["sharp"].jpeg.mozjpeg).toBe(
			defaultConfig.sharp.jpeg.mozjpeg,
		);
	});

	test("should override the default webp config", () => {
		const config = betterImageService({
			sharp: {
				webp: {
					effort: 1,
				},
			},
		});
		expect(config.config?.["sharp"].webp.effort).toBe(1);
	});

	test("should shallow merge with the default webp config", () => {
		const config = betterImageService({
			sharp: {
				webp: {
					lossless: true,
				},
			},
		});
		expect(config.config?.["sharp"].webp.effort).toBe(
			defaultConfig.sharp.webp.effort,
		);
	});

	test("should override the default avif config", () => {
		const config = betterImageService({
			sharp: {
				avif: {
					chromaSubsampling: "4:4:4",
				},
			},
		});
		expect(config.config?.["sharp"].avif.chromaSubsampling).toBe("4:4:4");
	});

	test("should shallow merge with the default avif config", () => {
		const config = betterImageService({
			sharp: {
				avif: {
					// cspell:ignore bitdepth
					bitdepth: 12,
				},
			},
		});
		expect(config.config?.["sharp"].avif.chromaSubsampling).toBe(
			defaultConfig.sharp.avif.chromaSubsampling,
		);
	});
});

describe("svgo config", () => {
	test("should override the default config", () => {
		const config = betterImageService({
			svgo: {
				// cspell:ignore multipass
				multipass: false,
			},
		});
		expect(config.config?.["svgo"].multipass).toEqual(false);
	});

	test("should shallow merge with the default config", () => {
		const config = betterImageService({
			svgo: {
				floatPrecision: 1,
			},
		});
		expect(config.config?.["svgo"].multipass).toEqual(
			defaultConfig.svgo.multipass,
		);
	});

	test("should not deep merge plugins with the default config", () => {
		const config = betterImageService({
			svgo: {
				plugins: [],
			},
		});
		expect(config.config?.["svgo"].plugins).toEqual([]);
	});

	describe("js2svg config", () => {
		test("should override the default config", () => {
			const config = betterImageService({
				svgo: {
					js2svg: {
						indent: 2,
					},
				},
			});
			expect(config.config?.["svgo"].js2svg?.indent).toEqual(2);
		});

		test("should deep merge with the default config", () => {
			const config = betterImageService({
				svgo: {
					js2svg: {
						indent: 2,
					},
				},
			});
			expect(config.config?.["svgo"].js2svg?.pretty).toEqual(
				defaultConfig.svgo.js2svg.pretty,
			);
		});
	});
});
