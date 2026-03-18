import type { EffectDefinition } from "@/types/effects";
import lensFragmentShader from "./lens.frag.glsl";

export const lensEffectDefinition: EffectDefinition = {
	type: "lens",
	name: "Lens",
	keywords: ["fisheye", "vignette", "distortion", "barrel"],
	params: [
		{
			key: "distortion",
			label: "Distortion",
			type: "number",
			default: 5,
			min: -50,
			max: 100,
			step: 1,
		},
		{
			key: "vignette",
			label: "Vignette",
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
				fragmentShader: lensFragmentShader,
				uniforms: ({ effectParams }) => ({
					u_distortion: Number(effectParams.distortion),
					u_vignette: Number(effectParams.vignette),
				}),
			},
		],
	},
};
