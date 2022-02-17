<script lang="ts">
  import type { Action } from '$lib/stores/taskTracking';

  import Color from 'color';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatcher = createEventDispatcher();

  export let color: string;
  export let title: string;
  export let threshold: number;

  let scala;
  let posX;

  let scalaWidth = 0;
  onMount(() => {
    let { width } = scala.getBoundingClientRect();
    posX = (1 - threshold) * width;
    scalaWidth = width;

    resizeObserver.observe(scala);
  });

  const resizeObserver = new ResizeObserver((entries) => {
    let scalaEntry = entries[0];
    posX = (1 - threshold) * scalaEntry.contentRect.width;
    scalaWidth = scalaEntry.contentRect.width;
  });

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div
  class="flex justify-between items-center pl-3 rounded-xl py-2 p-1 font-bold"
  style="color: {Color('#FFF').alpha(0.9)}; background: {Color(color)};"
>
  <span>{title}</span>
  <span class="flex justify-center items-center pr-1.5"
    ><div class="rounded-full h-4 w-4" style="background: {Color('#e8e8e8').alpha(0.602)};" />
  </span>
</div>
<div class="sticky -top-2 h-6 mt-2 pt-1 w-full z-20 bg-white">
  <div class="absolute bg-black w-full bottom-1 h-0.5" />
  <div class="absolute left-0 bottom-0 h-1.5 w-0.5 bg-black" />
  <div class="absolute bottom-0 h-1.5 w-0.5 bg-black" style="left: calc({scalaWidth}px - 1px);" />

  <div bind:this={scala} class="relative text-red-500" style="width: calc(100% - 35.6333px);">
    <svg
      class="absolute h-4 w-4"
      on:touchmove|preventDefault={(event) => {
        let { left, width } = scala.getBoundingClientRect();
        let { clientX } = event.changedTouches[0] || event.targetTouches[0] || event.touches[0];
        posX = Math.min(Math.max(clientX - left, 0), width);
        threshold = 1 - posX / width;
        dispatcher('change');
        track('change-threshold-group', {
          threshold: threshold,
          position: 'privacy-member-list-title'
        });
      }}
      style="left: calc(-8px + {posX}px);"
      viewBox="-8 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <path style="fill: currentColor" d="M 0,16 -8,0 8,0 z" />
    </svg>
  </div>
</div>
