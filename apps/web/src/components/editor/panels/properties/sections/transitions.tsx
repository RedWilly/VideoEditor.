import { useEditor } from "@/hooks/use-editor";
import { NumberField } from "@/components/ui/number-field";
import { Section, SectionContent, SectionField, SectionHeader, SectionTitle } from "../section";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TRANSITION_TYPES, TRANSITION_LABELS, type TransitionType } from "@/types/transitions";
import type { TimelineElement } from "@/types/timeline";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, StopIcon, Timer02Icon } from "@hugeicons/core-free-icons";

export function TransitionsSection({
	element,
	trackId,
}: {
	element: TimelineElement;
	trackId: string;
}) {
	const editor = useEditor();

	const updateTransition = (
		mode: "in" | "out",
		updates: { type?: TransitionType; duration?: number } | null,
	) => {
		const current = mode === "in" ? element.transitionIn : element.transitionOut;

		let newValue = null;
		if (updates) {
			newValue = {
				type: updates.type ?? current?.type ?? "fade",
				duration: updates.duration ?? current?.duration ?? 0.5,
			};
		}

		editor.timeline.updateElements({
			updates: [
				{
					trackId,
					elementId: element.id,
					updates: {
						[mode === "in" ? "transitionIn" : "transitionOut"]: newValue,
					},
				},
			],
		});
	};

	return (
		<Section collapsible sectionKey={`${element.type}:transitions`}>
			<SectionHeader>
				<SectionTitle>Transitions</SectionTitle>
			</SectionHeader>
			<SectionContent className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
						<HugeiconsIcon icon={PlayIcon} className="size-3" /> Transition In
					</div>
					<div className="flex gap-2">
						<Select
							value={element.transitionIn?.type ?? "none"}
							onValueChange={(value) =>
								updateTransition("in", value === "none" ? null : { type: value as TransitionType })
							}
						>
							<SelectTrigger className="w-2/3">
								<SelectValue placeholder="None" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None</SelectItem>
								{TRANSITION_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{TRANSITION_LABELS[type]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<NumberField
							className="w-1/3"
							icon={<HugeiconsIcon icon={Timer02Icon} className="size-3.5 text-muted-foreground" />}
							value={(element.transitionIn?.duration ?? 0.5).toFixed(1)}
							min={0}
							max={element.duration}
							step={0.1}
							disabled={!element.transitionIn}
							onScrub={(val) => updateTransition("in", { duration: val })}
							onChange={(e) => updateTransition("in", { duration: parseFloat(e.target.value) })}
							onBlur={(e) => {
								const val = parseFloat(e.target.value);
								if (!isNaN(val)) updateTransition("in", { duration: val });
							}}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
						<HugeiconsIcon icon={StopIcon} className="size-3" /> Transition Out
					</div>
					<div className="flex gap-2">
						<Select
							value={element.transitionOut?.type ?? "none"}
							onValueChange={(value) =>
								updateTransition("out", value === "none" ? null : { type: value as TransitionType })
							}
						>
							<SelectTrigger className="w-2/3">
								<SelectValue placeholder="None" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None</SelectItem>
								{TRANSITION_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{TRANSITION_LABELS[type]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<NumberField
							className="w-1/3"
							icon={<HugeiconsIcon icon={Timer02Icon} className="size-3.5 text-muted-foreground" />}
							value={(element.transitionOut?.duration ?? 0.5).toFixed(1)}
							min={0}
							max={element.duration}
							step={0.1}
							disabled={!element.transitionOut}
							onScrub={(val) => updateTransition("out", { duration: val })}
							onChange={(e) => updateTransition("out", { duration: parseFloat(e.target.value) })}
							onBlur={(e) => {
								const val = parseFloat(e.target.value);
								if (!isNaN(val)) updateTransition("out", { duration: val });
							}}
						/>
					</div>
				</div>
			</SectionContent>
		</Section>
	);
}
