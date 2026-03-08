<script>
	let { children, class: className = '', ...props } = $props();
</script>

<h1
  {...props}
  class={`scroll-m-20 border-b border-border pb-2 text-5xl font-semibold tracking-tight first:mt-0 mt-10 ${className}`.trim()}
>
  {@render children?.()}
</h1>
