<script lang="ts">
	import { render as grokRender, toAnsi as grokToAnsi } from 'grok-mermaid';
	import { render as lovelyRender, toAnsi as lovelyToAnsi } from 'lovely-mermaid';
	import { AsciiArt } from 'svelte-asciiart';
	import MermaidPanel from './MermaidPanel.svelte';

	let { src }: { src: string } = $props();

	type Term =
		| { kind: 'art'; ansi: string; width: number; rows: number; warnings: string[] }
		| { kind: 'null' }
		| { kind: 'crash'; error: string };

	// Same shape from both libraries despite the 0.2.3 / 0.3.x type drift.
	function run(
		render: (s: string) => { plain: string[]; width: number; warnings: string[] } | null,
		toAnsi: (art: never) => string[],
		s: string
	): Term {
		try {
			const art = render(s);
			if (art === null) return { kind: 'null' };
			return {
				kind: 'art',
				ansi: toAnsi(art as never).join('\n'),
				width: art.width,
				rows: art.plain.length,
				warnings: art.warnings
			};
		} catch (e) {
			return { kind: 'crash', error: e instanceof Error ? e.message : String(e) };
		}
	}

	const grok = $derived(run(grokRender, grokToAnsi, src));
	const lovely = $derived(run(lovelyRender, lovelyToAnsi, src));

	// Match the terminal panel the ANSI resolves against.
	const asciiTheme = {
		palette: [
			'#000000', '#cd3131', '#00a600', '#b58900', '#0451a5', '#bc05bc', '#0598bc', '#a5a5a5',
			'#666666', '#f14c4c', '#23d18b', '#f5f543', '#3b8eea', '#d670d6', '#29b8db', '#ffffff'
		],
		foreground: '#d4d4d4',
		background: '#101014'
	};
</script>

{#snippet term(t: Term)}
	{#if t.kind === 'art'}
		<div class="art">
			<AsciiArt text={t.ansi} theme={asciiTheme} margin={1} cellSize={14} style="width: auto; height: auto;" />
		</div>
		<div class="meta">
			{t.width}×{t.rows} cells
			{#each t.warnings as w (w)}<span class="warn">⚠ {w}</span>{/each}
		</div>
	{:else if t.kind === 'null'}
		<div class="none">render() → null — no art for this source</div>
	{:else}
		<div class="crash">✗ threw: {t.error}</div>
	{/if}
{/snippet}

<div class="panels">
	<section>
		<h4>mermaid <span class="dim">(SVG)</span></h4>
		<MermaidPanel {src} />
	</section>
	<section>
		<h4>grok-mermaid <span class="dim">0.2.3</span></h4>
		{@render term(grok)}
	</section>
	<section>
		<h4>lovely-mermaid <span class="dim">0.3.3</span></h4>
		{@render term(lovely)}
	</section>
</div>

<style>
	.panels {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.7rem;
	}
	@media (max-width: 68rem) {
		.panels {
			grid-template-columns: 1fr;
		}
	}
	section {
		background: var(--msg-bg);
		border-radius: 4px;
		padding: 0.5rem 0.7rem;
		min-width: 0;
	}
	h4 {
		margin: 0 0 0.45rem;
		font-size: 0.8rem;
		font-weight: normal;
		color: var(--accent);
	}
	.dim {
		color: var(--dim);
	}
	.art {
		overflow-x: auto;
		background: #101014;
		border-radius: 4px;
		width: fit-content;
		max-width: 100%;
	}
	.art :global(svg) {
		display: block;
	}
	.meta {
		margin-top: 0.35rem;
		color: var(--dim);
		font-size: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.warn {
		color: var(--warnc);
	}
	.none {
		color: var(--dim);
	}
	.crash {
		color: var(--err);
		white-space: pre-wrap;
	}
</style>
