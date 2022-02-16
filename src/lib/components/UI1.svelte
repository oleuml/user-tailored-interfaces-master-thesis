<script lang="ts">
  import type { Member } from '$lib/members';
  import NewPostPrivacy from './NewPostPrivacy.svelte';
  import RiskIndicator from './RiskIndicator.svelte';
  import PrivacyGroupList from './ui1/PrivacyGroupList.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { TaskTrackingStore } from '$lib/stores/taskTracking';
  import _ from 'lodash';

  const dispatcher = createEventDispatcher();

  export let taskStore: TaskTrackingStore;
  export let active: boolean;
  export let defaultMembers: Array<Member>;
  export let members: Array<Member>;
  export let riskValue: number;

  $: groups = _.groupBy(members, (m) => m.group);

  const updateMembers = (groups) => {
    let newMembers = Object.keys(groups).map((g) => groups[g]);
    members = newMembers.reduce(
      (previous: Member[], current: Member[]) => previous.concat(current),
      []
    );
  };
  $: updateMembers(groups);
</script>

<NewPostPrivacy
  bind:active
  on:send={async () => {
    dispatcher('close');
    await taskStore.send();
  }}
  on:open={() => {
    taskStore.add('open-modal');
  }}
  on:close={() => {
    dispatcher('close');
    taskStore.add('close-modal');
  }}
>
  <div class="mx-4">
    <RiskIndicator
      {riskValue}
      on:track={({ detail: { action, data } }) => {
        taskStore.add(action, data);
      }}
    />
    <PrivacyGroupList
      on:track={({ detail: { action, data } }) => {
        taskStore.add(action, data);
      }}
      {defaultMembers}
      bind:groups
    />
  </div>
</NewPostPrivacy>
