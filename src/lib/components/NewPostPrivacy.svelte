<script>
  import Button from '$lib/material/Button.svelte';
  import { answers } from '$lib/stores/answers';

  import { mdiSend } from '@mdi/js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatcher = createEventDispatcher();

  export let post;
  export let tracking;

  let sendLoading = false;
</script>

<div
  class="absolute w-screen h-screen overflow-hidden top-0 bg-opacity-50 bg-black"
  class:hidden={!post}
  transition:fade={{ duration: 100 }}
  on:click|self={() => {
    post = false;
    dispatcher('background');
  }}
>
  <div
    class="absolute w-full bottom-0 overflow-y-auto bg-white h-11/12 border-t-2 border-l-2 border-r-2 p-2 rounded-t-md mx-1"
    style="width: calc(100% - 0.5rem);"
    in:fly={{ y: 200, duration: 200 }}
    out:fly={{ y: 200, duration: 200 }}
    on:scroll={(event) => {
      tracking.push({
        t: Date.now(),
        action: 'scroll',
        pos: 'privacy_modal',
        data: {
          scrollHeight: event.target.scrollHeight,
          scrollLeft: event.target.scrollLeft,
          scrollLeftMax: event.target.scrollLeftMax,
          scrollTop: event.target.scrollTop,
          scrollTopMax: event.target.scrollTopMax,
          scrollWidth: event.target.scrollWidth
        }
      });
      console.log('scroll');
    }}
  >
    <div class="flex flex-col h-full w-full">
      <div class="flex-initial border-4 rounded-lg mx-36 mb-2" />
      <div class="flex-auto"><slot /></div>
      <div class="flex mt-2 justify-end">
        <Button
          icon={mdiSend}
          loading={sendLoading}
          title="Senden"
          on:click={() => {
            tracking.push({
              t: Date.now(),
              action: 'send',
              pos: 'privacy_modal'
            });
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
