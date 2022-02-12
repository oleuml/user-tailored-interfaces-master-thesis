<script lang="ts">
  import Icon from 'mdi-svelte';
  import MemberBadge from '$lib/components/MemberBadge.svelte';
  import Slider, { checked } from '$lib/components/ui3/Slider.svelte';
  import { mdiCheckboxBlankCircle, mdiCheckCircle } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import type { Action } from '$lib/stores/taskTracking';

  const dispatcher = createEventDispatcher();

  export let title: string;
  export let score: number;
  export let threshold: number;
  export let color: string;
  export let proposedScore: number;

  if (isNaN(proposedScore)) {
    throw new Error(`proposedScore must be a number: ${proposedScore}`);
  }
  if (proposedScore < 0 || proposedScore > 1) {
    throw new Error(`proposedScore must be between or equals 0.0 and 1.0: ${proposedScore}`);
  }
  if (threshold < 0 || threshold > 1) {
    throw new Error(`threshold must be between or equals 0.0 and 1.0: ${threshold}`);
  }
  if (score < 0 || score > 1) {
    throw new Error(`score must be between or equals 0.0 and 1.0: ${score}`);
  }

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div class="flex h-full">
  <Slider
    bind:score
    bind:threshold
    on:track={({ detail: { action, data } }) => {
      data.position = 'slider';
      data.member = title;
      track(action, data);
    }}
  >
    <div class="flex flex-wrap h-full items-center gap-2 ml-2">
      <MemberBadge name={title} {color} badged={null} />
      {title}
    </div>
  </Slider>
  <button
    class:bg-green-400={checked(threshold, score)}
    class:bg-gray-200={!checked(threshold, score)}
    class="flex flex-wrap justify-center content-center w-10 transition duration-200 text-white"
    on:click={() => {
      if (!checked(threshold, score)) {
        score = 0.0;
      } else {
        score = 1.0;
      }
      track('change-score', { score: score, member: title, memo: 'button-clicked' });
    }}
  >
    {#if !checked(threshold, score)}
      <Icon path={mdiCheckboxBlankCircle} size={1.0} />
    {:else}
      <Icon path={mdiCheckCircle} size={1.0} />
    {/if}
  </button>
</div>
