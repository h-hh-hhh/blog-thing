<script>
  let { children, ...props } = $props();
</script>

<h1 {...props} class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
  {@render children?.()}
</h1>