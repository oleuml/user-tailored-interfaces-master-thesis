<script lang="ts">
  import Color from 'color';
  import type { Action } from '$lib/stores/taskTracking';
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher();

  export let selected = null;
  export let groups;

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div class="grid grid-cols-2 gap-1 text-sm gap-x-10">
  {#each groups as group, i}
    <button
      on:click={() => {
        selected = i;
        track('open-group', { memo: 'over-legend', group: groups[selected].title });
      }}
      class="flex justify-between items-center pl-3 rounded-3xl p-1"
      class:font-normal={selected !== i}
      class:font-bold={selected === i}
      style={selected === i
        ? `color: ${Color('#FFF').alpha(0.9)}; background: ${Color(group.color)};`
        : `color: ${Color(group.color).darken(0.5)}; background: ${Color(group.color).alpha(0.4)};`}
    >
      <span>{group.title}</span>
      <span class="flex justify-center items-center {selected === i ? ' pr-1.5 ' : ' pr-2'}"
        ><div
          class="rounded-full"
          class:h-4={selected === i}
          class:w-4={selected === i}
          class:h-3={selected !== i}
          class:w-3={selected !== i}
          style={selected === i
            ? `background: ${Color('#e8e8e8').alpha(0.602)};`
            : `background: ${group.color};`}
        />
      </span>
    </button>
  {/each}
</div>
