import type { EffectDefinition } from "@/types/effects";
import nettingFragmentShader from "./netting.frag.glsl";

export const nettingEffectDefinition: EffectDefinition = {
	type: "netting",
	name: "Netting",
	keywords: ["grid", "net", "mesh", "pattern"],
	params: [
		{
			key: "gridScale",
			label: "Grid Scale",
			type: "number",
			default: 50,
			min: 1,
			max: 200,
			step: 1,
		},
		{
			key: "gridIntensity",
			label: "Intensity",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: nettingFragmentShader,
				uniforms: ({ effectParams }) => ({
					u_gridScale: Number(effectParams.gridScale),
					u_gridIntensity: Number(effectParams.gridIntensity),
				}),
			},
		],
	},
};
