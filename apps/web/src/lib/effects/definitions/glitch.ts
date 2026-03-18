import type { EffectDefinition } from "@/types/effects";
import glitchFragmentShader from "./glitch.frag.glsl";

export const glitchEffectDefinition: EffectDefinition = {
	type: "glitch",
	name: "Glitch",
	keywords: ["glitch", "noise", "rgb", "distortion"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
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
				fragmentShader: glitchFragmentShader,
				uniforms: ({ effectParams, time }) => ({
					u_intensity: Number(effectParams.intensity),
					u_time: time,
				}),
			},
		],
	},
};
