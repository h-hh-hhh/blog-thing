<script>
  let { children, class: className = '', ...props } = $props();
</script>

<blockquote
  {...props}
  class={`mt-6 border-l-2 border-border pl-6 italic text-muted-foreground ${className}`.trim()}
>
  {@render children?.()}
</blockquote>
