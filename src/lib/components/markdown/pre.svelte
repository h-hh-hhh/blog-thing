<script>
  let { children, class: className = '', ...props } = $props();
</script>

<pre
  {...props}
  class={`mb-6 mt-6 overflow-x-auto rounded-lg border border-border bg-muted px-4 py-4 font-mono text-sm ${className}`.trim()}
>
  {@render children?.()}
</pre>
