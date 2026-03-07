<script>
  let { children, class: className = '', ...props } = $props();
</script>

<caption {...props} class={`mt-4 text-sm text-muted-foreground ${className}`.trim()}>
  {@render children?.()}
</caption>
