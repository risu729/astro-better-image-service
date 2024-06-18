// biome-ignore lint/performance/noBarrelFile: export from the root
export { type Config, defaultConfig } from "./config.js";
export { default as imageService } from "./image-service.js";
// ref: https://docs.astro.build/en/reference/integrations-reference/#allow-installation-with-astro-add
// biome-ignore lint/style/noDefaultExport: required for Astro integration
export { astroIntegration as default } from "./integration.js";
