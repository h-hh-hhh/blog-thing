<script>
  import { components } from '$lib/components/markdown';
  // Svelte 5 props
  let { children } = $props();
</script>

<article class="py-10">
  {@render children?.({ components })}
</article>
