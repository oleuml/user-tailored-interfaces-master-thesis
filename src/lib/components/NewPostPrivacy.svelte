<script lang="ts">
  import Button from '$lib/material/Button.svelte';
  import { mdiSend } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import type { Action } from '$lib/stores/taskTracking';

  const dispatcher = createEventDispatcher();

  export let active;

  let sendLoading = false;

  $: if (active) {
    dispatcher('open');
  }

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<Modal
  bind:active
  on:close={() => {
    dispatcher('close');
  }}
  on:scroll={(event) => {
    let data = {
      scrollHeight: event.target['scrollHeight'],
      scrollTop: event.target['scrollTop'],
      scrollTopMax: event.target['scrollTopMax']
    };
    track('scroll', data);
  }}
>
  <slot />
  <div slot="end" class="absolute bottom-1 right-1 px-2">
    <Button
      icon={mdiSend}
      loading={sendLoading}
      title="Senden"
      on:click={() => {
        sendLoading = true;
        setTimeout(() => {
          active = false;
          sendLoading = false;
          dispatcher('send');
        }, 400);
      }}
    />
  </div>
</Modal>
