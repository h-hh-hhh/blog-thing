<script>
  let { class: className = '', ...props } = $props();
</script>

<hr {...props} class={`my-8 border-border ${className}`.trim()} />
