<script>
  let { children, class: className = '', ...props } = $props();
</script>

<code
  {...props}
  class={`relative rounded bg-muted px-1 py-1 text-[0.9em] font-mono ${className}`.trim()}
>
  {@render children?.()}
</code>
