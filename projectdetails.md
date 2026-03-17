# 🎬 Project Details: VisionAstra VideoEditor (OpenCut)

## 📌 Project Title
**VisionAstra VideoEditor** (Internal name: **OpenCut**)

## 🎯 Objective
To provide a **privacy-first, browser-based video editing experience** that is powerful yet simple enough for anyone to use. The goal is to offer features similar to popular editors like CapCut but with a focus on user privacy (keeping data on-device) and removing common paywalls/watermarks.

## 📝 Brief Summary
OpenCut is a high-performance video editor running entirely in the browser. It leverages **WebAssembly (FFmpeg.wasm)** for client-side processing and a custom **Canvas-based rendering engine** for real-time previews. It features a multi-track timeline, support for video/audio/text layers, and an advanced state management system that ensures a smooth editing experience without the need for expensive hardware or cloud processing for basic edits.

---

## 💻 Tech Stack Used
### Framework & Language
- **Next.js 16 (App Router)**: Core web framework.
- **TypeScript**: Ensuring type safety across the monorepo.
- **React**: UI component library.

### Monorepo & Tooling
- **Bun**: Fast package manager and runtime.
- **Turbo**: Monorepo build system for optimized builds and caching.
- **Biome**: Modern linting and code formatting tool.

### Styling & UI
- **Tailwind CSS v4**: Utility-first styling.
- **Radix UI**: Accessible UI primitives for complex components like dialogs and dropdowns.
- **Motion (Framer Motion)**: For smooth animations and transitions.

### Video Processing & Rendering
- **FFmpeg.wasm**: Enables full video encoding and processing directly in the browser via WebAssembly.
- **Custom Canvas Renderer**: A specialized engine that draws the timeline in real-time to an HTML5 canvas.

### State Management
- **Zustand**: Handles transient UI states (panels, active tabs).
- **Reactive Manager Pattern**: A singleton `EditorCore` orchestrates complex domain logic (timeline, projects, media) through specialized managers.

---

## 🔑 How to get the API Keys
To fully utilize all features, you may need the following API keys in your `.env.local` file:
1.  **MongoDB**: Get a connection string from [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
2.  **Upstash Redis**: Sign up at [Upstash](https://upstash.com/) to get `REST_URL` and `REST_TOKEN` for server-side caching.
3.  **Freesound**: Register at [Freesound.org](https://freesound.org/help/developers/) to get a `CLIENT_ID` and `API_KEY` for the sound library.
4.  **Cloudflare R2**: Used for storing large files like transcriptions. Get your credentials from the [Cloudflare Dashboard](https://dash.cloudflare.com/).
5.  **Marble CMS**: Used for the project's blog. Get your workspace key at [Marble CMS](https://marblecms.com).

---

## 🏗️ Architecture (Frontend & Backend)

### 🎨 Frontend
The frontend is a Next.js application structured as a monorepo:
-   **`apps/web`**: The main editor application.
-   **`packages/ui`**: Shared, reusable UI components.
-   **`src/core`**: Contains the `EditorCore` which manages:
    -   `TimelineManager`: Handles tracks, clips, and effects.
    -   `RendererManager`: Coordinates real-time preview and export.
    -   `ProjectManager`: Manages the lifecycle of user projects.

### ⚙️ Backend
The project uses a hybrid backend approach via Next.js API routes and external services:
-   **Authentication**: Managed by **Better Auth**, providing secure user sessions.
-   **Analytics**: Provided by **Databuddy**, focused on privacy and non-invasive tracking.
-   **Transcription Server**: A separate service (defined via `MODAL_TRANSCRIPTION_URL`) handled transcription tasks.

---

## 🗄️ Databases
The project employs a **dual-persistence strategy** to balance performance and reliability.

### 1. MongoDB (Server-side / Cloud)
-   **Purpose**: Stores project metadata, user profiles, and shared project data.
-   **Usage**: Ensures that users can access their project info across different devices (when logged in).

### 2. IndexedDB (Client-side / Local)
-   **Purpose**: The primary storage for "hot" project data and media assets.
-   **Mechanism**: Handled via the **`mediabunny`** library.
-   **Benefit**: Provides **automatic local auto-saves**. If the browser crashes or the page is refreshed, your work is instantly recovered without needing a round-trip to the server.

### 3. Redis (Cache & Session)
-   **Purpose**: Used for high-speed caching and managing server-side sessions.
-   **Mechanism**: Integrated with Next.js and Better Auth via **Upstash Redis**.

---

## 🚀 How to Set Up Project (Local Run)

### Prerequisites
-   **Bun** (v1.2.18 or higher)
-   **Docker** (Optional, for running MongoDB/Redis locally)

### Step-by-Step Setup
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/Shubham1905s/VideoEditor.git
    cd VideoEditor
    ```
2.  **Install Dependencies**:
    ```bash
    bun install
    ```
3.  **Configure Environment**:
    -   Copy `.env.example` to `apps/web/.env.local`
    -   Update the keys as mentioned in the "API Keys" section.
4.  **Start Local Services (Optional)**:
    -   If you want to run MongoDB and Redis locally via Docker:
    ```bash
    docker compose up -d mongo redis serverless-redis-http
    ```
5.  **Run Development Server**:
    ```bash
    bun dev:web
    ```
6.  **Access the App**:
    -   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Live Project Link
Experience the editor live here: [https://visionastra.vercel.app/2](https://visionastra.vercel.app/2)
