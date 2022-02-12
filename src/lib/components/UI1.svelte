<script lang="ts">
  import type { Member } from '$lib/members';
  import NewPostPrivacy from './NewPostPrivacy.svelte';
  import RiskIndicator from './RiskIndicator.svelte';
  import PrivacyGroupList from './ui1/PrivacyGroupList.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher();

  export let taskStore: any;
  export let active: boolean;
  export let defaultMembers: Array<Member>;
  export let members: Array<Member>;
  export let riskValue: number;
</script>

<NewPostPrivacy
  bind:active
  on:send={() => {
    dispatcher('close');
    taskStore.send();
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
      bind:members
    />
  </div>
</NewPostPrivacy>
