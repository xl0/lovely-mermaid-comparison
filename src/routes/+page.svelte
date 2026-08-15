<script lang="ts">
	import Compare from '$lib/Compare.svelte';
	import { sections } from '$lib/examples';
	// Bundled monospace with full box-drawing coverage, so the line art can
	// never fall back to a mismatched glyph.
	import jbmRegular from 'jetbrains-mono/fonts/webfonts/JetBrainsMono-Regular.woff2';
	import jbmBold from 'jetbrains-mono/fonts/webfonts/JetBrainsMono-Bold.woff2';

	let playground = $state(sections[0].examples[0].src);

	const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

	// Scrollspy for the side panel: the last anchor above the viewport's
	// upper third is the active one.
	let active = $state('play');
	let navOpen = $state(false);
	function spy(node: HTMLElement) {
		const ids = [...node.querySelectorAll<HTMLElement>('[id]')].map((el) => el.id);
		const onScroll = () => {
			const cut = window.innerHeight / 3;
			let cur = ids[0];
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= cut) cur = id;
			}
			active = cur;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return { destroy: () => window.removeEventListener('scroll', onScroll) };
	}
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

<button
	class="burger"
	aria-label={navOpen ? 'Close sections menu' : 'Open sections menu'}
	aria-expanded={navOpen}
	onclick={() => (navOpen = !navOpen)}>{navOpen ? '✕' : '☰'}</button
>
{#if navOpen}
	<div class="backdrop" role="presentation" onclick={() => (navOpen = false)}></div>
{/if}

<!-- link clicks bubble here to close the drawer; keyboard users close via the toggle -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<nav aria-label="Sections" class:open={navOpen} onclick={() => (navOpen = false)}>
	<a href="#play" class:active={active === 'play'}>## playground</a>
	{#each sections as sec (sec.title)}
		<a href="#{slug(sec.title)}" class:active={active === slug(sec.title)}>## {sec.title}</a>
		{#each sec.examples as ex (ex.name)}
			<a href="#ex-{ex.name}" class="ex" class:active={active === `ex-${ex.name}`}>/{ex.name}</a>
		{/each}
	{/each}
</nav>

<main use:spy>
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

	<section class="play" id="play">
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
		<section id={slug(sec.title)}>
			<h2>## {sec.title}</h2>
			<p class="note">{sec.note}</p>
			{#each sec.examples as ex (ex.name)}
				<div class="example" id="ex-{ex.name}">
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
		scroll-behavior: smooth;
	}

	/* the side panel: a fixed TOC in the left gutter; the 90rem main column
	   is centered, so the panel needs the viewport to be wider than both */
	nav {
		position: fixed;
		top: 1.2rem;
		left: max(0.8rem, calc(50vw - 45rem - 12.5rem));
		width: 11rem;
		max-height: calc(100vh - 2.4rem);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		font-size: 0.78rem;
	}
	.burger {
		display: none;
		position: fixed;
		top: 0.6rem;
		right: 0.6rem;
		z-index: 30;
		font: inherit;
		font-size: 1.1rem;
		line-height: 1;
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--dim);
		border-radius: 4px;
		background: var(--bg);
		color: var(--fg);
		cursor: pointer;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 20;
		background: rgba(0, 0, 0, 0.5);
	}
	/* small screens: the panel becomes a hamburger drawer */
	@media (max-width: 64rem) {
		nav {
			display: none;
		}
		.burger {
			display: block;
		}
		nav.open {
			display: flex;
			left: 0;
			top: 0;
			bottom: 0;
			max-height: none;
			z-index: 25;
			background: var(--bg);
			border-right: 1px solid var(--dim);
			padding: 1rem 0.6rem;
			width: 12rem;
		}
	}
	nav a {
		color: var(--dim);
		text-decoration: none;
		padding: 0.05rem 0.4rem;
		border-left: 2px solid transparent;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	nav a:not(.ex) {
		color: var(--gold);
		margin-top: 0.35rem;
	}
	nav a.ex {
		padding-left: 1.2rem;
	}
	nav a:hover {
		color: #00d7ff;
	}
	nav a.active {
		border-left-color: var(--accent);
		color: var(--accent);
	}
	:global([id]) {
		scroll-margin-top: 1rem;
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
	/* the panel is always up on large screens: main shifts right of it when
	   the centering gutter alone is too narrow (must follow the base rule —
	   same specificity, order decides) */
	@media (min-width: 64rem) {
		main {
			margin-left: max(13.5rem, calc(50vw - 45rem));
			margin-right: 1rem;
		}
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
