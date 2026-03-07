<script>
  let { children, class: className = '', ...props } = $props();
</script>

<ul {...props} class={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`.trim()}>
  {@render children?.()}
</ul>
