<script lang="ts">
  import { CopyIcon, CheckIcon } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  let { text = '' } = $props<{ text?: string }>();
  let copied = $state(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let iconSwapTimeout: ReturnType<typeof setTimeout> | null = null;
  let isIconHidden = $state(false);
  let iconName = $state<'copy' | 'check'>('copy');
  const updateIcon = (next: 'copy' | 'check') => {
    if (iconSwapTimeout) clearTimeout(iconSwapTimeout);
    isIconHidden = true;
    iconSwapTimeout = setTimeout(() => {
      iconName = next;
      isIconHidden = false;
    }, 130);
  };

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    copied = true;
    updateIcon('check');
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      copied = false;
      updateIcon('copy');
    }, 1500);
  };
</script>

<Button
  type="button"
  variant="outline"
  size="icon-sm"
  class="rounded-md bg-background/80 text-foreground hover:bg-background cursor-pointer"
  onclick={copy}
  aria-label={copied ? 'Copied' : 'Copy code'}
>
  <span class="relative inline-flex size-3.5">
    <span
      class={`absolute inset-0 flex items-center justify-center transition duration-150 ease-out ${
        isIconHidden ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      {#if iconName === 'check'}
        <CheckIcon class="size-3.5 text-green-500" />
      {:else}
        <CopyIcon class="size-3.5" />
      {/if}
    </span>
  </span>
</Button>
