# Tower Blocks

A 3D tower stacking browser game (Three.js + GSAP), originally from CodePen.

## Cursor Cloud specific instructions

### Key architecture notes

- `script.ts` uses **non-standard TypeScript** (CodePen-style `const` inside class bodies). A custom Vite plugin in `vite.config.js` transforms these to valid class field declarations at serve/build time. The original file on disk remains as-is.
- Three.js and GSAP are imported via the Vite plugin's `load` hook (injected `import` statements). The source `script.ts` references `THREE`, `TweenLite`, and `Power1` as globals.
- `index.html` was updated from a CodePen fragment to a proper HTML page with Vite's module entry point.

### Running the dev server

```
npm run dev
```

Starts Vite on port 5173 (all interfaces). The game renders at http://localhost:5173/.

### Lint

```
npm run lint
```

Uses ESLint with `@typescript-eslint`. Expect 2 warnings in `script.ts` (unused vars from original CodePen code) — these are intentional.

### Build

```
npm run build
```

Produces a production bundle in `dist/`. The Three.js chunk is ~550 KB (expected).

### Gotchas

- If you update Three.js to a new major version, check for deprecated API changes (e.g., `applyMatrix` → `applyMatrix4`, `shading: THREE.FlatShading` → `flatShading: true`).
- The `gsap` package exports `TweenLite` and `Power1` at the top level — no sub-path import needed.
- SCSS variables (e.g., `$color-dark`) are only used in `style.scss`; Vite compiles SCSS automatically via the `sass` dev dependency.
