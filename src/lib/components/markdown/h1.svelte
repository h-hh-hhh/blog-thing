<script>
	let { children, class: className = '', ...props } = $props();
</script>

<h1
	{...props}
	class={`mb-4 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl ${className}`.trim()}
>
	{@render children?.()}
</h1>
