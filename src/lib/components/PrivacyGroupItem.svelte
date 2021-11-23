<script>
  import Icon from 'mdi-svelte';
  import { mdiAccountGroup, mdiCheckCircle, mdiCircleOutline, mdiPen } from '@mdi/js';
  import MemberBadge from './MemberBadge.svelte';
  import { swipe } from 'svelte-gestures';
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let title;
  export let checked;
  export let members;
  export let groupEdit;
  export let edit;

  const dispatcher = createEventDispatcher();

  function handleEdit() {
    alert('Handle!');
  }
</script>

<div class="w-full py-2">
  <div
    class="relative rounded-md shadow-md h-24 bg-gray-100 overflow-hidden transition duration-100 active:shadow-lg"
    use:swipe={{ timeframe: 500, minSwipeDistance: 50, touchAction: 'pan-y' }}
    on:swipe={(e) => {
      console.log(e.detail.direction);
      if (e.detail.direction === 'right' && groupEdit === edit) {
        groupEdit = null;
      } else if (e.detail.direction === 'left') {
        groupEdit = edit;
      }
    }}
    on:click={() => {
      if (groupEdit !== null) {
        groupEdit = null;
      } else dispatcher('click');
    }}
  >
    <div class="absolute p-1 flex flex-wrap gap-1 h-18 overflow-hidden">
      {#each members as member}
        <MemberBadge name={member.name} />
      {/each}
    </div>
    <div class="absolute top-1 right-1">
      <div class="filter w-6 h-6 blur-sm rounded-md bg-gray-100" />
    </div>

    <div class="absolute top-1 right-1">
      {#if checked}
        <div class="text-blue-500">
          <Icon path={mdiCheckCircle} />
        </div>
      {:else}
        <div class="text-gray-500">
          <Icon path={mdiCircleOutline} />
        </div>
      {/if}
    </div>
    <div
      class="absolute flex items-end bottom-0 pl-2 p-1 text-sm text-gray-100 bg-gray-100 filter blur"
    >
      <span>{title}</span>
      <span class="p-0.5 pl-3"><Icon path={mdiAccountGroup} size="1.3rem" /></span>
      <span>{members.length}</span>
    </div>
    <div class="absolute flex items-end bottom-0 pl-2 p-1 text-sm text-gray-400">
      <span>{title}</span>
      <span class="p-0.5 pl-3"><Icon path={mdiAccountGroup} size="1.3rem" /></span>
      <span>{members.length}</span>
    </div>
    {#if groupEdit === edit}
      <div
        in:fly={{ x: 200, duration: 300 }}
        out:fly={{ x: 200, duration: 300 }}
        class="absolute w-16 bg-green-500 right-0 h-full flex items-center justify-center rounded-r-md text-white"
        on:click|stopPropagation={handleEdit}
      >
        <Icon path={mdiPen} />
      </div>
    {/if}
  </div>
</div>
