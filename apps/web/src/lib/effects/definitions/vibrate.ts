import type { EffectDefinition } from "@/types/effects";
import vibrateFragmentShader from "./vibrate.frag.glsl";

export const vibrateEffectDefinition: EffectDefinition = {
	type: "vibrate",
	name: "Vibrate",
	keywords: ["shake", "jitter", "vibrate", "movement"],
	params: [
		{
			key: "jitter",
			label: "Jitter",
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
				fragmentShader: vibrateFragmentShader,
				uniforms: ({ effectParams, time }) => ({
					u_jitter: Number(effectParams.jitter),
					u_time: time,
				}),
			},
		],
	},
};
