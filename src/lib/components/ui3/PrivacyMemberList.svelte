<script lang="ts">
  import type { Member } from '$lib/members';
  import type { Action } from '$lib/stores/taskTracking';
  import { createEventDispatcher } from 'svelte';
  import MemberSlider from './MemberSlider.svelte';

  const dispatcher = createEventDispatcher();

  export let members: Array<Member>;
  export let threshold: number;
  const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];
  $: members.sort((a, b) => a.name.split(' ')[1].localeCompare(b.name.split(' ')[1]));

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div
  class="flex flex-wrap w-full"
  on:scroll={(event) => {
    let data = {
      scrollHeight: event.target['scrollHeight'],
      scrollTop: event.target['scrollTop'],
      scrollTopMax: event.target['scrollTopMax']
    };
    track('scroll', data);
  }}
>
  {#each alphabet as char}
    {#if members.filter((x) => x.name.split(' ')[1][0] === char && !x.favorite).length !== 0}
      <span class="text-xs text-gray-400">#{char}</span>
      <div class="w-full h-0.25 bg-gray-100 mb-0.5" />
      <div class="w-full">
        {#each members.filter((x) => x.name.split(' ')[1][0] === char) as member}
          <div
            class="w-full h-10 first:rounded-t-xl last:rounded-b-xl last overflow-hidden"
            on:click={() => {
              member.checked = !member.checked;
              members = [...members];
              if (member.checked) {
                track('select', { member: member.name });
              } else {
                track('deselect', { member: member.name });
              }
            }}
          >
            <MemberSlider
              bind:score={member.riskScore}
              bind:checked={member.checked}
              proposedScore={member['proposedScore']}
              title={member.name}
              {threshold}
              color={member.color.toString()}
              on:track={({ detail: { action, data } }) => {
                data.position = 'member-slider';
                track(action, data);
              }}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>
