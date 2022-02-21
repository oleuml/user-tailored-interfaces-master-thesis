<script>
  export let title;
</script>

<div
  class="flex flex-wrap content-center w-full justify-between h-13 bg-blue-100 text-blue-900 px-1"
>
  {#if $$slots.start}
    <div>
      <slot name="start" />
    </div>
  {/if}
  <div class="px-2 flex flex-wrap content-center font-medium text-lg">{title}</div>
  {#if $$slots.end}
    <div>
      <slot name="end" />
    </div>
  {/if}
</div>
