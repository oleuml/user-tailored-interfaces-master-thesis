<script lang="ts">
  import type { Member } from '$lib/members';
  import Modal from './Modal.svelte';
  import NewPostPrivacy from './NewPostPrivacy.svelte';
  import RiskIndicator from './RiskIndicator.svelte';
  import PrivacyCake from './ui3/PrivacyCake.svelte';
  import PrivacyCakeLegend from './ui3/PrivacyCakeLegend.svelte';
  import PrivacyMemberList from './ui3/PrivacyMemberList.svelte';
  import PrivacyMemberListTitle from './ui3/PrivacyMemberListTitle.svelte';
  import { createEventDispatcher } from 'svelte';
  import Scaled from './Scaled.svelte';

  const dispatcher = createEventDispatcher();

  export let taskStore: any;
  export let active: boolean;
  export let defaultMembers: Array<Member>;
  export let members: Array<Member>;
  export let riskValue: number;

  let selected = null;

  $: if (selected !== null) {
    dispatcher('open');
  }

  let groups = [
    {
      title: 'Familie',
      members: members.filter((m) => m.group === 'Familie'),
      color: '#446688',
      threshold: 1.0
    },
    {
      title: 'Freunde',
      members: members.filter((m) => m.group === 'Freunde'),
      color: '#881144',
      threshold: 0.8
    },
    {
      title: 'Kollegen',
      members: members.filter((m) => m.group === 'Kollegen'),
      color: '#993322',
      threshold: 0.6
    },
    {
      title: 'Bekannte',
      members: members.filter((m) => m.group === 'Bekannte'),
      color: '#AAAA88',
      threshold: 0.6
    }
  ];

  let startAngle = 0;
  // Calc angles
  groups.forEach((group, i) => {
    if (i === 0) {
      group['startAngle'] = startAngle;
    } else {
      group['startAngle'] = groups[i - 1].endAngle;
    }

    group['endAngle'] = (group.members.length / members.length) * 360 + group['startAngle'];
  });

  // Set initial checked
  groups.forEach((group) => {
    group.members.forEach((x) => {
      x.checked = x.riskScore <= group.threshold;
      x['proposedScore'] = x.riskScore;
    });
  });

  const track = ({ detail: { action, data } }) => {
    taskStore.add(action, data);
  };
</script>

{#if active}
  <Scaled position={selected === null ? 0 : -8} scale={selected === null ? 1.0 : 0.95}>
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
        <RiskIndicator {riskValue} on:track={track} />
      </div>
      <div class="flex justify-center w-full">
        <PrivacyCake bind:groups bind:selected on:track={track} />
      </div>
      <div class="mx-4">
        <PrivacyCakeLegend {groups} bind:selected on:track={track} />
      </div>
    </NewPostPrivacy>
  </Scaled>
{/if}

<Modal
  active={selected !== null}
  on:close={() => {
    dispatcher('close');
    selected = null;
    taskStore.add('close-group');
  }}
>
  {#if selected !== null}
    <div class="mx-4">
      <PrivacyMemberListTitle {groups} bind:threshold={groups[selected].threshold} bind:selected />
      <PrivacyMemberList
        threshold={groups[selected].threshold}
        bind:members={groups[selected].members}
        on:track={track}
      />
    </div>
  {/if}
</Modal>
