<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatcher = createEventDispatcher();

  export let active: boolean;

  let offsetY: number;
</script>

{#if active}
  <div
    class="fixed w-screen h-screen top-0 bg-opacity-50 bg-black"
    transition:fade={{ duration: 100 }}
    on:click|self={() => {
      dispatcher('close');
      active = false;
    }}
  />
  <div
    class="absolute w-full bottom-0 bg-white p-2 overflow-y-auto rounded-t-xl transition"
    style="height: calc(100% - 40px);"
    in:fly={{ y: 200, duration: 200 }}
    out:fly={{ y: 200, duration: 200 }}
    on:scroll
  >
    <div class="flex flex-col h-full w-full">
      <div
        class="flex-initial"
        on:touchend|preventDefault={(event) => {
          let clientY = event.changedTouches[0].clientY;
          // Down
          if (Math.abs(offsetY) < clientY + 5) {
            dispatcher('close');
            active = false;
          }
        }}
        on:touchstart|preventDefault={(event) => {
          let { layerY } = event;
          offsetY = layerY;
        }}
      >
        <div class="border-4 rounded-lg mt-2 mx-auto w-24 mb-6" />
      </div>
      <div class="flex-auto"><slot /></div>
      <div class="flex justify-end">
        <div class="w-full h-12" />
      </div>
    </div>
  </div>
  <slot name="end" />
{/if}
