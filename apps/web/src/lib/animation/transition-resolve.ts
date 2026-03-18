import type { Transition, TransitionType } from "@/types/transitions";
import type { Transform } from "@/types/timeline";

export function applyTransition({
	type,
	duration,
	localTime,
	elementDuration,
	mode, // "in" or "out"
	opacity,
	transform,
	width,
	height,
}: {
	type: TransitionType;
	duration: number;
	localTime: number;
	elementDuration: number;
	mode: "in" | "out";
	opacity: number;
	transform: Transform;
	width: number;
	height: number;
}): { opacity: number; transform: Transform } {
	let progress = 0;
	if (mode === "in") {
		progress = Math.min(1, Math.max(0, localTime / duration));
	} else {
		progress = Math.min(1, Math.max(0, (elementDuration - localTime) / duration));
	}

	let newOpacity = opacity;
	const newTransform = { ...transform, position: { ...transform.position } };

	switch (type) {
		case "fade":
			newOpacity *= progress;
			break;

		case "slide-left":
			newTransform.position.x += (1 - progress) * width;
			break;

		case "slide-right":
			newTransform.position.x -= (1 - progress) * width;
			break;

		case "slide-up":
			newTransform.position.y += (1 - progress) * height;
			break;

		case "slide-down":
			newTransform.position.y -= (1 - progress) * height;
			break;

		case "zoom-in":
			newTransform.scale = transform.scale * progress;
			break;

		case "zoom-out":
			newTransform.scale = transform.scale * (2 - progress);
			break;

		case "blur":
			// Blur is handled by an effect node, or I can add it here if I have something for it.
			// But for now, we only handle transform/opacity-based ones
			break;
	}

	return { opacity: newOpacity, transform: newTransform };
}
