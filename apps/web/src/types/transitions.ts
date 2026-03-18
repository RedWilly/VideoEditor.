export type TransitionType =
	| "fade"
	| "slide-left"
	| "slide-right"
	| "slide-up"
	| "slide-down"
	| "zoom-in"
	| "zoom-out"
	| "blur";

export interface Transition {
	type: TransitionType;
	duration: number; // in seconds
}

export const TRANSITION_TYPES: TransitionType[] = [
	"fade",
	"slide-left",
	"slide-right",
	"slide-up",
	"slide-down",
	"zoom-in",
	"zoom-out",
	"blur",
];

export const TRANSITION_LABELS: Record<TransitionType, string> = {
	fade: "Fade",
	"slide-left": "Slide Left",
	"slide-right": "Slide Right",
	"slide-up": "Slide Up",
	"slide-down": "Slide Down",
	"zoom-in": "Zoom In",
	"zoom-out": "Zoom Out",
	blur: "Blur",
};
