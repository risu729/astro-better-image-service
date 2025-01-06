import type {
	AstroConfig,
	AstroIntegration,
	AstroIntegrationLogger,
} from "astro";
import { betterImageService } from "./config.js";

/**
 * Astro integration to set the image service entrypoint.
 * @param config Configuration for the image optimization libraries.
 * @returns Astro integration object.
 */
// biome-ignore lint/nursery/useExplicitType: type should be inferred
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
				}) => AstroConfig;
				logger: AstroIntegrationLogger;
			}): void => {
				updateConfig({
					image: {
						service: betterImageService(config),
					},
				});
				logger.info("Image service entrypoint set.");
			},
		},
	}) as const satisfies AstroIntegration;
