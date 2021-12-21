<script>
  import Icon from 'mdi-svelte';

  export let title;
  export let icon = null;
  export let loading = false;
  export let disabled = false;
</script>

<button
  class="disabled:opacity-50 bg-blue-900 text-blue-100 rounded-full h-10 px-6 text-base font-medium"
  {disabled}
  on:click|stopPropagation
>
  <span class="flex justify-between"
    ><span class:mr-2={icon !== null}>{title}</span>
    {#if icon !== null}
      <span>
        {#if !loading}
          <Icon path={icon} />
        {:else}
          <svg
            class="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        {/if}
      </span>
    {/if}
  </span>
</button>
