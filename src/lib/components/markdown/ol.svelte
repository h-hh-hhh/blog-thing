<script>
  let { children, class: className = '', ...props } = $props();
</script>

<ol {...props} class={`my-6 ml-6 list-decimal [&>li]:mt-2 ${className}`.trim()}>
  {@render children?.()}
</ol>
