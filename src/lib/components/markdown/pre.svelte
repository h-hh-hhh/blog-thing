<script lang="ts">
	import CodeCopyButton from '$lib/components/markdown/code-copy-button.svelte';

	let { children, class: className = '', ...props } = $props();
	let codeText = $state('');
	let preEl = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!preEl) return;
		const code = preEl.querySelector('code');
		codeText = code?.textContent ?? '';
	});
</script>

<div class="code-block group relative my-6">
	<div class="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
		<CodeCopyButton text={codeText} />
	</div>
	<pre
		{...props}
		bind:this={preEl}
		class={`code-block__pre overflow-x-auto rounded-xl border border-border bg-muted/50 px-4 py-4 font-mono text-sm shadow-sm ${className}`.trim()}>{@render children?.()}</pre>
</div>
