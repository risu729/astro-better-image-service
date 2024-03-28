export { sharpOptions, svgoOptions } from "./options.js";
export { default as betterImageService } from "./image-service.js";
// ref: https://docs.astro.build/en/reference/integrations-reference/#allow-installation-with-astro-add
// biome-ignore lint/style/noDefaultExport: required for Astro integration
export { astroIntegration as default } from "./integration.js";
