import type { EffectDefinition } from "@/types/effects";
import retroFragmentShader from "./retro.frag.glsl";

export const retroEffectDefinition: EffectDefinition = {
	type: "retro",
	name: "Retro",
	keywords: ["pixelate", "retro", "scanlines", "8bit"],
	params: [
		{
			key: "pixelSize",
			label: "Pixel Size",
			type: "number",
			default: 4,
			min: 1,
			max: 100,
			step: 1,
		},
		{
			key: "scanlineIntensity",
			label: "Scanlines",
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
				fragmentShader: retroFragmentShader,
				uniforms: ({ effectParams }) => ({
					u_pixelSize: Number(effectParams.pixelSize),
					u_scanlineIntensity: Number(effectParams.scanlineIntensity),
				}),
			},
		],
	},
};
