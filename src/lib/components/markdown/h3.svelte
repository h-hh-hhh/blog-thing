<script>
  let { children, class: className = '', ...props } = $props();
</script>

<h3
  {...props}
  class={`scroll-m-20 text-2xl font-semibold tracking-tight mt-8 ${className}`.trim()}
>
  {@render children?.()}
</h3>
