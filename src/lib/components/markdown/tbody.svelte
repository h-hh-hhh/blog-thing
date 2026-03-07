<script>
  import { TableBody } from '$lib/components/ui/table/index.js';

  let { children, class: className = '', ...props } = $props();
</script>

<TableBody {...props} class={className}>
  {@render children?.()}
</TableBody>
