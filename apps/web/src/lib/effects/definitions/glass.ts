import type { EffectDefinition } from "@/types/effects";
import glassFragmentShader from "./glass.frag.glsl";

export const glassEffectDefinition: EffectDefinition = {
	type: "glass",
	name: "Glass",
	keywords: ["glass", "refraction", "frost", "distortion"],
	params: [
		{
			key: "distortion",
			label: "Distortion",
			type: "number",
			default: 30,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "noiseScale",
			label: "Noise Scale",
			type: "number",
			default: 200,
			min: 10,
			max: 500,
			step: 10,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: glassFragmentShader,
				uniforms: ({ effectParams }) => ({
					u_distortion: Number(effectParams.distortion),
					u_noiseScale: Number(effectParams.noiseScale),
				}),
			},
		],
	},
};
