<script>
  import { TableHeader } from '$lib/components/ui/table/index.js';

  let { children, class: className = '', ...props } = $props();
</script>

<TableHeader {...props} class={className}>
  {@render children?.()}
</TableHeader>
