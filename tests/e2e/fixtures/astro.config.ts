import betterImageService from "astro-better-image-service";
import { defineConfig } from "astro/config";

export default defineConfig({
	...(process.env["USE_DEFAULT_IMAGE_SERVICE"]
		? {}
		: { integrations: [betterImageService()] }),
});
