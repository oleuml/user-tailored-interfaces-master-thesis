<script>
  import Button from '$lib/material/Button.svelte';

  import { mdiSend } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';

  const dispatcher = createEventDispatcher();

  export let active;
  export let tracking;

  let sendLoading = false;
</script>

<Modal
  bind:active
  on:close={() => {
    dispatcher('close');
  }}
>
  <!-- <div
    class="flex flex-col w-full overflow-y-auto"
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
    }}
  > -->
  <slot />
  <div slot="end" class="absolute bottom-1 right-1 px-2">
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
          active = false;
          sendLoading = false;
        }, 400);
      }}
    />
  </div>
</Modal>
