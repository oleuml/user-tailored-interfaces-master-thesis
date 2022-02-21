<script lang="ts">
  import Button from '$lib/components/material/Button.svelte';
  import { mdiSend } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import type { Action } from '$lib/stores/taskTracking';
  import Scaled from './Scaled.svelte';

  const dispatcher = createEventDispatcher();

  export let active = false;
  export let selected = null;

  let sendLoading = false;

  $: if (active) {
    dispatcher('open');
  }

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

{#if active}
  <Scaled position={selected === null ? 0 : -8} scale={selected === null ? 1.0 : 0.95}>
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
  </Scaled>
{/if}
