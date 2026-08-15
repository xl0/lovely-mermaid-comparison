# Plan

Demo site showing how mermaid.js, grok-mermaid 0.2.3 and lovely-mermaid render
the same sources — supported types, divergences, unsupported types, plus a live
playground with all three renderers.

## [x] App

- [x] sv scaffold, adapter-static, client-only
- [x] Compare component: mermaid SVG | grok ANSI | lovely ANSI
- [x] Example corpus in four sections; playground with [→ playground] links
- [x] Verified in browser: all sections render, no console errors

## TODO

- [x] GH Pages workflow (.github/workflows/pages.yml)
- [x] lovely-mermaid 0.3.1 released; dep swapped from link to npm
- [ ] git init + push; set repo Pages source to "GitHub Actions"
