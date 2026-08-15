# Graph Report - C:\Users\imwdi\.gemini\antigravity\scratch\optivision-react  (2026-08-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 74 nodes · 74 edges · 22 communities (13 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ffb374c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- package.json
- .oxlintrc.json
- react
- App.jsx
- devDependencies
- oxlint
- postcss
- tailwindcss
- @tailwindcss/postcss
- @types/react
- @types/react-dom
- vite
- @vitejs/plugin-react

## God Nodes (most connected - your core abstractions)
1. `react` - 12 edges
2. `scripts` - 5 edges
3. `plugins` - 3 edges
4. `rules` - 3 edges
5. `App()` - 2 edges
6. `AnimatedLogo()` - 2 edges
7. `WaveTitle()` - 2 edges
8. `gsap` - 2 edges
9. `@gsap/react` - 2 edges
10. `lucide-react` - 2 edges

## Surprising Connections (you probably didn't know these)
- `plugins` --extends--> `react`  [EXTRACTED]
  .oxlintrc.json → .oxlintrc.json  _Bridges community 2 → community 3_

## Import Cycles
- None detected.

## Communities (22 total, 9 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.18
Nodes (11): gsap, @gsap/react, lucide-react, dependencies, gsap, @gsap/react, lucide-react, react (+3 more)

### Community 1 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 2 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 4 - "App.jsx"
Cohesion: 0.43
Nodes (3): App(), AnimatedLogo(), WaveTitle()

### Community 5 - "devDependencies"
Cohesion: 0.67
Nodes (3): autoprefixer, devDependencies, autoprefixer

## Knowledge Gaps
- **26 isolated node(s):** `gsap`, `@gsap/react`, `lucide-react`, `react`, `react-dom` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`, `oxlint`, `postcss`, `tailwindcss`, `@tailwindcss/postcss`, `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `.oxlintrc.json`, `App.jsx`, `Hero.jsx`, `Operativos.jsx`, `InteractiveExperiences.jsx`, `WhoWeAre.jsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **What connects `gsap`, `@gsap/react`, `lucide-react` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._