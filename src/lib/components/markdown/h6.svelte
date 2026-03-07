<script>
  let { children, class: className = '', ...props } = $props();
</script>

<h6
  {...props}
  class={`scroll-m-20 text-base font-semibold tracking-tight mt-6 ${className}`.trim()}
>
  {@render children?.()}
</h6>
