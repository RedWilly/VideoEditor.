import type { CreateTextElement } from "@/types/timeline";
import { DEFAULT_TEXT_ELEMENT } from "./text-constants";

export const TEXT_PRESETS: Array<{ name: string; element: Partial<CreateTextElement> }> = [
	{
		name: "Headline",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Headline",
			content: "HEADLINE",
			fontFamily: "Bebas Neue",
			fontSize: 40,
			fontWeight: "bold",
		},
	},
	{
		name: "Marker",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Marker",
			content: "Permanent Marker",
			fontFamily: "Permanent Marker",
			fontSize: 30,
		},
	},
	{
		name: "Modern",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Modern",
			content: "Modern Style",
			fontFamily: "Roboto",
			fontSize: 25,
			fontWeight: "normal", // We can't easily set "Medium" via the current enum which only has "bold" | "normal"
		},
	},
	{
		name: "Thin",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Thin",
			content: "Elegant Thin",
			fontFamily: "Roboto",
			fontSize: 25,
			fontWeight: "normal",
		},
	},
	{
		name: "Handwritten",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Handwritten",
			content: "Amatic SC",
			fontFamily: "Amatic SC",
			fontSize: 35,
			fontWeight: "bold",
		},
	},
	{
		name: "Retro",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Retro",
			content: "Retro Aleo",
			fontFamily: "Aleo",
			fontSize: 28,
			fontWeight: "bold",
		},
	},
	{
		name: "Clean",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Clean",
			content: "Montserrat font",
			fontFamily: "Montserrat",
			fontSize: 24,
			fontWeight: "bold",
		},
	},
	{
		name: "Playful",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Playful",
			content: "Caveat Brush",
			fontFamily: "Caveat",
			fontSize: 32,
		},
	},
	{
		name: "Classic",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Classic",
			content: "Playfair Display",
			fontFamily: "Playfair Display",
			fontSize: 28,
			fontStyle: "italic",
		},
	},
	{
		name: "Minimal",
		element: {
			...DEFAULT_TEXT_ELEMENT,
			name: "Minimal",
			content: "Inter Tight",
			fontFamily: "Inter",
			fontSize: 22,
		},
	},
];
