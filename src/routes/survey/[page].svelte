<script context="module">
  export async function load({ page }) {
    return { props: { ...page.params } };
  }
</script>

<script>
  import { goto } from '$app/navigation';
  import Icon from 'mdi-svelte';

  import Page, { checkAllFulfilled } from '$lib/components/survey/Page.svelte';
  import TopBar from '$lib/material/TopBar.svelte';
  import { answers } from '$lib/stores/answers';
  import questionsJSON from '../../questions.json';
  import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
  import Button from '$lib/material/Button.svelte';
  import { marked } from 'marked';
  // Initialize answers
  questionsJSON
    .map((page) => page.questions)
    .flat()
    .filter((question) => question)
    .forEach((question) => {
      if ($answers[`${question.qid}`] === undefined) {
        if (question.type === 'group-likert') {
          console.log('HIER');
          $answers[`${question.qid}`] = question.answers.map((_) => null);
        } else $answers[`${question.qid}`] = null;
      }
    });

  export let page;
  $: active = parseInt(page);
  let check = false;

  let pages = questionsJSON;
  $: pageQuestions = pages[active].questions;
  $: pageTitle = pages[active].title;
  $: pageDescription = pages[active].description;
  $: pageRedirect = pages[active].redirect;
</script>

<div class="flex flex-col h-screen">
  <div class="flex-initial">
    <TopBar title={active !== undefined && pageTitle ? pageTitle : ''}>
      <button
        slot="start"
        class="flex flex-wrap content-center justify-center w-12 h-12 disabled:invisible"
        disabled={active <= 0}
        on:click|stopPropagation={() => goto(`/survey/${active - 1}`)}
      >
        <Icon path={mdiChevronLeft} />
      </button>
      <button
        slot="end"
        class="flex flex-wrap content-center justify-center w-12 h-12 disabled:invisible"
        disabled={active >= pages.length - 1 || pageRedirect !== undefined}
        on:click|stopPropagation={() => {
          if (pageQuestions) {
            check = true;
            if (checkAllFulfilled(pageQuestions, $answers)) {
              check = false;
              goto(`/survey/${active + 1}`);
            }
          }
          0;
        }}
      >
        <Icon path={mdiChevronRight} />
      </button>
    </TopBar>
  </div>
  <div class="grid grid-flow-row grid-cols-1 gap-2 p-2 select-none overflow-y-auto">
    {#if pageDescription}
      <div class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm">
        {@html marked(pageDescription)}
        {#if (!pageQuestions && active === pages.length - 1) || pageRedirect !== undefined}
          <div class="flex justify-center">
            <Button title="Fortfahren" />
          </div>
        {/if}
      </div>
    {/if}
    {#if pageQuestions}
      <Page questions={pageQuestions} bind:answers={$answers} {check} />
    {/if}
  </div>
</div>
