<script>
  import Button from '$lib/material/Button.svelte';
  import PrivacyGroupList from './PrivacyGroupList.svelte';

  import { mdiSend } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatcher = createEventDispatcher();

  export let post;
  export let groups;
  let sendLoading = false;
</script>

<div
  class="absolute w-screen h-screen overflow-hidden top-0 z-10 bg-opacity-50 bg-black"
  transition:fade={{ duration: 100 }}
  on:click|self={() => {
    dispatcher('background');
    post = !post;
  }}
>
  <div
    class="absolute w-full bottom-0 overflow-y-auto bg-white h-11/12 border-t-2 border-l-2 border-r-2 p-2 rounded-t-md"
    in:fly={{ y: 200, duration: 200 }}
    out:fly={{ y: 200, duration: 200 }}
  >
    <div class="flex flex-col h-full w-full">
      <div class="flex-initial border-4 rounded-lg mx-36 mb-2" />
      <div class="flex-auto"><PrivacyGroupList {groups} /></div>
      <div class="flex mt-2 justify-end">
        <Button
          icon={mdiSend}
          loading={sendLoading}
          title="Senden"
          on:click={() => {
            sendLoading = true;
            setTimeout(() => {
              post = false;
              sendLoading = false;
            }, 400);
          }}
        />
      </div>
    </div>
  </div>
</div>
