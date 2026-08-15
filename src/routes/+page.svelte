<script lang="ts">
	import Compare from '$lib/Compare.svelte';
	import { sections } from '$lib/examples';
	// Bundled monospace with full box-drawing coverage, so the line art can
	// never fall back to a mismatched glyph.
	import jbmRegular from 'jetbrains-mono/fonts/webfonts/JetBrainsMono-Regular.woff2';
	import jbmBold from 'jetbrains-mono/fonts/webfonts/JetBrainsMono-Bold.woff2';

	let playground = $state(sections[0].examples[0].src);
</script>

<svelte:head>
	<title>mermaid vs grok-mermaid vs lovely-mermaid</title>
	{@html `<style>
		@font-face {
			font-family: 'JetBrains Mono';
			font-style: normal;
			font-weight: 400;
			src: url('${jbmRegular}') format('woff2');
		}
		@font-face {
			font-family: 'JetBrains Mono';
			font-style: normal;
			font-weight: 700;
			src: url('${jbmBold}') format('woff2');
		}
	</style>`}
	<meta
		name="description"
		content="Side-by-side Mermaid rendering: mermaid.js SVG, the grok-build terminal renderer, and lovely-mermaid."
	/>
</svelte:head>

<main>
	<header>
		<h1># mermaid, three ways</h1>
		<p>
			The same source through three renderers:
			<a href="https://mermaid.js.org">mermaid</a> (the original, SVG in a browser),
			<a href="https://www.npmjs.com/package/grok-mermaid">grok-mermaid</a> 0.2.3 (a byte-faithful
			TypeScript port of the <code>xai-org/grok-build</code> terminal renderer), and
			<a href="https://github.com/xl0/lovely-mermaid">lovely-mermaid</a> (what that port grew into —
			Unicode box-drawing art with lenient parsing, semantic spans, class styles and more diagram
			types).
		</p>
	</header>

	<section class="play">
		<h2>## playground</h2>
		<div class="editor-box">
			<span class="editor-title">Edit me</span>
			<span class="accent">❯</span>
			<textarea
				bind:value={playground}
				rows={Math.max(3, playground.split('\n').length)}
				wrap="off"
				spellcheck="false"
				aria-label="Mermaid source"
			></textarea>
		</div>
		<Compare src={playground} />
	</section>

	{#each sections as sec (sec.title)}
		<section>
			<h2>## {sec.title}</h2>
			<p class="note">{sec.note}</p>
			{#each sec.examples as ex (ex.name)}
				<div class="example">
					<div class="ex-head">
						<span class="ex-name">/{ex.name}</span>
						<span class="dim">{ex.desc}</span>
						<span class="spacer"></span>
						<button
							class="ghost"
							onclick={() => {
								playground = ex.src;
								document.querySelector('.play')?.scrollIntoView({ behavior: 'smooth' });
							}}>[→ playground]</button
						>
					</div>
					<details>
						<summary>source</summary>
						<pre>{ex.src}</pre>
					</details>
					<Compare src={ex.src} />
				</div>
			{/each}
		</section>
	{/each}
</main>

<style>
	:global(html) {
		scrollbar-gutter: stable;
	}
	:global(body) {
		--bg: #101014;
		--fg: #d4d4d4;
		--dim: #767676;
		--accent: #8abeb7;
		--err: #cc6666;
		--link: #81a2be;
		--gold: #f0c674;
		--warnc: #e5c07b;
		--msg-bg: #1b1b22;
		--ghost: #808080;
		margin: 0;
		background: var(--bg);
		color: var(--fg);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.85rem;
		line-height: 1.45;
	}

	main {
		max-width: 90rem;
		margin: 0 auto;
		padding: 1.2rem 1rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}

	h1 {
		font-size: 1.1rem;
		color: var(--gold);
		margin: 0 0 0.5rem;
	}
	h2 {
		font-size: 0.95rem;
		color: var(--gold);
		margin: 0 0 0.3rem;
	}
	header p,
	.note {
		margin: 0 0 0.6rem;
		max-width: 70rem;
	}
	.note {
		color: var(--dim);
	}
	a {
		color: var(--link);
	}
	code {
		color: var(--accent);
	}
	.dim {
		color: var(--dim);
	}
	.accent {
		color: var(--accent);
	}
	.spacer {
		flex: 1;
	}

	.example {
		margin: 1rem 0 1.5rem;
	}
	.ex-head {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		margin-bottom: 0.35rem;
	}
	.ex-name {
		color: #00d7ff;
	}
	.ghost {
		font: inherit;
		border: none;
		background: none;
		color: var(--ghost);
		cursor: pointer;
		padding: 0;
	}
	.ghost:hover {
		color: #00d7ff;
	}
	details {
		margin-bottom: 0.4rem;
	}
	summary {
		color: var(--dim);
		cursor: pointer;
		font-size: 0.75rem;
	}
	details pre {
		margin: 0.3rem 0 0;
		padding: 0.4rem 0.6rem;
		background: var(--msg-bg);
		border-radius: 4px;
		overflow-x: auto;
	}

	.editor-box {
		border: 1px solid #5f87ff;
		border-radius: 6px;
		padding: 0.45rem 0.7rem;
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		position: relative;
		margin-bottom: 0.7rem;
	}
	.editor-title {
		position: absolute;
		top: -0.75em;
		right: 1rem;
		padding: 0 0.4em;
		background: var(--bg);
		color: #5f87ff;
		font-size: 0.8rem;
		user-select: none;
	}
	textarea {
		flex: 1;
		width: 100%;
		resize: none;
		overflow-y: hidden;
		box-sizing: border-box;
		font: inherit;
		font-variant-ligatures: none;
		line-height: 1.35;
		padding: 0;
		border: none;
		outline: none;
		background: transparent;
		color: var(--fg);
	}
</style>
