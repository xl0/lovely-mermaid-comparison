<script lang="ts">
	import mermaid from 'mermaid';

	let { src }: { src: string } = $props();

	// securityLevel loose so `click A "url"` renders as a link, like the OSC 8
	// hyperlinks the terminal renderers emit. All sources ship with the app.
	mermaid.initialize({
		startOnLoad: false,
		theme: 'dark',
		suppressErrorRendering: true,
		securityLevel: 'loose'
	});

	// mermaid.render needs a document-unique element id per call.
	let uid = 0;
	const base = `mm-${Math.random().toString(36).slice(2, 8)}`;

	let svg = $state('');
	let error = $state('');

	$effect(() => {
		const s = src;
		const my = ++uid;
		(async () => {
			try {
				const out = await mermaid.render(`${base}-${my}`, s);
				if (my === uid) ((svg = out.svg), (error = ''));
			} catch (e) {
				if (my === uid) ((svg = ''), (error = e instanceof Error ? e.message : String(e)));
			}
		})();
	});
</script>

{#if svg}
	<!-- eslint-disable-next-line svelte/no-at-html-tags — mermaid's own sanitized output -->
	<div class="svg">{@html svg}</div>
{:else if error}
	<div class="err">✗ {error}</div>
{:else}
	<div class="wait">rendering…</div>
{/if}

<style>
	.svg {
		background: #ffffff08;
		border-radius: 4px;
		padding: 0.4rem;
	}
	.svg :global(svg) {
		display: block;
		max-width: 100%;
	}
	.err {
		color: var(--err);
		white-space: pre-wrap;
	}
	.wait {
		color: var(--dim);
	}
</style>
