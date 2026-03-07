<script>
  let { children, class: className = '', ...props } = $props();
</script>

<h4
  {...props}
  class={`scroll-m-20 text-xl font-semibold tracking-tight mt-6 ${className}`.trim()}
>
  {@render children?.()}
</h4>
