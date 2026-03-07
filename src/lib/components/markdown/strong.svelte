<script>
  let { children, class: className = '', ...props } = $props();
</script>

<strong {...props} class={`font-semibold ${className}`.trim()}>
  {@render children?.()}
</strong>
