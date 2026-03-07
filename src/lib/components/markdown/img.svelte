<script>
  let { alt = '', class: className = '', ...props } = $props();
</script>

<img {...props} alt={alt} class={`rounded-md border border-border ${className}`.trim()} />
