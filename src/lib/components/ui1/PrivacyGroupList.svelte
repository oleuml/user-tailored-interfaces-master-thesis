<script lang="ts">
  import type { Action } from '$lib/stores/taskTracking';
  import PrivacyGroupItem from './PrivacyGroupItem.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Member } from '$lib/members';
  import type { Dictionary } from 'lodash';

  const dispatcher = createEventDispatcher();

  export let groups: Dictionary<Member[]>;
  export let defaultMembers: Member[];

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div class="w-full space-y-2.5">
  {#each Object.keys(groups) as groupName}
    <PrivacyGroupItem
      on:track={({ detail: { action, data } }) => {
        if (data === undefined || data === null) {
          data = {};
        } else if (typeof data !== 'object') {
          data = { data: data };
        }
        data.group = groupName;
        track(action, data);
      }}
      title={groupName}
      {defaultMembers}
      bind:members={groups[groupName]}
    />
  {/each}
</div>
