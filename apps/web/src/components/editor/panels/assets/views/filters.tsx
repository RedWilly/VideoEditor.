"use client";

import { useEffect, useRef, useCallback } from "react";
import { PanelView } from "@/components/editor/panels/assets/views/base-view";
import { DraggableItem } from "@/components/editor/panels/assets/draggable-item";
import { getAllEffects, EFFECT_TARGET_ELEMENT_TYPES } from "@/lib/effects";
import {
	effectPreviewService,
	onPreviewImageReady,
} from "@/services/renderer/effect-preview";
import { useEditor } from "@/hooks/use-editor";
import { buildEffectElement } from "@/lib/timeline/element-utils";
import type { EffectDefinition } from "@/types/effects";

export function FiltersView() {
	const filters = getAllEffects().filter((e) => e.type.startsWith("filter-"));

	return (
		<PanelView title="Filters">
			<FiltersGrid filters={filters} />
		</PanelView>
	);
}

function FiltersGrid({ filters }: { filters: EffectDefinition[] }) {
	return (
		<div
			className="grid gap-2"
			style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
		>
			{filters.map((filter) => (
				<FilterItem key={filter.type} filter={filter} />
			))}
		</div>
	);
}

function FilterPreviewCanvas({ filterType }: { filterType: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const render = () => {
			if (canvasRef.current) {
				effectPreviewService.renderPreview({
					effectType: filterType,
					params: {},
					targetCanvas: canvasRef.current,
				});
			}
		};

		render();
		return onPreviewImageReady({ callback: render });
	}, [filterType]);

	return <canvas ref={canvasRef} className="size-full" />;
}

function FilterItem({ filter }: { filter: EffectDefinition }) {
	const editor = useEditor();

	const handleAddToTimeline = useCallback(() => {
		const currentTime = editor.playback.getCurrentTime();
		const element = buildEffectElement({
			effectType: filter.type,
			startTime: currentTime,
		});

		editor.timeline.insertElement({
			placement: { mode: "auto", trackType: "effect" },
			element,
		});
	}, [editor, filter.type]);

	const preview = <FilterPreviewCanvas filterType={filter.type} />;

	return (
		<DraggableItem
			name={filter.name}
			preview={preview}
			dragData={{
				id: filter.type,
				name: filter.name,
				type: "effect",
				effectType: filter.type,
				targetElementTypes: EFFECT_TARGET_ELEMENT_TYPES,
			}}
			onAddToTimeline={handleAddToTimeline}
			aspectRatio={1}
			isRounded
			variant="card"
			containerClassName="w-full"
		/>
	);
}
