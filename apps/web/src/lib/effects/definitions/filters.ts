import type { EffectDefinition, EffectParamValues } from "@/types/effects";
import filterFragmentShader from "./filter.frag.glsl";

const createFilter = ({
	type,
	name,
	keywords,
	defaultParams,
}: {
	type: string;
	name: string;
	keywords: string[];
	defaultParams: Partial<{
		brightness: number;
		contrast: number;
		saturation: number;
		vibrance: number;
		tint: [number, number, number];
		vignette: number;
	}>;
}): EffectDefinition => ({
	type: `filter-${type}`,
	name,
	keywords: ["filter", ...keywords],
	params: [
		{ key: "intensity", label: "Intensity", type: "number", default: 100, min: 0, max: 100, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: filterFragmentShader,
				uniforms: ({ effectParams }) => {
					const intensity = Number(effectParams.intensity) / 100;
					const params = {
						brightness: (defaultParams.brightness ?? 0) * intensity,
						contrast: (defaultParams.contrast ?? 0) * intensity,
						saturation: (defaultParams.saturation ?? 0) * intensity,
						vibrance: (defaultParams.vibrance ?? 0) * intensity,
						vignette: (defaultParams.vignette ?? 0) * intensity,
						tint: [
							1 + ((defaultParams.tint?.[0] ?? 1) - 1) * intensity,
							1 + ((defaultParams.tint?.[1] ?? 1) - 1) * intensity,
							1 + ((defaultParams.tint?.[2] ?? 1) - 1) * intensity,
						],
					};
					return {
						u_brightness: params.brightness,
						u_contrast: params.contrast,
						u_saturation: params.saturation,
						u_vibrance: params.vibrance,
						u_vignette: params.vignette,
						u_tint: params.tint,
					};
				},
			},
		],
	},
});

export const featureFilterDefinition = createFilter({
	type: "feature",
	name: "Feature",
	keywords: ["clean", "bright"],
	defaultParams: { brightness: 5, contrast: 12, saturation: 8, vibrance: 10 },
});

export const lunarFilterDefinition = createFilter({
	type: "lunar",
	name: "Lunar",
	keywords: ["cool", "night", "silver"],
	defaultParams: { saturation: -20, tint: [0.85, 0.9, 1.2], contrast: 15, vibrance: -10 },
});

export const mossFilterDefinition = createFilter({
	type: "moss",
	name: "Moss",
	keywords: ["green", "earth", "nature"],
	defaultParams: { tint: [0.95, 1.15, 0.9], contrast: 8, saturation: 5 },
});

export const barnFilterDefinition = createFilter({
	type: "barn",
	name: "Barn",
	keywords: ["warm", "rustic", "brown"],
	defaultParams: { tint: [1.2, 1.05, 0.85], contrast: 18, saturation: -5 },
});

export const skinFilterDefinition = createFilter({
	type: "skin",
	name: "Skin",
	keywords: ["soft", "warm", "portrait"],
	defaultParams: { brightness: 8, tint: [1.1, 1.05, 0.95], saturation: 5, vibrance: 15 },
});

export const moodyFilterDefinition = createFilter({
	type: "moody",
	name: "Moody",
	keywords: ["dark", "teal", "contrast"],
	defaultParams: { contrast: 30, saturation: -10, tint: [0.8, 1.0, 1.1], vignette: 30 },
});

export const creamFilterDefinition = createFilter({
	type: "cream",
	name: "Cream",
	keywords: ["soft", "vintage", "warm"],
	defaultParams: { brightness: 10, tint: [1.15, 1.1, 0.95], saturation: -8, contrast: -5 },
});

export const amberFilterDefinition = createFilter({
	type: "amber",
	name: "Amber",
	keywords: ["gold", "warm", "sunset"],
	defaultParams: { tint: [1.4, 1.1, 0.75], contrast: 10, saturation: 15 },
});

export const freshFilterDefinition = createFilter({
	type: "fresh",
	name: "Fresh",
	keywords: ["bright", "vibrant", "clean"],
	defaultParams: { brightness: 12, saturation: 25, contrast: 10, vibrance: 20 },
});

export const filmFilterDefinition = createFilter({
	type: "film",
	name: "Film",
	keywords: ["vintage", "analog", "classic"],
	defaultParams: { contrast: 12, saturation: -15, tint: [1.05, 1.0, 0.95], vibrance: -5 },
});

export const plumFilterDefinition = createFilter({
	type: "plum",
	name: "Plum",
	keywords: ["purple", "moody", "magenta"],
	defaultParams: { tint: [1.1, 0.85, 1.25], contrast: 10, saturation: 5 },
});

export const spotFilterDefinition = createFilter({
	type: "spot",
	name: "Spot",
	keywords: ["vignette", "focus"],
	defaultParams: { vignette: 60, contrast: 15, brightness: -5 },
});

export const cosyFilterDefinition = createFilter({
	type: "cosy",
	name: "Cosy",
	keywords: ["warm", "soft", "home"],
	defaultParams: { tint: [1.2, 1.0, 0.9], saturation: 10, vibrance: 15, brightness: 5 },
});

export const neonFilterDefinition = createFilter({
	type: "neon",
	name: "Neon",
	keywords: ["intense", "saturated", "cyberpunk"],
	defaultParams: { saturation: 50, contrast: 25, tint: [1.0, 0.9, 1.2], vibrance: 40 },
});

export const cinemaFilterDefinition = createFilter({
	type: "cinema",
	name: "Cinema",
	keywords: ["hollywood", "teal-orange", "movie"],
	defaultParams: { tint: [1.15, 1.0, 0.85], saturation: 5, contrast: 20, vignette: 20 },
});

// Duotone is slightly different, let's just make it a cool cyan/magenta split
export const duoFilterDefinition: EffectDefinition = {
	type: "filter-duo",
	name: "Duo",
	keywords: ["filter", "duotone", "two-tone"],
	params: [
		{ key: "intensity", label: "Intensity", type: "number", default: 100, min: 0, max: 100, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: `
					precision mediump float;
					uniform sampler2D u_texture;
					uniform float u_intensity;
					varying vec2 v_texCoord;
					void main() {
						vec4 color = texture2D(u_texture, v_texCoord);
						float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
						vec3 color1 = vec3(0.1, 0.1, 0.4); // Dark blue
						vec3 color2 = vec3(1.0, 0.3, 0.3); // Soft red
						vec3 duo = mix(color1, color2, luma);
						gl_FragColor = vec4(mix(color.rgb, duo, u_intensity / 100.0), color.a);
					}
				`,
				uniforms: ({ effectParams }) => ({
					u_intensity: Number(effectParams.intensity),
				}),
			},
		],
	},
};
