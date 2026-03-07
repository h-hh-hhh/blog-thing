<script>
  import { TableHead } from '$lib/components/ui/table/index.js';

  let { children, class: className = '', ...props } = $props();
</script>

<TableHead {...props} class={className}>
  {@render children?.()}
</TableHead>
