<script>
  import { Table } from '$lib/components/ui/table/index.js';

  let { children, class: className = '', ...props } = $props();
</script>

<Table {...props} class={`my-6 ${className}`.trim()}>
  {@render children?.()}
</Table>
