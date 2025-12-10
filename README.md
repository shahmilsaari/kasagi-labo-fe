# Anime Explorer 🎌🌙

A modern anime exploration experience with a dark-first UI, smooth animations, and persistent favorites powered by React, TypeScript, Zustand, and shadcn/ui.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Table of Contents
1. [Why Anime Explorer](#why-anime-explorer)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Scripts](#scripts)
7. [Design Notes](#design-notes)

## Why Anime Explorer
- Dark-leaning layout with glassmorphism and gradient accents keeps the experience cinematic.
- Lottie-powered anime spinner and Framer Motion cues maintain the thematic feel during every transition.
- Zustand-backed favorites let users sort, analyze, and revisit the anime they love.

## Features ✨

### 🌙 Theme & Layout
- **Dark mode by default** with a persistent toggle that respects system preference.
- **Glassmorphism-inspired cards** with blur, neon borders, and `dark:` variants.
- **Animated loader** rendered through a custom Lottie file to feel more anime than a simple icon.

### 📺 Exploration Experience
- Anime list with infinite scroll, search, and genre filter pills.
- Detailed view with a hero banner, stats, and tappable metadata.
- Responsive grid (2-6 columns) with hover/shadow depth.
- Seamless navigation and animated page transitions via Framer Motion.

### ❤️ Favorites & Analytics
- Add/remove with subtle heart animations, persistence via localStorage.
- Statistics cards (total count, average score, top-rated, latest addition).
- Sorting by Recently Added, Highest Rated, Title (A-Z), and First Added.
- Smart removal confirmation with toast and badges for newly added entries.

### 🧠 Technical Highlights
- **API queueing** respects Jikan rate limits and surfaces friendly error states.
- **Global state** via Zustand keeps favorites performant across the app.
- **Type-safe** codebase (strict TypeScript) with Vitest + RTL coverage.
- **shadcn/ui + Tailwind** deliver accessible, theme-aware primitives.
- **Lottie + Framer Motion** deliver the animated sparkle throughout.

## Tech Stack 🛠️
- **React 18.2.0** + **TypeScript 5.2.2**
- **Vite 5.0.8** bundler with TS performance hints
- **React Router v6.20** for routes
- **Zustand** for global state and localStorage sync
- **Axios** + Jikan API (with request queue controller)
- **Tailwind CSS 3.3.6** + **shadcn/ui** for component styling
- **Lucide React / React Icons** for iconography
- **Framer Motion / Lottie React** for motion
- **Vitest / RTL** for tests, **ESLint** for linting

## Project Structure 📁

```
src/
├── assets/
│   └── animations/          # Anime-themed Lottie data
├── components/
│   ├── AnimeDetail/         # Detail screen + dark mode polish
│   ├── AnimeList/           # Infinite scroll and cards
│   ├── FilterBar/           # Search + genre filters
│   ├── LoadingSpinner/      # Lottie spinner
│   ├── Layout/              # Header + theme toggle
│   ├── Favorites/           # Stats, sort, and removal flows
│   └── ui/                  # shadcn/ui wrappers
├── hooks/
│   ├── useAnimeList.ts      # Anime list data + pagination
│   └── useAnimeDetail.ts    # Fetch single anime
├── lib/
│   └── utils.ts             # Utility helpers (`cn`, etc.)
├── pages/
│   └── Home.tsx             # Home layout
├── services/
│   └── api.ts               # Queued Jikan API client
├── store/
│   └── useAnimeStore.ts     # Zustand favorites
├── types/
│   └── anime.ts             # Type definitions
├── App.tsx                  # ThemeProvider + router
├── main.tsx                 # Entry point
└── index.css                # Global variables + transitions
```

## Getting Started 🚀

### Prerequisites
- Node.js v18+ (npm 10 or yarn 1.22+ recommended)

### Quick Start
```bash
git clone <repository-url>
cd kasagi-labo-fe
npm install
npm run dev
```
Then visit `http://localhost:5173` (default Vite port) in your browser.

### Tips
- Keep the Favorites panel in view on desktop by scrolling near the right column.
- Toggle the moon/sun icon in the header to double-check dark mode styles.

## Configuration 🧩
- Copy `.env.example` to `.env` (or create a new `.env` file) and set `VITE_API_BASE_URL` to the API host you want to query.
- When the variable is not defined, the client automatically falls back to `https://api.jikan.moe/v4`, but updating the URL lets you point to proxies or mocks without touching the repo.
- `.env` files are ignored by `.gitignore`, so each developer can keep their URL private or specific to the environment.

## Scripts 📜
```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview build locally
npm run test       # Run unit tests (Vitest)
npm run test:ui    # Vitest UI runner
npm run lint       # ESLint with strict options
```

## Design Notes 🎨
- **Dark mode details**: Every panel now has `dark:` states so the detail screen feels cohesive (including cards, buttons, and error overlays).
- **Loading state**: Replaced the lucide spinner with a Lottie animation stored at `src/assets/animations/animeSpinner.json` for a signature anime loading cue.
- **Contextual shadows and gradients** keep the UI grounded in the anime/time-of-day theme even when the hero banner is gone.
