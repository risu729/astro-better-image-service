import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { betterImageService } from "./config.js";

/**
 * Astro integration to set the image service entrypoint.
 * @param config Configuration for the image optimization libraries.
 * @returns Astro integration object.
 */
export const astroIntegration = (
	config?: Parameters<typeof betterImageService>[0],
) =>
	// loose type for compatibility with other astro versions
	({
		name: "astro-better-image-service",
		hooks: {
			"astro:config:setup": ({
				updateConfig,
				logger,
			}: {
				updateConfig: (config: {
					image: { service: ReturnType<typeof betterImageService> };
				}) => unknown;
				logger: AstroIntegrationLogger;
			}) => {
				updateConfig({
					image: {
						service: betterImageService(config),
					},
				});
				logger.info("Image service entrypoint set.");
			},
		},
	}) as const satisfies AstroIntegration;
