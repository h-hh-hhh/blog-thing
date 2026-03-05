<script lang="ts">
  import { siteTitle } from '$lib/config/site';
  import { Separator } from '$lib/components/ui/separator';

  const year = new Date().getFullYear();
</script>

<footer class="bg-card/80">
  <Separator />
  <div class="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
    <span>© {year} {siteTitle}</span>
  </div>
</footer>
