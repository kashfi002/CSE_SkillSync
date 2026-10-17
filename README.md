# CSE SkillSync

A React single-page app built with Vite. The current screens use hash-based navigation and in-memory demo data.

## Getting started

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it locally with `npm run preview`.

## Project structure

- `src/App.jsx` — app state, hash navigation, and shared page layout
- `src/components/` — shared UI components and app navigation
- `src/context/` — React context for app state
- `src/data/` — demo data and shared utilities
- `src/pages/` — route-specific page components
- `src/styles.css` — global styles
- `src/main.jsx` — React entry point
