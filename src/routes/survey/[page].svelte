<script context="module">
  function checkPageAccessAllowed(currentPage, requestedPage, odd) {
    let pages = odd ? questionsA : questionsB;
    // Page out of boundsrequestedPage
    if (
      (currentPage === pages.length - 1 && currentPage < requestedPage) ||
      (currentPage === 0 && currentPage > requestedPage)
    )
      return false;

    // End page
    if (currentPage === pages.length - 1 && currentPage > requestedPage) return false;

    // Forward stop
    // TODO: task skip issue
    if (currentPage + 1 < requestedPage) return false;

    // Backward stop
    if (
      currentPage - 1 > requestedPage ||
      (currentPage - 1 === requestedPage && pages[currentPage - 1].task !== undefined)
    )
      return false;

    return true;
  }

  export async function load({ session, params }) {
    if (session.token === undefined) {
      return { status: 302, redirect: `/` };
    }
    let odd = Number('0x' + session.token.split('-').reverse()[0]) % 2 === 0;
    let currentPage = Cookie.get('page');
    if (
      currentPage !== undefined &&
      !checkPageAccessAllowed(parseInt(currentPage), parseInt(params.page), odd)
    ) {
      return { status: 302, redirect: `/survey/${currentPage}` };
    }
    return { props: { ...params, odd: odd } };
  }
</script>

<script>
  import { afterNavigate, goto } from '$app/navigation';
  import Icon from 'mdi-svelte';
  import Page, { checkAllFulfilled } from '$lib/components/survey/Page.svelte';
  import TopBar from '$lib/material/TopBar.svelte';
  import { answers } from '$lib/stores/answers';
  import questionsA from '$lib/data/pagesA.json';
  import questionsB from '$lib/data/pagesB.json';
  import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
  import Button from '$lib/material/Button.svelte';
  import { marked } from 'marked';
  import Cookie from 'js-cookie';
  import { onMount, tick } from 'svelte';

  export let page;
  export let odd;

  let readCheck = false;

  // Initialize answers
  let pages = odd ? questionsA : questionsB;
  pages
    .map((page) => page.questions)
    .flat()
    .filter((question) => question)
    .forEach((question) => {
      if ($answers[`${question.qid}`] === undefined) {
        if (question.type === 'group-likert') {
          $answers[`${question.qid}`] = question.answers.map((_) => null);
        } else $answers[`${question.qid}`] = null;
      }
    });

  afterNavigate(() => {
    tick();
    if (explanationType && pages.length - 1 === active) {
      fetch('/api/submit/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify($answers)
      }).then((res) => {
        if (res.ok) {
          localStorage.removeItem('answers');
        }
        if (res.status === 400) {
          localStorage.removeItem('answers');
        }
      });

      // fetch('/api/submit/tasks/0', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify($task0)
      // }).then((res) => {
      //   if (res.ok) {
      //     localStorage.removeItem('task0');
      //   }
      //   if (res.status === 400) {
      //     localStorage.removeItem('task0');
      //   }
      // });

      // fetch('/api/submit/tasks/1', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify($task1)
      // }).then((res) => {
      //   if (res.ok) {
      //     localStorage.removeItem('task1');
      //   }
      //   if (res.status === 400) {
      //     localStorage.removeItem('task1');
      //   }
      // });

      // fetch('/api/submit/tasks/2', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify($task2)
      // }).then((res) => {
      //   if (res.ok) {
      //     localStorage.removeItem('task2');
      //   }
      //   if (res.status === 400) {
      //     localStorage.removeItem('task2');
      //   }
      // });

      // fetch('/api/submit/tasks/3', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify($task3)
      // }).then((res) => {
      //   if (res.ok) {
      //     localStorage.removeItem('task3');
      //   }
      //   if (res.status === 400) {
      //     localStorage.removeItem('task3');
      //   }
      // });
    }
  });

  onMount(() => {
    document.body.style.background = 'white';
  });

  $: active = parseInt(page);
  let check = false;

  $: Cookie.set('page', page);

  $: pageQuestions = pages[active].questions;
  $: pageTitle = pages[active].title;
  $: pageDescription = pages[active].description;
  $: pageUI = pages[active].ui;
  $: questionType = pages[active].questions !== undefined && pages[active].task === undefined;
  $: taskType = pages[active].task !== undefined && pages[active].questions === undefined;
  $: explanationType = pages[active].task === undefined && pages[active].questions === undefined;
</script>

<div class="flex flex-col">
  <div class="flex-initial sticky top-0">
    <TopBar title={pageTitle}>
      <button
        slot="start"
        class="flex flex-wrap content-center justify-center w-12 h-12 disabled:invisible"
        disabled={active <= 0 ||
          pages[page - 1].task !== undefined ||
          (explanationType && pages.length - 1 === active)}
        on:click|stopPropagation={() => goto(`/survey/${active - 1}`)}
      >
        <Icon path={mdiChevronLeft} />
      </button>
      <button
        slot="end"
        class="flex flex-wrap content-center justify-center w-12 h-12 disabled:invisible"
        disabled={active >= pages.length - 1 || taskType}
        on:click|stopPropagation={() => {
          if (questionType) {
            check = true;
            if (checkAllFulfilled(pageQuestions, $answers)) {
              check = false;
              goto(`/survey/${active + 1}`);
            }
          } else {
            goto(`/survey/${active + 1}`);
          }
          0;
        }}
      >
        <Icon path={mdiChevronRight} />
      </button>
    </TopBar>
  </div>
  <div class="grid grid-flow-row grid-cols-1 gap-2 p-2 select-none">
    {#if pageDescription && (questionType || explanationType)}
      <div class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm">
        {@html marked(pageDescription)}
      </div>
    {:else if taskType}
      <div class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm">
        {#if pageDescription}
          {@html marked(pageDescription)}
        {/if}
        <div class="flex mb-2">
          <input
            class="mr-2"
            type="checkbox"
            bind:checked={readCheck}
            name="readCheck"
            id="readCheck"
          />
          <label for="readCheck">Hast du die Aufgabestellung gelesen?</label>
        </div>
        <div class="flex justify-center">
          <Button disabled={!readCheck} title="Fortfahren" on:click={() => goto(`/ui/${pageUI}`)} />
        </div>
      </div>
    {/if}

    {#if questionType}
      {#if pageQuestions}
        <Page questions={pageQuestions} bind:answers={$answers} {check} />
      {/if}
    {/if}
  </div>
</div>
