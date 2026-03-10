"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/utils/ui";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
	className?: string;
	iconClassName?: string;
	onToggle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ThemeToggle({
	className,
	iconClassName,
	onToggle,
}: ThemeToggleProps) {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const activeTheme = useMemo(() => {
		if (!mounted) return "system";
		return theme ?? "system";
	}, [mounted, theme]);

	const effectiveTheme = useMemo(() => {
		if (!mounted) return "light";
		if (activeTheme === "system") return resolvedTheme ?? "light";
		return activeTheme;
	}, [activeTheme, mounted, resolvedTheme]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className={cn("size-8", className)}
					onClick={(e) => {
						onToggle?.(e);
					}}
				>
					{effectiveTheme === "dark" ? (
						<Moon className={cn("size-[1.1rem]", iconClassName)} />
					) : (
						<Sun className={cn("size-[1.1rem]", iconClassName)} />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-36">
				<DropdownMenuRadioGroup
					value={activeTheme}
					onValueChange={(value) =>
						setTheme(value as "light" | "dark" | "system")
					}
				>
					<DropdownMenuRadioItem value="light">
						<Sun className="size-4" />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark">
						<Moon className="size-4" />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system">
						<Monitor className="size-4" />
						System
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
