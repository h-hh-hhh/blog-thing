<script>
  let { children, class: className = '', ...props } = $props();
</script>

<em {...props} class={`italic ${className}`.trim()}>
  {@render children?.()}
</em>
