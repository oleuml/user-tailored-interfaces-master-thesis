<script lang="ts" context="module">
  export async function load({ session }) {
    if (session.token === undefined) {
      return { status: 302, redirect: `/` };
    }
    return { props: { token: session.token } };
  }
</script>

<script lang="ts">
  import Page from '$lib/components/survey/Page.svelte';
  import Button from '$lib/components/material/Button.svelte';
  import TopBar from '$lib/components/material/TopBar.svelte';
  import { answerStore, resendFailedAnswerSendings } from '$lib/stores/answers';
  import { blockStore } from '$lib/stores/survey';
  import { mdiChevronRight } from '@mdi/js';
  import Icon from 'mdi-svelte';
  import { marked } from 'marked';
  import { goto } from '$app/navigation';
  import { goneToTaskStore } from '$lib/stores/goneToTask';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import { lastUIStore } from '$lib/stores/lastUI';
  import _ from 'lodash';

  export let token: string;
  const blocks = blockStore(token);
  let currentPageNum = blocks.page();
  let answers = answerStore(currentPageNum);
  $: if ($blocks) {
    currentPageNum = blocks.page();
    answers = answerStore(currentPageNum);
  }

  let lastUI = lastUIStore();

  let checkQuestionsAnswered = false;
  let readCheck = false;
  let goneToTask = goneToTaskStore();

  onMount(() => {
    if (browser) {
      let checkFulfilled = _.range(5)
        .map((i) => JSON.parse(localStorage.getItem(`U${$lastUI}-T${i}-fulfilled`)) === true)
        .reduce((a, b) => a && b);
      if ($goneToTask && checkFulfilled) {
        blocks.next();
        $goneToTask = false;
        readCheck = false;
      }
      if ($goneToTask && !checkFulfilled && $blocks.type === 'jump') {
        goto($blocks.path);
      }
    }
  });
</script>

<div class="flex-initial sticky w-full top-0 z-10">
  <TopBar title={$blocks.title}>
    <button
      slot="end"
      class="flex flex-wrap content-center justify-center w-12 h-12 disabled:invisible"
      disabled={$blocks.type === 'jump' || blocks.page() === blocks.length - 1}
      on:click={async () => {
        if ($blocks.type === 'page') {
          checkQuestionsAnswered = !(await answers.send($blocks.questions));
          if (!checkQuestionsAnswered) {
            blocks.next();
            document.body.scrollIntoView();
          }
        } else {
          blocks.next();
        }
      }}
    >
      <Icon path={mdiChevronRight} />
    </button>
  </TopBar>
  <div
    class="absolute top-0 h-1 bg-blue-400 transition:width duration-500"
    style="width: {(100 * (currentPageNum + 1)) / blocks.length}%"
  />
</div>

<div class="grid grid-flow-row grid-cols-1 gap-2 p-2 select-none">
  {#if $blocks.type === 'page' && $blocks.description}
    <div class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm">
      {@html marked($blocks.description)}
    </div>
  {:else if $blocks.type === 'jump'}
    <div class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm">
      {#if $blocks.description}
        {@html marked($blocks.description)}
      {/if}
      <div class="flex mb-2 mt-2">
        <input
          class="mr-2"
          type="checkbox"
          bind:checked={readCheck}
          name="readCheck"
          id="readCheck"
        />
        <label for="readCheck">Haben Sie die Aufgabenstellung gelesen?</label>
      </div>
      <div class="flex justify-center">
        <Button
          disabled={!readCheck}
          title="Aufgabe starten"
          on:click={() => {
            $goneToTask = true;
            $lastUI = parseInt($blocks.path.split('/')[2]);
            goto($blocks.path);
          }}
        />
      </div>
    </div>
  {/if}
  {#if $blocks && $blocks.type === 'page'}
    <Page questions={$blocks.questions} bind:answers={$answers} check={checkQuestionsAnswered} />
    {#if $blocks && blocks.length - 1 === blocks.page()}
      <div class="flex justify-center">
        <Button
          title="Studie beenden"
          on:click={async () => {
            checkQuestionsAnswered = !(await answers.send($blocks.questions));
            if (!checkQuestionsAnswered) {
              let submitted = resendFailedAnswerSendings(blocks.length);
              if (!submitted) {
                toast.push(
                  'Ihre Verbindung zum Internet ist schwach oder sie haben keine Internetverbindung. Stellen Sie sicher, dass ihre Verbindung stabil ist, um die Studie abzuschließen.',
                  {
                    theme: {
                      '--toastBackground': '#F56565',
                      '--toastBarBackground': '#C53030'
                    }
                  }
                );
              } else {
                goto('/end');
                document.body.scrollIntoView();
              }
            }
          }}
        />
      </div>
    {/if}
  {/if}
</div>

<SvelteToast />
