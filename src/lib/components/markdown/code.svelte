<script>
  let { children, class: className = '', ...props } = $props();
</script>

<code
  {...props}
  class={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm ${className}`.trim()}
>
  {@render children?.()}
</code>
