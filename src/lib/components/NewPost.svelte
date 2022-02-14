<script lang="ts">
  import { fade } from 'svelte/transition';
  import { expoIn } from 'svelte/easing';
  import Icon from 'mdi-svelte';
  import {
    mdiAccountGroup,
    mdiCheckCircleOutline,
    mdiImageArea,
    mdiImageEdit,
    mdiSendLock
  } from '@mdi/js';
  import TopBar from '$lib/material/TopBar.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher();

  export let title: string;
  export let imagePath: string;
  export let taskFulfilled: boolean;
  export let isOpen: boolean = false;
  export let postDescription: string;
  export let imageSet = false;

  const onOpen = () => {
    isOpen = true;
    dispatcher('open');
  };
</script>

<div class="flex flex-col bg-white h-full text-blue-900">
  <div class="w-full flex-initial">
    <TopBar {title}>
      <button
        slot="end"
        class="flex flex-wrap content-center justify-center w-12 h-12 text-blue-900 disabled:text-opacity-50"
        disabled={!imageSet}
        on:click={onOpen}
      >
        {#if !taskFulfilled && !isOpen}
          <Icon path={mdiSendLock} />
        {:else if taskFulfilled}
          <div in:fade={{ easing: expoIn, duration: 200 }}>
            <Icon path={mdiCheckCircleOutline} />
          </div>
        {:else}
          <Icon path={mdiAccountGroup} />
        {/if}
      </button>
    </TopBar>
  </div>
  <div class="flex-auto min-h-1/2 relative p-6">
    {#if !imageSet}
      <div
        class="flex flex-wrap h-full w-full justify-center rounded-3xl content-center bg-gray-100 text-blue-100"
      >
        <Icon size={6.0} path={mdiImageArea} />
      </div>
    {:else}
      <div class="h-full rounded-3xl  overflow-hidden">
        <img class="h-full w-full bg-center object-cover" src={imagePath} alt="" />
      </div>
    {/if}
    <button
      class="absolute bottom-4 right-4 bg-opacity-90 shadow-md flex flex-wrap content-center justify-center rounded-2xl w-16 h-16 bg-blue-50"
      on:click={() => (imageSet = true)}
    >
      <Icon path={mdiImageEdit} />
    </button>
  </div>
  <div
    class="flex-auto relative mx-6 mb-6 mt-3 bg-white overflow-y-auto border-2 rounded-xl shadow-md resize-none text-sm text-gray-900"
  >
    <p class="p-2">
      {#if imageSet}
        {@html postDescription}
      {/if}
    </p>
    <div class="absolute bottom-0 bg-gray-100 w-full px-2 flex justify-between">
      <span class="font-semibold text-xs">Beschreibung</span>
      {#if imageSet === true}
        <span class="text-xs">
          {postDescription.length}/1000
        </span>
      {/if}
    </div>
  </div>
</div>
