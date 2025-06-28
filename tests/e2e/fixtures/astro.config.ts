// ref: https://docs.astro.build/en/reference/configuration-reference/

import process from "node:process";
import { defineConfig } from "astro/config";
import betterImageService from "astro-better-image-service";

export default defineConfig({
	...(process.env["USE_DEFAULT_IMAGE_SERVICE"]
		? {}
		: { integrations: [betterImageService()] }),
});
