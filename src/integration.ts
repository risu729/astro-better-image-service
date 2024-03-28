import type { AstroIntegration } from "astro";

/**
 * Astro integration to set the image service entrypoint.
 * @returns Astro integration object.
 */
export const astroIntegration = (): AstroIntegration => ({
	name: "astro-better-image-service",
	hooks: {
		"astro:config:setup": ({ updateConfig, logger }) => {
			updateConfig({
				image: {
					service: {
						entrypoint: "astro-better-image-service/image-service",
					},
				},
			});
			logger.info("Image service entrypoint set.");
		},
	},
});
