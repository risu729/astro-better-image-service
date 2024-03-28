import betterImageService from "astro-better-image-service";
import { defineConfig } from "astro/config";

// biome-ignore lint/style/noDefaultExport: required for Astro config
export default defineConfig({
	...(process.env["USE_DEFAULT_IMAGE_SERVICE"]
		? {}
		: { integrations: [betterImageService()] }),
});
