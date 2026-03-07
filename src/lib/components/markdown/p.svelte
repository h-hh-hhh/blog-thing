<script>
  let { children, class: className = '', ...props } = $props();
</script>

<p {...props} class={`leading-7 not-first:mt-6 ${className}`.trim()}>
  {@render children?.()}
</p>
