import type { EffectDefinition } from "@/types/effects";
import splitFragmentShader from "./split.frag.glsl";

export const splitEffectDefinition: EffectDefinition = {
	type: "split",
	name: "Split",
	keywords: ["rgb", "split", "shift", "chromatic"],
	params: [
		{
			key: "amount",
			label: "Amount",
			type: "number",
			default: 10,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: splitFragmentShader,
				uniforms: ({ effectParams }) => ({
					u_amount: Number(effectParams.amount),
				}),
			},
		],
	},
};
