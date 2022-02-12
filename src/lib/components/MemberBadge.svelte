<script lang="ts">
  import { getRandomInt } from '$lib/utils/math';
  import Icon from 'mdi-svelte';
  import Color from 'color';
  import { mdiCheckCircle } from '@mdi/js';

  export let name = '#';
  export let badged: boolean | null;
  let short = name
    .split(' ')
    .map((x) => x[0])
    .join('');
  export let color: any;
  $: color =
    color !== undefined && color !== null
      ? color
      : Color.rgb(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255));
</script>

<div class="relative h-8 w-8" on:click|stopPropagation>
  <div
    class="absolute rounded-full h-8 w-8 flex flex-wrap content-center justify-center overflow-hidden"
    style="color: {Color(color).isLight() ? Color(color).lighten(0.5) : color}; background: {Color(
      color
    ).isLight()
      ? color
      : Color(color).lighten(0.4)}"
  >
    {short}
  </div>
  {#if badged}
    <div class="text-green-500 rounded-full bg-white absolute -right-1.5 -bottom-1.5">
      <Icon path={mdiCheckCircle} size={0.7} />
    </div>
  {/if}
</div>
