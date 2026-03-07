<script>
  import { TableCell } from '$lib/components/ui/table/index.js';

  let { children, class: className = '', ...props } = $props();
</script>

<TableCell {...props} class={className}>
  {@render children?.()}
</TableCell>
