import type { EffectDefinition } from "@/types/effects";
import analogFragmentShader from "./analog.frag.glsl";

export const analogEffectDefinition: EffectDefinition = {
	type: "analog",
	name: "Analog",
	keywords: ["vhs", "analog", "noise", "grain", "retro"],
	params: [
		{
			key: "noiseIntensity",
			label: "Noise Intensity",
			type: "number",
			default: 30,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "colorBleed",
			label: "Color Bleed",
			type: "number",
			default: 20,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: analogFragmentShader,
				uniforms: ({ effectParams, time }) => ({
					u_noiseIntensity: Number(effectParams.noiseIntensity),
					u_colorBleed: Number(effectParams.colorBleed),
					u_time: time,
				}),
			},
		],
	},
};
