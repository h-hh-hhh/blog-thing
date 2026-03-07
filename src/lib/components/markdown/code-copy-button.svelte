<script lang="ts">
  import { CopyIcon, CheckIcon } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  let { text = '' } = $props<{ text?: string }>();
  let copied = $state(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    copied = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      copied = false;
    }, 1500);
  };
</script>

<Button
  type="button"
  variant="outline"
  size="icon-sm"
  class="h-7 w-7 rounded-md bg-background/80 text-foreground hover:bg-background"
  on:click={copy}
  aria-label={copied ? 'Copied' : 'Copy code'}
>
  {#if copied}
    <CheckIcon class="size-3.5" />
  {:else}
    <CopyIcon class="size-3.5" />
  {/if}
</Button>
