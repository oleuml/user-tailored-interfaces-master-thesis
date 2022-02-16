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

  const updateMembers = (groups) => {
    let newMembers = groups.map((g) => g.members);
    members = newMembers.reduce((previous: Member[], current: Member[]) =>
      previous.concat(current)
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
