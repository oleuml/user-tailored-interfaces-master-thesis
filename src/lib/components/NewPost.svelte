<script>
  import { fade } from "svelte/transition";
  import { expoIn } from "svelte/easing";
  import Icon from "mdi-svelte";
  import {
    mdiAccountGroup,
    mdiCheckCircleOutline,
    mdiImageArea,
    mdiImageEdit,
    mdiSendLock,
  } from "@mdi/js";
  import TopBar from "$lib/material/TopBar.svelte";
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";

  export let post;
  export let loading;
  export let nextPath;
  export let title;
  export let imagePath;

  let imageSet = false;

  const dispatch = createEventDispatcher();

  function handleSend() {
    post = true;
    loading = true;
  }
</script>

<div class="flex flex-col h-screen bg-white  text-blue-900">
  <div class="flex-initial">
    <TopBar {title}>
      <button
        slot="end"
        class="flex flex-wrap content-center justify-center w-12 h-12 text-blue-900 disabled:text-opacity-50"
        disabled={!imageSet}
        on:click={handleSend}
      >
        {#if !loading && !post}
          <Icon path={mdiSendLock} />
        {:else if loading && !post}
          <div
            in:fade={{ easing: expoIn, duration: 200 }}
            on:introend={() => {
              dispatch("send");
              setTimeout(() => {
                goto(nextPath);
              }, 1000);
            }}
          >
            <Icon path={mdiCheckCircleOutline} />
          </div>
        {:else}
          <Icon path={mdiAccountGroup} />
        {/if}
      </button>
    </TopBar>
  </div>
  <div class="flex-auto justify-between">
    <div class="h-3/6">
      <div
        class="relative h-full flex flex-wrap p-6 content-center justify-center"
      >
        {#if !imageSet}
          <div
            class="flex flex-wrap h-full w-full justify-center rounded-3xl content-center bg-gray-100 text-blue-100"
          >
            <Icon size={6.0} path={mdiImageArea} />
          </div>
        {:else}
          <img
            class="h-full rounded-3xl bg-center object-cover"
            src={imagePath}
          />
        {/if}
        <button
          class="absolute bottom-4 right-4 bg-opacity-90 shadow-md flex flex-wrap content-center justify-center rounded-2xl w-16 h-16 bg-blue-50"
          on:click={() => (imageSet = true)}
        >
          <Icon path={mdiImageEdit} />
        </button>
      </div>
    </div>
    <div class="flex flex-col h-3/6 px-6 pb-6 pt-3">
      <textarea
        class="flex-auto w-full bg-white border-2 p-2 rounded-3xl shadow-md resize-none text-sm text-gray-900"
        placeholder="Beschreibung..."
      />
    </div>
  </div>
</div>
