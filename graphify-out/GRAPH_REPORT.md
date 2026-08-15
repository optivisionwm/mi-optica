# Graph Report - optivision-react  (2026-08-15)

## Corpus Check
- 25 files · ~360,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 147 nodes · 153 edges · 16 communities (15 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ffb374c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- scripts
- .oxlintrc.json
- export_logo_3d.mjs
- react
- devDependencies
- React + Vite
- manifest.json
- vectorize_logo.py
- verify_logo_3d.mjs
- logo3d-preview/main.jsx
- verify_hero.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 14 edges
2. `scripts` - 8 edges
3. `models` - 4 edges
4. `parts` - 4 edges
5. `animation` - 4 edges
6. `main()` - 4 edges
7. `write_svg()` - 4 edges
8. `main()` - 4 edges
9. `plugins` - 3 edges
10. `rules` - 3 edges

## Surprising Connections (you probably didn't know these)
- `plugins` --extends--> `react`  [EXTRACTED]
  .oxlintrc.json → .oxlintrc.json  _Bridges community 2 → community 4_

## Import Cycles
- None detected.

## Communities (16 total, 1 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.15
Nodes (13): gsap, @gsap/react, lucide-react, dependencies, gsap, @gsap/react, lucide-react, react (+5 more)

### Community 1 - "scripts"
Cohesion: 0.15
Nodes (12): name, private, scripts, build, dev, hero:verify, lint, logo:models (+4 more)

### Community 2 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 3 - "export_logo_3d.mjs"
Cohesion: 0.15
Nodes (13): assetRoot, createMaterialPair(), createPart(), createSpinAnimation(), exportGlb(), extrusionByPart, main(), manifestPath (+5 more)

### Community 4 - "react"
Cohesion: 0.10
Nodes (6): react, App(), HERO_BRANDS, HeroLogo3D, AnimatedLogo(), WaveTitle()

### Community 5 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, playwright, postcss, tailwindcss (+15 more)

### Community 6 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 7 - "manifest.json"
Cohesion: 0.12
Nodes (15): durationSeconds, name, rotationDegrees, models, animation, assembled, parts, parts (+7 more)

### Community 8 - "vectorize_logo.py"
Cohesion: 0.43
Nodes (7): ndarray, Path, contour_path(), find_bands(), LogoPart, main(), write_svg()

### Community 9 - "verify_logo_3d.mjs"
Cohesion: 0.40
Nodes (3): artifactDirectory, repositoryRoot, scriptDirectory

### Community 11 - "verify_hero.mjs"
Cohesion: 0.33
Nodes (3): outputDirectory, repositoryRoot, scriptDirectory

## Knowledge Gaps
- **61 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `.oxlintrc.json`, `logo3d-preview/main.jsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `manifest.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._