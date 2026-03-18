import type { EffectDefinition } from "@/types/effects";
import weatherFragmentShader from "./weather.frag.glsl";

export const weatherEffectDefinition: EffectDefinition = {
	type: "weather",
	name: "Weather",
	keywords: ["rain", "weather", "streaks", "atmosphere"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "speed",
			label: "Speed",
			type: "number",
			default: 100,
			min: 0,
			max: 300,
			step: 10,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: weatherFragmentShader,
				uniforms: ({ effectParams, time }) => ({
					u_intensity: Number(effectParams.intensity),
					u_speed: Number(effectParams.speed),
					u_time: time,
				}),
			},
		],
	},
};
