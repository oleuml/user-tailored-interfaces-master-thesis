<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let type: 'checked' | 'filled';
  export let checked: boolean;
  export let name: string = null;

  const dispatcher = createEventDispatcher();
</script>

<button
  class="flex items-center cursor-pointer font-medium gap-2"
  on:click={() => {
    if (checked) dispatcher('uncheck');
    else dispatcher('check');
  }}
>
  {#if checked && type === 'checked'}
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
      />
    </svg>
  {:else if checked && type === 'filled'}
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z"
      />
    </svg>
  {:else}
    <svg style="width:24px;height:24px" class="bg-blue-50 rounded-full" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>
  {/if}
  {#if name}
    <div class="text-sm">{name}</div>
  {/if}
</button>
