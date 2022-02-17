<script lang="ts">
  import Color from 'color';
  import type { Action } from '$lib/stores/taskTracking';
  import { createEventDispatcher } from 'svelte';
  import type { Dictionary } from 'lodash';

  const dispatcher = createEventDispatcher();

  export let selected = null;
  export let groupsMetaData: Dictionary<{
    title: string;
    color: string;
    startAngle: number;
    endAngle: number;
  }>;

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div class="grid grid-cols-2 gap-1 text-sm gap-x-10">
  {#each Object.entries(groupsMetaData) as [_, { title, color }], i}
    <button
      on:click={() => {
        selected = title;
        track('open-group', { memo: 'over-legend', group: title });
      }}
      class="flex justify-between items-center pl-3 rounded-3xl p-1"
      class:font-normal={selected !== title}
      class:font-bold={selected === title}
      style={selected === title
        ? `color: ${Color('#FFF').alpha(0.9)}; background: ${Color(color)};`
        : `color: ${Color(color).darken(0.5)}; background: ${Color(color).alpha(0.4)};`}
    >
      <span>{title}</span>
      <span class="flex justify-center items-center {selected === title ? ' pr-1.5 ' : ' pr-2'}"
        ><div
          class="rounded-full"
          class:h-4={selected === title}
          class:w-4={selected === title}
          class:h-3={selected !== title}
          class:w-3={selected !== title}
          style={selected === title
            ? `background: ${Color('#e8e8e8').alpha(0.602)};`
            : `background: ${color};`}
        />
      </span>
    </button>
  {/each}
</div>
