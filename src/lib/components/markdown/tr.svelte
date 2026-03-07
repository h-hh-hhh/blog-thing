<script>
  import { TableRow } from '$lib/components/ui/table/index.js';

  let { children, class: className = '', ...props } = $props();
</script>

<TableRow {...props} class={className}>
  {@render children?.()}
</TableRow>
