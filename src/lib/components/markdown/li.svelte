<script>
  let { children, class: className = '', ...props } = $props();
</script>

<li {...props} class={`leading-7 ${className}`.trim()}>
  {@render children?.()}
</li>
