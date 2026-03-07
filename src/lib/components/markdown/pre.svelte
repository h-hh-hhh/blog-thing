<script lang="ts">
	import CodeCopyButton from '$lib/components/markdown/code-copy-button.svelte';

	let { children, class: className = '', ...props } = $props();
	let codeText = $state('');
	let preEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!preEl) return;
		const code = preEl.querySelector('code');
		codeText = code?.textContent ?? '';
		const prefix = props['data-prefix'];
		if (!prefix) return;
		preEl.querySelectorAll('span.line').forEach((line) => {
			line.setAttribute('data-prefix', prefix);
		});
	});
</script>

<div class="code-block group relative my-6" data-title={props['data-title']}>
	{#if props['data-title']}
		<div class="code-block__title">{props['data-title']}</div>
	{/if}
	<div class={`absolute ${props['data-title'] ? 'top-14.25' : 'top-5.25'} right-5.25 z-10 opacity-0 transition-opacity group-hover:opacity-100`}>
		<CodeCopyButton text={codeText} />
	</div>
	<pre
		{...props}
		bind:this={preEl}
		class={`code-block__pre overflow-x-auto border-border bg-muted/50 p-6 font-mono shadow-sm ${className} ${ props['data-title'] ? 'rounded-b-xl border-l border-r border-b' : 'rounded-xl border'}`.trim()}>{@render children?.()}</pre>
</div>
