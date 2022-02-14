<script lang="ts" context="module">
  export const load: Load = ({ params }) => {
    let { ui } = params;
    if (isNaN(parseInt(ui))) {
      return { error: `UI ${ui} not exists` };
    }

    return { props: { ui: parseInt(ui) } };
  };
</script>

<script lang="ts">
  import defaultMembers from '$lib/data/members-t4.json';
  import NewPost from '$lib/components/NewPost.svelte';
  import ExerciseModal from '$lib/components/ExerciseModal.svelte';
  import exercisesJSON from '$lib/data/exercises.json';
  import { activeExerciseStore, taskTrackingStore } from '$lib/stores/taskTracking';
  import type { Load } from '@sveltejs/kit';
  import { checkCondition, Exercise } from '$lib/exercises';
  import { onMount } from 'svelte';
  import type { Member } from '$lib/members';
  import UI1 from '$lib/components/UI1.svelte';
  import UI2 from '$lib/components/UI2.svelte';
  import UI3 from '$lib/components/UI3.svelte';
  import Scaled from '$lib/components/Scaled.svelte';
  import Rounded from '$lib/components/Rounded.svelte';

  export let ui: number;

  let exercises = <Exercise[]>(<any>exercisesJSON);

  // Setup active exercise with store on localStorage with default
  // value 0
  $: activeExercise = activeExerciseStore(ui, 0);

  // Setup task store which saves tracking data on localStorage
  // and creates new storages on ui or task change
  $: taskStore = taskTrackingStore(
    ui,
    exercises[$activeExercise],
    defaultMembers.map<Member>((m: Member) => ({ ...m } as Member)), // copies the original member sets
    (condition, members, conditionBody) => {
      return checkCondition(condition, members, conditionBody);
    }
  );

  // Setup local values for stores, needed for auto subscription
  $: started = taskStore.started;
  $: fulfilled = taskStore.fulfilled;
  $: sent = taskStore.sent;
  $: members = taskStore.members;

  // exerciseModalAllowed is for control of modal display
  let exerciseModalAllowed = false;

  onMount(() => {
    exerciseModalAllowed = true;
  });

  let modalsOpen = 0;

  const closeModal = () => {
    modalsOpen -= 1;
  };
  const openModal = () => {
    modalsOpen += 1;
  };

  let imageSet: boolean;
</script>

<Scaled
  position={modalsOpen >= 2 ? -4 : 0}
  scale={modalsOpen >= 2 ? 0.9 : modalsOpen >= 1 ? 0.95 : 1.0}
>
  <Rounded active={modalsOpen > 0}>
    <NewPost
      title={'Aufgabe ' + ($activeExercise + 1)}
      imagePath={exercises[$activeExercise].postImagePath}
      postDescription={exercises[$activeExercise].postDescription}
      taskFulfilled={$fulfilled}
      isOpen={modalsOpen > 0}
      bind:imageSet
      on:open={() => (modalsOpen = 1)}
    />
  </Rounded>
</Scaled>

{#if ui === 0}
  <UI1
    active={modalsOpen > 0}
    {defaultMembers}
    bind:members={$members}
    {taskStore}
    riskValue={exercises[$activeExercise].riskValue}
    on:close={closeModal}
  />
{:else if ui === 1}
  <UI2
    active={modalsOpen > 0}
    {defaultMembers}
    bind:members={$members}
    {taskStore}
    riskValue={exercises[$activeExercise].riskValue}
    on:close={closeModal}
  />
{:else if ui === 2}
  <UI3
    active={modalsOpen > 0}
    {defaultMembers}
    bind:members={$members}
    {taskStore}
    riskValue={exercises[$activeExercise].riskValue}
    on:close={closeModal}
    on:open={openModal}
  />
{/if}

<ExerciseModal
  visible={exerciseModalAllowed && (!$started || $sent)}
  {activeExercise}
  {exercises}
  fulfilled={$fulfilled}
  started={$started}
  sent={$sent}
  on:next-exercise={() => (imageSet = false)}
  on:start={() => taskStore.start()}
  on:restart={() => taskStore.restart()}
/>
