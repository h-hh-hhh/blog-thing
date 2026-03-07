<script>
  let { children, class: className = '', ...props } = $props();
</script>

<a
  {...props}
  class={`font-medium underline underline-offset-4 text-primary hover:text-primary/80 ${className}`.trim()}
>
  {@render children?.()}
</a>
