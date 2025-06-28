// copy-pasted from Astro's source code because it's not exported
// https://github.com/withastro/astro/blob/03242c6c2259dc583b21c12ad60109ac72aa9d52/packages/astro/src/assets/consts.ts

const VALID_INPUT_FORMATS = [
	"jpeg",
	"jpg",
	"png",
	"tiff",
	"webp",
	"gif",
	"svg",
	"avif",
] as const;
const DEFAULT_OUTPUT_FORMAT = "webp";
const VALID_OUTPUT_FORMATS = [
	"avif",
	"png",
	"webp",
	"jpeg",
	"jpg",
	"svg",
] as const;

const AVAILABLE_FORMAT_CONVERSIONS: {
	inputFormat: (typeof VALID_INPUT_FORMATS)[number];
	name: string;
	outputFormat: (typeof VALID_OUTPUT_FORMATS)[number] | undefined;
	path: string;
}[] = VALID_INPUT_FORMATS.flatMap((inputFormat) =>
	[
		// include undefined to test the default output format
		undefined,
		...VALID_OUTPUT_FORMATS.filter(
			// exclude vector to raster conversions because they are not supported
			(outputFormat) => inputFormat === "svg" || outputFormat !== "svg",
		),
	].map((outputFormat) => ({
		inputFormat,
		name: `${inputFormat} to ${outputFormat ?? "default"}`,
		outputFormat,
		path: `/${inputFormat}/${outputFormat ?? "default"}`,
	})),
);

export {
	VALID_INPUT_FORMATS,
	DEFAULT_OUTPUT_FORMAT,
	AVAILABLE_FORMAT_CONVERSIONS,
};
