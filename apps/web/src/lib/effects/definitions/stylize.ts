import type { EffectDefinition } from "@/types/effects";
import stylizeFragmentShader from "./stylize.frag.glsl";

export const stylizeEffectDefinition: EffectDefinition = {
	type: "stylize",
	name: "Stylize",
	keywords: ["edge", "artistic", "sketch", "posterize"],
	params: [
		{
			key: "edgeIntensity",
			label: "Edge Intensity",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "posterizeLevels",
			label: "Color Levels",
			type: "number",
			default: 8,
			min: 2,
			max: 16,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: stylizeFragmentShader,
				uniforms: ({ effectParams }) => ({
					u_edgeIntensity: Number(effectParams.edgeIntensity),
					u_posterizeLevels: Number(effectParams.posterizeLevels),
				}),
			},
		],
	},
};
