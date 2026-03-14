# Project Architecture: OpenCut Video Editor

## Overview
OpenCut is a high-performance, browser-based video editor built with modern web technologies. It leverages WebAssembly (FFmpeg) for client-side video processing and a custom-built rendering engine for real-time previews. The project follows a monorepo structure, separating the core editor logic from the web application and shared UI components.

---

## Monorepo Structure
The project is managed using **Turbo** and **Bun**, organized into the following workspace directories:

- **`apps/web`**: The main Next.js application, containing the editor UI, landing pages, and core editing logic.
- **`packages/ui`**: A shared library of UI components and icons.
- **`packages/env`**: Shared environment variable configuration and validation.

---

## Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (UI state) & Reactive Manager Pattern (Core logic)
- **Video Processing**: [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
- **Rendering**: Custom Canvas-based renderer
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Database/Persistence**: [MongoDB](https://www.mongodb.com/) (Server-side) & [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (Client-side via `mediabunny`)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Content Management**: [Content Collections](https://www.content-collections.dev/) (for changelogs, etc.)

---

## Core Architecture: The `EditorCore`
The heart of the application is the `EditorCore` (located in `apps/web/src/core`), which acts as a central orchestrator using the **Singleton pattern**. It manages several specialized domain managers:

### Specialized Managers
- **`ProjectManager`**: Handles project lifecycle (create, load, save, export).
- **`TimelineManager`**: Core logic for managing multi-track timelines, clips, and effects.
- **`ScenesManager`**: Manages multiple scenes within a single project.
- **`MediaManager`**: Handles asset loading, management, and resource cleanup.
- **`RendererManager`**: Coordinates real-time preview rendering and final export.
- **`CommandManager`**: Implements the **Command Pattern** to provide a robust Undo/Redo system.
- **`AudioManager`**: Manages audio playback, waveform generation, and synchronization.
- **`SelectionManager`**: Tracks currently selected elements across the timeline and UI.
- **`PlaybackManager`**: Controls the playhead, seeking, and playback state.

---

## State Management & Data Flow
The project employs a dual-layered state management strategy:

1.  **UI State (Zustand)**: Used for managing transient UI states like panel visibility, active tabs, and temporary user interactions.
2.  **Core State (Reactive Managers)**: The `EditorCore` and its managers maintain the "source of truth" for the editing session. Managers use a **Subscription Pattern** (`subscribe`/`notify`) to alert the UI and other systems of changes.

### Data Flow Example (Adding a Clip):
1.  **User Action**: User drops a video onto the timeline.
2.  **Command Execution**: The UI calls `TimelineManager`, which creates an `AddTrackItemCommand`.
3.  **Command Execution**: The `CommandManager` executes the command, which updates the internal project data structure.
4.  **Notification**: The `TimelineManager` notifies its subscribers that the timeline has changed.
5.  **UI Update**: Zustand stores or React components subscribed to the manager re-render to reflect the new state.

---

## Video Editing & Rendering
### Timeline System
The timeline is multi-track and supports various media types (Video, Audio, Image, Text). It implements complex editing operations:
- Trimming and Splitting
- Ripple Editing
- Layering and Compositing

### Rendering Engine
- **Preview**: A custom `CanvasRenderer` draws the timeline state in real-time to a `<canvas>` element, optimized for performance.
- **Export**: The `RendererManager` coordinates with **FFmpeg.wasm** to encode the final video. It processes the timeline sequentially, rendering each frame to an offscreen canvas before passing it to FFmpeg.

---

## Persistence
- **Local Persistence**: Projects are automatically saved to the browser's **IndexedDB** using the `mediabunny` library, ensuring work is not lost on page refreshes.
- **Cloud Persistence**: (If enabled) Project metadata and user data are synced to a **MongoDB** database.
- **Asset Storage**: Media assets are typically stored locally in the browser's file system or cached via service workers to minimize re-downloads.

---

## Advanced Features & Internal Documentation
More detailed technical documentation for specific subsystems can be found in the `docs/` directory:
- **[Actions](docs/actions.md)**: Detailed breakdown of the command system.
- **[Effects Renderer](docs/effects-renderer.md)**: Architecture and implementation of the real-time visual effects system.
- **[Keyframes](docs/keyframes.md)**: Logic behind animation and property interpolation over time.
- **[Countries Search](docs/countries-search.md)**: Implementation of the localized search functionality.

---

## Development Standards
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Monorepo Tooling**: [Turbo](https://turbo.build/)
- **Package Management**: [Bun](https://bun.sh/)
- **Testing**: (Infrastructure present, typically Vitest/Playwright)
