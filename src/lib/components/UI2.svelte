<!--
  This component brings together the individual components of the alphabetical listing.
-->

<script lang="ts">
  import type { Member } from '$lib/members';
  import NewPostPrivacy from './NewPostPrivacy.svelte';
  import RiskIndicator from './RiskIndicator.svelte';
  import { createEventDispatcher } from 'svelte';
  import PrivacyList from './ui2/PrivacyList.svelte';
  import type { TaskTrackingStore } from '$lib/stores/taskTracking';

  const dispatcher = createEventDispatcher();

  export let taskStore: TaskTrackingStore;
  export let active: boolean;
  export let defaultMembers: Array<Member>;
  export let members: Array<Member>;
  export let sensitivityValue: number;
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
      {sensitivityValue}
      on:track={({ detail: { action, data } }) => {
        taskStore.add(action, data);
      }}
    />
    <PrivacyList
      on:track={({ detail: { action, data } }) => {
        taskStore.add(action, data);
      }}
      bind:members
      {defaultMembers}
    />
  </div>
</NewPostPrivacy>
