<script lang="ts">
  import { getRandomInt } from '$lib/utils/math';
  import type { Action } from '$lib/stores/taskTracking';
  import PrivacyGroupItem from './PrivacyGroupItem.svelte';
  import { createEventDispatcher } from 'svelte';
  import Color from 'color';
  import type { Member } from '$lib/members';

  const dispatcher = createEventDispatcher();

  export let members: Member[];
  export let defaultMembers: Member[];

  let groups = [
    {
      title: 'Familie',
      members: members.filter((m) => m.group === 'Familie')
    },
    {
      title: 'Freunde',
      members: members.filter((m) => m.group === 'Freunde')
    },
    {
      title: 'Kollegen',
      members: members.filter((m) => m.group === 'Kollegen')
    },
    {
      title: 'Bekannte',
      members: members.filter((m) => m.group === 'Bekannte')
    }
  ];

  groups.map((group) => {
    group.members.map((member) => {
      if (member.color === undefined) {
        member['color'] = Color.rgb(
          getRandomInt(0, 255),
          getRandomInt(0, 255),
          getRandomInt(0, 255)
        );
      }
    });
  });

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div class="w-full space-y-2.5">
  {#each groups as group}
    <PrivacyGroupItem
      on:track={({ detail: { action, data } }) => {
        if (data === undefined || data === null) {
          data = {};
        } else if (typeof data !== 'object') {
          data = { data: data };
        }
        data.group = group;
        track(action, data);
      }}
      title={group.title}
      {defaultMembers}
      bind:members={group.members}
    />
  {/each}
</div>
