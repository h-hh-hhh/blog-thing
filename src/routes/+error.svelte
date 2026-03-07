<script lang="ts">
    import { page } from '$app/state';
	import * as Empty from '$lib/components/ui/empty';
</script>

<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="default">
      <img src="/error.gif" alt="Error"/>
    </Empty.Media>
    <Empty.Title>Error {page.status}</Empty.Title>
    <Empty.Description>
      Encountered an error while loading the page: {page.error?.message || "Error"}. Please try again.
    </Empty.Description>
  </Empty.Header>
</Empty.Root>