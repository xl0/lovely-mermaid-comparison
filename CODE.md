# Code

Single-page SvelteKit app comparing three Mermaid renderers side by side:
mermaid.js (SVG), grok-mermaid 0.2.3 (npm — the published grok-build port),
and lovely-mermaid 0.3.1 (npm). Deployed to GitHub Pages by
`.github/workflows/pages.yml` on push (BASE_PATH from the repo name).

Client-only (`ssr = false`, `prerender = true`, adapter-static with
`fallback: index.html`). Rawdog CSS in the demo-app style; JetBrains Mono
bundled for box-drawing coverage. Bun + vite; config lives inline in
`vite.config.ts` (new-style sv scaffold, no svelte.config.js).

```
src/lib/
  examples.ts          categorized example corpus: {title, note, examples[]}
                       sections: supported-by-all / grok-vs-lovely divergence /
                       new-in-lovely / mermaid-only
  Compare.svelte       one source → three panels; runs both terminal renderers
                       via render()+toAnsi() in a $derived (try/caught), paints
                       ANSI through svelte-asciiart's AsciiArt
  MermaidPanel.svelte  async mermaid.render with a seq guard against stale
                       results; suppressErrorRendering, errors shown as text
src/routes/+page.svelte  intro, playground (textarea → Compare), gallery
```

Non-obvious:
- The two libraries' types drifted (`Span.cls` 0.2.3 vs `Span.role` 0.3.x);
  `Compare.run()` takes them through a minimal structural type + `as never`
  on toAnsi rather than importing either's types.
- mermaid.render needs a document-unique id per call: random base + counter.
- mermaid 11 refuses quoted ER aliases in relations and multi-word unquoted
  relation labels — the /cardinalities example exploits the former on purpose.
