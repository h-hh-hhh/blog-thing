<script lang="ts">
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';

  let { checked = false, text = '', class: className = '', ...props } = $props();
  const checkboxId = `task-${Math.random().toString(36).slice(2, 18)}`;
</script>

<li {...props} class={`leading-7 ${className}`.trim()}>
  <div class="flex items-center gap-2">
    <Checkbox id={checkboxId} checked={checked} disabled class="disabled:opacity-100" />
    <Label for={checkboxId} class={`leading-7 font-normal peer-disabled:opacity-100 peer-data-[state=checked]:opacity-70`}>
      {#if checked}
        <del>{text}</del>
      {:else}
        {text}
      {/if}
    </Label>
  </div>
</li>
