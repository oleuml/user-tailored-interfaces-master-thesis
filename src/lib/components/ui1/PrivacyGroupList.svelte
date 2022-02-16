<script lang="ts">
  import type { Action } from '$lib/stores/taskTracking';
  import PrivacyGroupItem from './PrivacyGroupItem.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Member } from '$lib/members';

  const dispatcher = createEventDispatcher();

  export let groups: any;
  export let defaultMembers: Member[];

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
        data.group = group.title;
        track(action, data);
      }}
      title={group.title}
      {defaultMembers}
      bind:members={group.members}
    />
  {/each}
</div>
