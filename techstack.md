# 🛠️ Tech Stack — VisionAstra VideoEditor

## 🏗️ Framework & Language

| Technology | Role |
|---|---|
| **Next.js 16** (App Router) | Core web framework |
| **TypeScript** | Primary language throughout |
| **React** | UI component library |

---

## 📦 Monorepo & Tooling

| Technology | Role |
|---|---|
| **Bun** | Package manager & runtime |
| **Turbo** | Monorepo build system |
| **Biome** | Linting & code formatting |

**Monorepo Structure:**
- `apps/web/` — Main Next.js application
- `packages/ui/` — Shared UI components
- `packages/env/` — Shared environment config

---

## 🎨 Styling & UI

| Technology | Role |
|---|---|
| **Tailwind CSS v4** | Utility-first styling |
| **Radix UI** | Accessible UI primitives |
| **Motion** *(formerly Framer Motion)* | Animations & transitions |

---

## ⚙️ State Management

| Technology | Role |
|---|---|
| **Zustand** | Transient UI state (panels, tabs, interactions) |
| **Reactive Manager Pattern** | Core editor state via Singleton `EditorCore` |

### Dual-Layer Strategy
1. **UI State (Zustand)** — manages transient states like panel visibility, active tabs, and user interactions.
2. **Core State (Reactive Managers)** — `EditorCore` and its managers are the source of truth for the editing session, using a Subscribe/Notify pattern to alert the UI of changes.

---

## 🎬 Video Processing & Rendering

| Technology | Role |
|---|---|
| **FFmpeg.wasm** | Client-side video encoding & processing via WebAssembly |
| **Custom Canvas Renderer** | Real-time preview rendering via HTML `<canvas>` |

### Rendering Details
- **Preview**: A custom `CanvasRenderer` draws the timeline state in real-time to a `<canvas>` element, optimised for performance.
- **Export**: `RendererManager` coordinates with **FFmpeg.wasm** to encode the final video, processing the timeline sequentially and rendering each frame to an offscreen canvas before passing it to FFmpeg.

---

## 🔐 Authentication

| Technology | Role |
|---|---|
| **Better Auth** | Full authentication system |

---

## 🗄️ Database & Persistence

The project uses a **dual-persistence strategy** — one for the browser (local), one for the cloud (server-side).

### 1. 🌿 MongoDB (Server-side / Cloud)
- Stores **project metadata** and **user data** on the server
- Run locally via **Docker**: `docker compose up -d mongo redis`
- Paired with **Redis** for caching and session management

### 2. 🧠 IndexedDB (Client-side / Local)
- Handled via the **`mediabunny`** library directly in the browser
- Provides **automatic local project auto-save**, so work is never lost on page refresh
- Also used for caching media assets locally

### 3. ⚡ Redis (Cache / Sessions)
- Run alongside MongoDB via Docker (`serverless-redis-http`)
- Used for caching and server-side session handling

> **Note:** Docker (MongoDB + Redis) is **optional**. You can skip it if working on frontend/UI features only — the app runs without it, just without authentication or cloud saving.

---

## 🧠 Core Architecture: `EditorCore`

The heart of the application is the `EditorCore` (located in `apps/web/src/core`), a **Singleton** that orchestrates all editing operations through specialised domain managers:

| Manager | Responsibility |
|---|---|
| `ProjectManager` | Project lifecycle — create, load, save, export |
| `TimelineManager` | Multi-track timeline, clips, and effects |
| `ScenesManager` | Multiple scenes within a single project |
| `MediaManager` | Asset loading, management, and resource cleanup |
| `RendererManager` | Real-time preview rendering and final export |
| `CommandManager` | Undo/Redo via the Command Pattern |
| `AudioManager` | Audio playback, waveform generation, synchronisation |
| `SelectionManager` | Tracks selected elements across timeline and UI |
| `PlaybackManager` | Controls playhead, seeking, and playback state |

---

## 📋 Quick Reference Summary

```
Frontend:   Next.js 16 + TypeScript + React
Styling:    Tailwind CSS v4 + Radix UI + Motion (Framer Motion)
State:      Zustand (UI) + EditorCore Managers (Core)
Video:      FFmpeg.wasm (WebAssembly) + Canvas API
Auth:       Better Auth
DB (cloud): MongoDB (via Docker)
DB (local): IndexedDB (via mediabunny library)
Cache:      Redis (via Docker)
Tooling:    Bun + Turbo + Biome
```

---

## 🚀 Getting Started (Quick Reference)

```bash
# 1. Install dependencies
bun install

# 2. Start required services (MongoDB + Redis) — optional for UI-only work
docker compose up -d mongo redis serverless-redis-http

# 3. Set up environment variables
Copy-Item apps/web/.env.example apps/web/.env.local  # Windows
cp apps/web/.env.example apps/web/.env.local          # Unix/Mac

# 4. Start the development server
bun dev:web
```

App runs at **http://localhost:3000**
