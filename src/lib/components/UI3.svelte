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
  import type { TaskTrackingStore } from '$lib/stores/taskTracking';
  import _, { Dictionary } from 'lodash';
  import { writable } from 'svelte/store';
  import { checker } from './ui3/Slider.svelte';

  const dispatcher = createEventDispatcher();

  export let taskStore: TaskTrackingStore;
  export let active: boolean;
  export let defaultMembers: Array<Member>;
  export let members: Array<Member>;
  export let riskValue: number;
  export let activeTask: number;

  let selected = null;
  let nextTask = activeTask;
  $: groups = _.groupBy(members, (m) => m.group);
  let groupThresholds = writable<Dictionary<number>>({});
  let groupsMetaData: Dictionary<{
    title: string;
    color: string;
    startAngle: number;
    endAngle: number;
  }> = {};

  $: if (selected !== null) {
    dispatcher('open');
  }

  $: if (activeTask === nextTask) {
    initGroupMetaData();
    initGroupThresholds();
    nextTask += 1;
  }

  const initGroupThresholds = () => {
    Object.keys(groups).forEach((group) => {
      let memberScores = groups[group].map((m) => m.riskScore).sort((a, b) => a - b);
      let threshold = memberScores[Math.floor(memberScores.length * (1 - riskValue))];
      $groupThresholds[group] = threshold;
    });
  };

  const initGroupMetaData = () => {
    const colors = ['#446688', '#881144', '#993322', '#AAAA88'];
    let initGroups = _.groupBy(members, (m) => m.group);
    let lastKey = null;
    Object.keys(initGroups).forEach((key, i) => {
      let startAngle: number;
      if (lastKey === null) {
        startAngle = 0;
      } else {
        startAngle = groupsMetaData[lastKey]['endAngle'];
      }
      let endAngle = (initGroups[key].length / members.length) * 360 + startAngle;
      lastKey = key;

      groupsMetaData[key] = {
        title: key,
        color: colors[i],
        startAngle: startAngle,
        endAngle: endAngle
      };
    });
  };

  const track = ({ detail: { action, data } }) => {
    taskStore.add(action, data);
  };

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
  {selected}
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
    <RiskIndicator {riskValue} on:track={track} />
  </div>
  <div class="flex justify-center w-full">
    <PrivacyCake
      bind:groups
      {groupsMetaData}
      bind:thresholds={$groupThresholds}
      bind:selected
      on:track={track}
    />
  </div>
  <div class="mx-4">
    <PrivacyCakeLegend {groupsMetaData} bind:selected on:track={track} />
  </div>
</NewPostPrivacy>

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
      <PrivacyMemberListTitle
        color={groupsMetaData[selected].color}
        title={groupsMetaData[selected].title}
        bind:threshold={$groupThresholds[selected]}
        on:track={track}
        on:change={() => {
          groups[selected].forEach(
            (m) => (m.checked = checker($groupThresholds[selected], m.riskScore))
          );
          console.log(groups);
        }}
      />
      <PrivacyMemberList
        bind:threshold={$groupThresholds[selected]}
        bind:members={groups[selected]}
        on:track={track}
      />
    </div>
  {/if}
</Modal>
