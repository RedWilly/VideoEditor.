"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/hooks/use-editor";

export default function Home() {
	const router = useRouter();
	const editor = useEditor();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const openEditor = async () => {
			try {
				await editor.project.loadAllProjects();
				if (cancelled) return;

				const savedProjects = editor.project.getSavedProjects();
				let targetProjectId = savedProjects
					.slice()
					.sort(
						(a, b) =>
							new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
					)[0]?.id;

				if (!targetProjectId) {
					targetProjectId = await editor.project.createNewProject({
						name: "New project",
					});
					if (cancelled) return;
				}

				router.replace(`/editor/${targetProjectId}`);
			} catch (err) {
				if (cancelled) return;
				setError(
					err instanceof Error
						? err.message
						: "Failed to open editor. Please try again.",
				);
			}
		};

		openEditor();

		return () => {
			cancelled = true;
		};
	}, [editor, router]);

	if (error) {
		return (
			<div className="bg-background flex h-screen w-screen items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<p className="text-destructive text-sm">{error}</p>
					<Button onClick={() => router.refresh()}>Retry</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-background flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="text-muted-foreground size-8 animate-spin" />
				<p className="text-muted-foreground text-sm">Opening editor...</p>
			</div>
		</div>
	);
}
