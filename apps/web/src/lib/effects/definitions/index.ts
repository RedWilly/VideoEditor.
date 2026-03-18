import { hasEffect, registerEffect } from "../registry";
import { blurEffectDefinition } from "./blur";
import { glitchEffectDefinition } from "./glitch";
import { analogEffectDefinition } from "./analog";
import { retroEffectDefinition } from "./retro";
import { splitEffectDefinition } from "./split";
import { lensEffectDefinition } from "./lens";
import { vibrateEffectDefinition } from "./vibrate";
import { glassEffectDefinition } from "./glass";
import { nettingEffectDefinition } from "./netting";
import { weatherEffectDefinition } from "./weather";
import { stylizeEffectDefinition } from "./stylize";
import * as filters from "./filters";

const defaultEffects = [
	blurEffectDefinition,
	glitchEffectDefinition,
	analogEffectDefinition,
	retroEffectDefinition,
	splitEffectDefinition,
	lensEffectDefinition,
	vibrateEffectDefinition,
	glassEffectDefinition,
	nettingEffectDefinition,
	weatherEffectDefinition,
	stylizeEffectDefinition,
	filters.featureFilterDefinition,
	filters.lunarFilterDefinition,
	filters.mossFilterDefinition,
	filters.barnFilterDefinition,
	filters.skinFilterDefinition,
	filters.moodyFilterDefinition,
	filters.creamFilterDefinition,
	filters.amberFilterDefinition,
	filters.freshFilterDefinition,
	filters.filmFilterDefinition,
	filters.plumFilterDefinition,
	filters.spotFilterDefinition,
	filters.cosyFilterDefinition,
	filters.neonFilterDefinition,
	filters.cinemaFilterDefinition,
	filters.duoFilterDefinition,
];

export function registerDefaultEffects(): void {
	for (const definition of defaultEffects) {
		if (hasEffect({ effectType: definition.type })) {
			continue;
		}
		registerEffect({ definition });
	}
}
