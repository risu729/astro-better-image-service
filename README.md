# 🚀 astro-better-image-service

[![Version](https://img.shields.io/npm/v/astro-better-image-service)](https://www.npmjs.com/package/astro-better-image-service)
[![License](https://img.shields.io/npm/l/astro-better-image-service)](https://github.com/risu729/astro-better-image-service?tab=License-1-ov-file)
[![NPM Downloads](https://img.shields.io/npm/dm/astro-better-image-service)](https://www.npmjs.com/package/astro-better-image-service)
[![Last commit](https://img.shields.io/github/last-commit/risu729/astro-better-image-service)](https://github.com/risu729/astro-better-image-service/commits/main/)
[![Repo stars](https://img.shields.io/github/stars/risu729/astro-better-image-service)](https://github.com/risu729/astro-better-image-service/stargazers)

**`astro-better-image-service`** is an Astro integration for image compression and conversion, superseding Astro's default image service.

## 🖼️ Features

- Compress raster images with the maximum compression ratio using [sharp](https://github.com/lovell/sharp).
- Compress SVG images using [svgo](https://github.com/svg/svgo).
- Convert SVG images to raster images using [sharp](https://github.com/lovell/sharp).
- And, of course, all features of Astro's default image service (`sharpImageService`) are supported.

## 🛠️ Installation

### Using `astro add` (recommended)

Run the following command and it will automatically install the package and add the integration to your `astro.config.{ts,js,mjs,cjs}` file.

```bash
bun astro add astro-better-image-service
```

```bash
npx astro add astro-better-image-service
```

### Manually

1. Add this npm package to dependencies.

```bash
bun add astro-better-image-service
```

```bash
npm install astro-better-image-service
```

2. Edit your Astro configuration file to include the integration. <!-- markdownlint-disable-line ol-prefix -->

`astro.config.{ts,js,mjs,cjs}`

```javascript
import betterImageService from "astro-better-image-service";
import { defineConfig } from "astro/config";

export default defineConfig({
	// ...
	integrations: [
		// ... other integrations
		betterImageService(),
		// ... other integrations
	],
	// ...
});
```

You may put the `betterImageService` integration anywhere in the `integrations` array.  
Please note that this integration cannot be used with other integrations using the Image Service API. (I haven't seen any yet.)

## ❓ How it works

This integration is built using Astro's [Image Service API](https://docs.astro.build/en/reference/image-service-reference/).  
It enables us to use all the awesome features of Astro, for example, caching, lazy loading, and more listed in the [Astro Images documentation](https://docs.astro.build/en/guides/images/).

## ⚠️ When not to use

Image optimization with the maximum compression ratio may slow down your build time.  
You are discouraged using this integration in SSR environments, because it may slow down the responses.

## vs. Astro's default image service ([`sharpImageService`](https://docs.astro.build/en/guides/images/#default-image-service))

- The default image service (a.k.a. `astro:assets`) uses the default compression settings of [sharp](https://github.com/lovell/sharp), in which the compression ratio is medium, as referred to in the [Astro Discord](https://astro.build/chat).

> astro-compress sets the compression level to the maximum, whereas astro:assets uses the default settings  
> We most likely could tune up the settings a bit, though we need to be careful about it taking too much time (notably because of SSR doing it at runtime)  
> see: <https://discord.com/channels/830184174198718474/830184175176122389/1168307099571331155>

- The default image service does not support SVG images.  
  It only passes them through without any optimization.  
  Also, it does not support converting SVG images to raster images. (`format` option is ignored)

## vs. [`@playform/compress`](https://github.com/Playform/Compress) (f.k.a. `astro-compress`)

- `@playform/compress` does not cache compressed images, so slows down your build time. <https://github.com/PlayForm/Compress/issues/49>

- `@playform/compress` does not support converting SVG images to raster images.  
  \* It only compresses built files in `outDir`, and does not intercept the build process.

- Unless you set `image.service` in `astro.config.{ts,js,mjs,cjs}` to [`passthroughImageService`](https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service), Astro optimizes images and `@playform/compress` compresses them again.

Since `astro-better-image-service` does not support optimizing HTML, CSS, and JavaScript files, you may use `@playform/compress` with it to compress them.  
For example, you may use the following configuration.

`astro.config.{ts,js,mjs,cjs}`

<!-- cspell:ignore playform -->

```javascript
import betterImageService from "astro-better-image-service";
import compress from "@playform/compress";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [
		betterImageService(),
		compress({
			HTML: true,
			CSS: true,
			JavaScript: true,
			Image: false,
			SVG: false,
		}),
	],
});
```

## ⚙️ Configuration

If you want to configure the configuration of the image compression and conversion, you may pass a configuration object to the `betterImageService` function.  
The configuration object is merged with the default configuration object, exported as `defaultConfig` from the package.

`astro.config.{ts,js,mjs,cjs}`

<!-- cspell:ignore webp -->

```javascript
import betterImageService from "astro-better-image-service";
import { defineConfig } from "astro/config";

export default defineConfig({
	// ...
	integrations: [
		betterImageService({
			sharp: {
				sharp: {
					// sharp constructor options
				},
				png: {
					// sharp png options
				},
				jpeg: {
					// sharp jpeg options
				},
				webp: {
					// sharp webp options
				},
				avif: {
					// sharp avif options
				},
			},
			svgo: {
				// svgo options
			},
		}),
	],
	// ...
});
```

### [`limitInputPixels`](https://docs.astro.build/en/reference/configuration-reference/#imageserviceconfiglimitinputpixels)

You cannot configure `image.service.config.limitInputPixels` in the configuration object unless you set the `image.service.entrypoint` to `sharpImageService`.  
We support to set `limitInputPixels` in the configuration object of `betterImageService` for compatibility with the default image service.  
However, we recommend setting `sharp.sharp.limitInputPixels` in the configuration object of `betterImageService` for clarity.  
For example, you may set `limitInputPixels` to `false` as follows.

`astro.config.{ts,js,mjs,cjs}`

```javascript
import betterImageService from "astro-better-image-service";
import { defineConfig } from "astro/config";

export default defineConfig({
	// ...
	integrations: [
		betterImageService({
			// not recommended
			limitInputPixels: false,
			// recommended
			sharp: {
				sharp: {
					limitInputPixels: false,
				},
			},
		}),
	],
	// ...
});
```

## 💻 Development

### Getting Started

Run the following commands to start development.

```bash
gh repo clone risu729/astro-better-image-service
cd astro-better-image-service
mise install
mise run buni
```

### Testing

To test this package, you may link it to a project using it by running the following commands.

```bash
mise run dev
# in a project using astro-better-image-service
bun link astro-better-image-service
```

E2E tests using [Playwright](https://github.com/microsoft/playwright) run on GitHub Actions.

### Commit

To commit, run the following command.  
[commitizen](https://github.com/commitizen/cz-cli) will ask you to fill in the commit message.

```bash
mise run commit
# or to commit only staged files
mise run commit:staged
```

### Release

This package is released automatically by GitHub Actions using [semantic-release](https://github.com/semantic-release/semantic-release).  
`package.json#version` is not updated in git, but automatically updated and published to npm.

## 📜 License

MIT License
