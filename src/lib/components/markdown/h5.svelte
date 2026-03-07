<script>
  let { children, class: className = '', ...props } = $props();
</script>

<h5
  {...props}
  class={`scroll-m-20 text-lg font-semibold tracking-tight mt-6 ${className}`.trim()}
>
  {@render children?.()}
</h5>
