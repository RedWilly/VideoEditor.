"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useSoundSearch } from "@/hooks/use-sound-search";
import { useSoundsStore } from "@/stores/sounds-store";
import type { SavedSound, SoundEffect } from "@/types/sounds";
import { cn } from "@/utils/ui";
import {
	CloudUploadIcon,
	Delete02Icon,
	FavouriteIcon,
	FilterMailIcon,
	MusicNote03Icon,
	PauseIcon,
	PlayIcon,
	PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEditor } from "@/hooks/use-editor";
import { useFileUpload } from "@/hooks/use-file-upload";
import { processMediaAssets } from "@/lib/media/processing";
import { buildElementFromMedia } from "@/lib/timeline/element-utils";
import { toast } from "sonner";
import type { MediaAsset } from "@/types/assets";

export function SoundsView() {
	return (
		<div className="flex h-full flex-col">
			<Tabs defaultValue="sound-effects" className="flex h-full flex-col">
				<div className="px-3 pt-4 pb-0">
					<TabsList>
						<TabsTrigger value="sound-effects">Sound effects</TabsTrigger>
						<TabsTrigger value="songs">Songs</TabsTrigger>
						<TabsTrigger value="saved">Saved</TabsTrigger>
						<TabsTrigger value="my-music">My Music</TabsTrigger>
					</TabsList>
				</div>
				<Separator className="my-4" />
				<TabsContent
					value="sound-effects"
					className="mt-0 flex min-h-0 flex-1 flex-col p-5 pt-0"
				>
					<SoundEffectsView />
				</TabsContent>
				<TabsContent
					value="saved"
					className="mt-0 flex min-h-0 flex-1 flex-col p-5 pt-0"
				>
					<SavedSoundsView />
				</TabsContent>
				<TabsContent
					value="songs"
					className="mt-0 flex min-h-0 flex-1 flex-col p-5 pt-0"
				>
					<SongsView />
				</TabsContent>
				<TabsContent
					value="my-music"
					className="mt-0 flex min-h-0 flex-1 flex-col p-5 pt-0"
				>
					<MyMusicView />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function SoundEffectsView() {
	const {
		topSoundEffects,
		isLoading,
		searchQuery,
		setSearchQuery,
		scrollPosition,
		setScrollPosition,
		loadSavedSounds,
		showCommercialOnly,
		toggleCommercialFilter,
		hasLoaded,
		setTopSoundEffects,
		setLoading,
		setError,
		setHasLoaded,
		setCurrentPage,
		setHasNextPage,
		setTotalCount,
	} = useSoundsStore();
	const {
		results: searchResults,
		isLoading: isSearching,
		loadMore,
		hasNextPage,
		isLoadingMore,
	} = useSoundSearch({
		query: searchQuery,
		commercialOnly: showCommercialOnly,
	});

	const [playingId, setPlayingId] = useState<number | null>(null);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
		null,
	);

	const { scrollAreaRef, handleScroll } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore: hasNextPage,
		isLoading: isLoadingMore || isSearching,
	});

	useEffect(() => {
		loadSavedSounds();
	}, [loadSavedSounds]);

	useEffect(() => {
		if (hasLoaded) {
			return;
		}

		let shouldIgnore = false;

		const fetchTopSounds = async () => {
			try {
				if (!shouldIgnore) {
					setLoading({ loading: true });
					setError({ error: null });
				}

				const response = await fetch(
					"/api/sounds/search?page_size=50&sort=downloads",
				);

				if (!shouldIgnore) {
					if (!response.ok) {
						throw new Error(`Failed to fetch: ${response.status}`);
					}

					const data = await response.json();
					setTopSoundEffects({ sounds: data.results });
					setHasLoaded({ loaded: true });

					setCurrentPage({ page: 1 });
					setHasNextPage({ hasNext: !!data.next });
					setTotalCount({ count: data.count });
				}
			} catch (error) {
				if (!shouldIgnore) {
					console.error("Failed to fetch top sounds:", error);
					setError({
						error:
							error instanceof Error ? error.message : "Failed to load sounds",
					});
				}
			} finally {
				if (!shouldIgnore) {
					setLoading({ loading: false });
				}
			}
		};

		const timeoutId = setTimeout(fetchTopSounds, 100, {});

		return () => {
			shouldIgnore = true;
			clearTimeout(timeoutId);
		};
	}, [
		hasLoaded,
		setTopSoundEffects,
		setLoading,
		setError,
		setHasLoaded,
		setCurrentPage,
		setHasNextPage,
		setTotalCount,
	]);

	useEffect(() => {
		if (!scrollAreaRef.current || scrollPosition <= 0) {
			return;
		}

		const restoreScrollPosition = () => {
			scrollAreaRef.current?.scrollTo({ top: scrollPosition });
		};

		const timeoutId = setTimeout(restoreScrollPosition, 100, {});

		return () => clearTimeout(timeoutId);
	}, [scrollPosition, scrollAreaRef]);

	const handleScrollWithPosition = ({
		currentTarget,
	}: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop } = currentTarget;
		setScrollPosition({ position: scrollTop });
		handleScroll({ currentTarget } as React.UIEvent<HTMLDivElement>);
	};

	const displayedSounds = searchQuery ? searchResults : topSoundEffects;

	const playSound = ({ sound }: { sound: SoundEffect }) => {
		if (playingId === sound.id) {
			audioElement?.pause();
			setPlayingId(null);
			return;
		}

		audioElement?.pause();

		if (sound.previewUrl) {
			const audio = new Audio(sound.previewUrl);
			audio.addEventListener("ended", () => {
				setPlayingId(null);
			});
			audio.addEventListener("error", () => {
				setPlayingId(null);
			});
			audio.play().catch((error) => {
				console.error("Failed to play sound preview:", error);
				setPlayingId(null);
			});

			setAudioElement(audio);
			setPlayingId(sound.id);
		}
	};

	return (
		<div className="mt-1 flex h-full flex-col gap-5">
			<div className="flex items-center gap-3">
				<Input
					placeholder="Search sound effects"
					className="w-full"
					containerClassName="w-full"
					value={searchQuery}
					onChange={({ currentTarget }) =>
						setSearchQuery({ query: currentTarget.value })
					}
					showClearIcon
					onClear={() => setSearchQuery({ query: "" })}
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="text"
							size="icon"
							className={cn(showCommercialOnly && "text-primary")}
						>
							<HugeiconsIcon icon={FilterMailIcon} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuCheckboxItem
							checked={showCommercialOnly}
							onCheckedChange={() => toggleCommercialFilter()}
						>
							Show only commercially licensed
						</DropdownMenuCheckboxItem>
						<div className="text-muted-foreground px-2 py-1.5 text-xs">
							{showCommercialOnly
								? "Only showing sounds licensed for commercial use"
								: "Showing all sounds regardless of license"}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="relative h-full overflow-hidden">
				<ScrollArea
					className="h-full flex-1"
					ref={scrollAreaRef}
					onScrollCapture={handleScrollWithPosition}
				>
					<div className="flex flex-col gap-4">
						{isLoading && !searchQuery && (
							<div className="text-muted-foreground text-sm">
								Loading sounds...
							</div>
						)}
						{isSearching && searchQuery && (
							<div className="text-muted-foreground text-sm">Searching...</div>
						)}
						{displayedSounds.map((sound) => (
							<AudioItem
								key={sound.id}
								sound={sound}
								isPlaying={playingId === sound.id}
								onPlay={playSound}
							/>
						))}
						{!isLoading && !isSearching && displayedSounds.length === 0 && (
							<div className="text-muted-foreground text-sm">
								{searchQuery ? "No sounds found" : "No sounds available"}
							</div>
						)}
						{isLoadingMore && (
							<div className="text-muted-foreground py-4 text-center text-sm">
								Loading more sounds...
							</div>
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}

function SavedSoundsView() {
	const {
		savedSounds,
		isLoadingSavedSounds,
		savedSoundsError,
		loadSavedSounds,
		clearSavedSounds,
	} = useSoundsStore();

	const [playingId, setPlayingId] = useState<number | null>(null);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
		null,
	);

	const [showClearDialog, setShowClearDialog] = useState(false);

	useEffect(() => {
		loadSavedSounds();
	}, [loadSavedSounds]);

	const playSound = ({ sound }: { sound: SoundEffect }) => {
		if (playingId === sound.id) {
			audioElement?.pause();
			setPlayingId(null);
			return;
		}

		audioElement?.pause();

		if (sound.previewUrl) {
			const audio = new Audio(sound.previewUrl);
			audio.addEventListener("ended", () => {
				setPlayingId(null);
			});
			audio.addEventListener("error", () => {
				setPlayingId(null);
			});
			audio.play().catch((error) => {
				console.error("Failed to play sound preview:", error);
				setPlayingId(null);
			});

			setAudioElement(audio);
			setPlayingId(sound.id);
		}
	};

	const convertToSoundEffect = ({
		savedSound,
	}: {
		savedSound: SavedSound;
	}): SoundEffect => ({
		id: savedSound.id,
		name: savedSound.name,
		description: "",
		url: "",
		previewUrl: savedSound.previewUrl,
		downloadUrl: savedSound.downloadUrl,
		duration: savedSound.duration,
		filesize: 0,
		type: "audio",
		channels: 0,
		bitrate: 0,
		bitdepth: 0,
		samplerate: 0,
		username: savedSound.username,
		tags: savedSound.tags,
		license: savedSound.license,
		created: savedSound.savedAt,
		downloads: 0,
		rating: 0,
		ratingCount: 0,
	});

	if (isLoadingSavedSounds) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-muted-foreground text-sm">
					Loading saved sounds...
				</div>
			</div>
		);
	}

	if (savedSoundsError) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-destructive text-sm">
					Error: {savedSoundsError}
				</div>
			</div>
		);
	}

	if (savedSounds.length === 0) {
		return (
			<div className="bg-background flex h-full flex-col items-center justify-center gap-3 p-4">
				<HugeiconsIcon
					icon={FavouriteIcon}
					className="text-muted-foreground size-10"
				/>
				<div className="flex flex-col gap-2 text-center">
					<p className="text-lg font-medium">No saved sounds</p>
					<p className="text-muted-foreground text-sm text-balance">
						Click the heart icon on any sound to save it here
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-1 flex h-full flex-col gap-5">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					{savedSounds.length} saved{" "}
					{savedSounds.length === 1 ? "sound" : "sounds"}
				</p>
				<Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
					<DialogTrigger asChild>
						<Button
							variant="text"
							size="sm"
							className="text-muted-foreground hover:text-destructive h-auto !opacity-100"
						>
							Clear all
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Clear all saved sounds?</DialogTitle>
							<DialogDescription>
								This will permanently remove all {savedSounds.length} saved
								sounds from your collection. This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="text" onClick={() => setShowClearDialog(false)}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={async ({
									stopPropagation,
								}: React.MouseEvent<HTMLButtonElement>) => {
									stopPropagation();
									await clearSavedSounds();
									setShowClearDialog(false);
								}}
							>
								Clear all sounds
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="relative h-full overflow-hidden">
				<ScrollArea className="h-full flex-1">
					<div className="flex flex-col gap-4">
						{savedSounds.map((sound) => (
							<AudioItem
								key={sound.id}
								sound={convertToSoundEffect({ savedSound: sound })}
								isPlaying={playingId === sound.id}
								onPlay={playSound}
							/>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}

function SongsView() {
	return <div>Songs</div>;
}

// ---------------------------------------------------------------------------
// My Music — user-uploaded audio files
// ---------------------------------------------------------------------------

function formatSeconds(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

function MyMusicView() {
	const editor = useEditor();
	const activeProject = editor.project.getActive();

	// All uploaded media assets, filtered to audio only
	const allAssets = editor.media.getAssets();
	const audioAssets = allAssets.filter((a) => a.type === "audio");

	const [playingId, setPlayingId] = useState<string | null>(null);
	const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);

	const handleFiles = async (files: FileList) => {
		if (!activeProject) {
			toast.error("No active project");
			return;
		}
		// Reject any non-audio files up front
		const audioFiles = Array.from(files).filter((f) =>
			f.type.startsWith("audio/"),
		);
		if (audioFiles.length === 0) {
			toast.error("Please upload audio files only (mp3, wav, aac, flac…)");
			return;
		}
		if (audioFiles.length < files.length) {
			toast.warning(
				"Only audio files were added; other file types were ignored.",
			);
		}

		setIsProcessing(true);
		try {
			const dt = new DataTransfer();
			for (const f of audioFiles) dt.items.add(f);
			const processed = await processMediaAssets({ files: dt.files });
			for (const asset of processed) {
				await editor.media.addMediaAsset({
					projectId: activeProject.metadata.id,
					asset,
				});
			}
			toast.success(
				`${processed.length} track${processed.length !== 1 ? "s" : ""} added`,
			);
		} catch (err) {
			console.error("Failed to upload audio:", err);
			toast.error("Failed to upload audio");
		} finally {
			setIsProcessing(false);
		}
	};

	const { isDragOver, dragProps, openFilePicker, fileInputProps } =
		useFileUpload({
			accept: "audio/*",
			multiple: true,
			onFilesSelected: handleFiles,
		});

	const togglePlay = (asset: MediaAsset) => {
		if (playingId === asset.id) {
			audioEl?.pause();
			setPlayingId(null);
			return;
		}
		audioEl?.pause();
		if (!asset.url) return;
		const a = new Audio(asset.url);
		a.addEventListener("ended", () => setPlayingId(null));
		a.addEventListener("error", () => setPlayingId(null));
		a.play().catch(() => setPlayingId(null));
		setAudioEl(a);
		setPlayingId(asset.id);
	};

	const addToTimeline = (asset: MediaAsset) => {
		const currentTime = editor.playback.getCurrentTime();
		const duration = asset.duration ?? 5;
		const element = buildElementFromMedia({
			mediaId: asset.id,
			mediaType: asset.type,
			name: asset.name,
			duration,
			startTime: currentTime,
		});
		editor.timeline.insertElement({ element, placement: { mode: "auto" } });
		toast.success(`"${asset.name}" added to timeline`);
	};

	const removeAsset = async (id: string) => {
		if (!activeProject) return;
		if (playingId === id) {
			audioEl?.pause();
			setPlayingId(null);
		}
		await editor.media.removeMediaAsset({
			projectId: activeProject.metadata.id,
			id,
		});
		setRemoveConfirmId(null);
	};

	const showDropZone = isDragOver || audioAssets.length === 0;

	return (
		<div className="flex h-full flex-col gap-4">
			{/* hidden file input */}
			<input {...fileInputProps} accept="audio/*" />

			{/* header row */}
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-xs">
					{audioAssets.length > 0
						? `${audioAssets.length} track${audioAssets.length !== 1 ? "s" : ""}`
						: "Upload your music to use while editing"}
				</p>
				<Button
					variant="outline"
					size="sm"
					className="gap-1.5"
					onClick={openFilePicker}
					disabled={isProcessing}
				>
					<HugeiconsIcon icon={CloudUploadIcon} className="size-4" />
					{isProcessing ? "Uploading…" : "Upload"}
				</Button>
			</div>

			{/* drop zone / list */}
			<div
				className={cn(
					"relative flex-1 overflow-hidden rounded-lg transition-colors",
					isDragOver && "ring-primary bg-primary/5 ring-2",
				)}
				{...dragProps}
			>
				{showDropZone ? (
					<button
						type="button"
						onClick={openFilePicker}
						className={cn(
							"flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors",
							isDragOver
								? "border-primary text-primary"
								: "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/60",
						)}
					>
						<HugeiconsIcon icon={MusicNote03Icon} className="size-10" />
						<div className="flex flex-col items-center gap-1 text-sm">
							<span className="font-medium">
								{isDragOver ? "Drop audio here" : "Click or drag audio files"}
							</span>
							<span className="text-xs opacity-70">
								MP3, WAV, AAC, FLAC, OGG and more
							</span>
						</div>
					</button>
				) : (
					<ScrollArea className="h-full">
						<div className="flex flex-col gap-2 pb-2">
							{audioAssets.map((asset) => (
								<div
									key={asset.id}
									className="group flex items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-accent/40"
								>
									{/* play button */}
									<button
										type="button"
										onClick={() => togglePlay(asset)}
										className="bg-accent relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md"
									>
										<div className="from-primary/20 absolute inset-0 bg-gradient-to-br to-transparent" />
										<HugeiconsIcon
											icon={playingId === asset.id ? PauseIcon : PlayIcon}
											className="size-5"
										/>
									</button>

									{/* name + duration */}
									<div className="min-w-0 flex-1 overflow-hidden">
										<p className="truncate text-sm font-medium">{asset.name}</p>
										{asset.duration != null && (
											<span className="text-muted-foreground block text-xs">
												{formatSeconds(asset.duration)}
											</span>
										)}
									</div>

									{/* actions */}
									<div className="flex shrink-0 items-center gap-1 pr-1">
										<Button
											variant="text"
											size="icon"
											className="text-muted-foreground hover:text-foreground !opacity-100"
											onClick={() => addToTimeline(asset)}
											title="Add to timeline"
										>
											<HugeiconsIcon icon={PlusSignIcon} className="size-4" />
										</Button>

										<Dialog
											open={removeConfirmId === asset.id}
											onOpenChange={(open) =>
												setRemoveConfirmId(open ? asset.id : null)
											}
										>
											<DialogTrigger asChild>
												<Button
													variant="text"
													size="icon"
													className="text-muted-foreground hover:text-destructive !opacity-100"
													title="Remove track"
												>
													<HugeiconsIcon
														icon={Delete02Icon}
														className="size-4"
													/>
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Remove track?</DialogTitle>
													<DialogDescription>
														"{asset.name}" will be removed from your project.
														This cannot be undone.
													</DialogDescription>
												</DialogHeader>
												<DialogFooter>
													<Button
														variant="text"
														onClick={() => setRemoveConfirmId(null)}
													>
														Cancel
													</Button>
													<Button
														variant="destructive"
														onClick={() => removeAsset(asset.id)}
													>
														Remove
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</div>
		</div>
	);
}

interface AudioItemProps {
	sound: SoundEffect;
	isPlaying: boolean;
	onPlay: ({ sound }: { sound: SoundEffect }) => void;
}

function AudioItem({ sound, isPlaying, onPlay }: AudioItemProps) {
	const { addSoundToTimeline, isSoundSaved, toggleSavedSound } =
		useSoundsStore();
	const isSaved = isSoundSaved({ soundId: sound.id });

	const handleClick = () => {
		onPlay({ sound });
	};

	const handleSaveClick = ({
		stopPropagation,
	}: React.MouseEvent<HTMLButtonElement>) => {
		stopPropagation();
		toggleSavedSound({ soundEffect: sound });
	};

	const handleAddToTimeline = async ({
		stopPropagation,
	}: React.MouseEvent<HTMLButtonElement>) => {
		stopPropagation();
		await addSoundToTimeline({ sound });
	};

	return (
		<div className="group flex items-center gap-3 opacity-100 hover:opacity-75">
			<button
				type="button"
				className="flex min-w-0 flex-1 items-center gap-3 text-left"
				onClick={handleClick}
			>
				<div className="bg-accent relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
					<div className="from-primary/20 absolute inset-0 bg-gradient-to-br to-transparent" />
					{isPlaying ? (
						<HugeiconsIcon icon={PauseIcon} className="size-5" />
					) : (
						<HugeiconsIcon icon={PlayIcon} className="size-5" />
					)}
				</div>

				<div className="min-w-0 flex-1 overflow-hidden">
					<p className="truncate text-sm font-medium">{sound.name}</p>
					<span className="text-muted-foreground block truncate text-xs">
						{sound.username}
					</span>
				</div>
			</button>

			<div className="flex items-center gap-3 pr-2">
				<Button
					variant="text"
					size="icon"
					className="text-muted-foreground hover:text-foreground w-auto !opacity-100"
					onClick={handleAddToTimeline}
					title="Add to timeline"
				>
					<HugeiconsIcon icon={PlusSignIcon} />
				</Button>
				<Button
					variant="text"
					size="icon"
					className={`hover:text-foreground w-auto !opacity-100 ${
						isSaved
							? "text-red-500 hover:text-red-600"
							: "text-muted-foreground"
					}`}
					onClick={handleSaveClick}
					title={isSaved ? "Remove from saved" : "Save sound"}
				>
					<HugeiconsIcon
						icon={FavouriteIcon}
						className={`${isSaved ? "fill-current" : ""}`}
					/>
				</Button>
			</div>
		</div>
	);
}
