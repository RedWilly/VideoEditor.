import { useEffect, useCallback } from "react";
import { DraggableItem } from "@/components/editor/panels/assets/draggable-item";
import { PanelView } from "@/components/editor/panels/assets/views/base-view";
import { useEditor } from "@/hooks/use-editor";
import { buildTextElement } from "@/lib/timeline/element-utils";
import { TEXT_PRESETS } from "@/constants/text-presets";
import { loadFonts } from "@/lib/fonts/google-fonts";

export function TextView() {
	const editor = useEditor();

	useEffect(() => {
		const families = TEXT_PRESETS.map((p) => p.element.fontFamily).filter(
			(f): f is string => !!f,
		);
		loadFonts({ families });
	}, []);

	const handleAddToTimeline = useCallback(
		({ element: presetElement }: { element: any }) => {
			const currentTime = editor.playback.getCurrentTime();
			const activeScene = editor.scenes.getActiveScene();
			if (!activeScene) return;

			const element = buildTextElement({
				raw: presetElement,
				startTime: currentTime,
			});

			editor.timeline.insertElement({
				element,
				placement: { mode: "auto" },
			});
		},
		[editor],
	);

	return (
		<PanelView title="Text">
			<div className="grid grid-cols-2 gap-2">
				{TEXT_PRESETS.map((preset) => (
					<DraggableItem
						key={preset.name}
						name={preset.name}
						preview={
							<div
								className="bg-accent flex size-full items-center justify-center rounded px-2"
								style={{
									fontFamily: preset.element.fontFamily,
									fontWeight: preset.element.fontWeight,
									fontStyle: preset.element.fontStyle,
								}}
							>
								<span className="text-[10px] select-none text-center truncate">
									{preset.element.content}
								</span>
							</div>
						}
						dragData={{
							id: `text-preset-${preset.name}`,
							type: "text",
							...preset.element,
						}}
						aspectRatio={16 / 9}
						onAddToTimeline={() => handleAddToTimeline({ element: preset.element })}
						shouldShowLabel={true}
						containerClassName="w-full"
					/>
				))}
			</div>
		</PanelView>
	);
}
