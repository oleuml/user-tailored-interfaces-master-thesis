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
    if (currentPage === pages.length - 1 && currentPage > requestedPage)
      return false;

    // Forward stop
    // TODO: task skip issue
    if (currentPage + 1 < requestedPage) return false;

    // Backward stop
    if (
      currentPage - 1 > requestedPage ||
      (currentPage - 1 === requestedPage &&
        pages[currentPage - 1].task !== undefined)
    )
      return false;

    return true;
  }

  export async function load({ page, session }) {
    let odd = Number("0x" + session.token.split("-").reverse()[0]) % 2 === 0;
    let currentPage = Cookie.get("page");
    if (
      currentPage !== undefined &&
      !checkPageAccessAllowed(
        parseInt(currentPage),
        parseInt(page.params.page),
        odd
      )
    ) {
      console.log("redirect");
      return { status: 302, redirect: `/survey/${currentPage}` };
    }
    return { props: { ...page.params, odd: odd } };
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import Icon from "mdi-svelte";
  import Page, { checkAllFulfilled } from "$lib/components/survey/Page.svelte";
  import TopBar from "$lib/material/TopBar.svelte";
  import { answers } from "$lib/stores/answers";
  import questionsA from "../../pagesA.json";
  import questionsB from "../../pagesB.json";
  import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
  import Button from "$lib/material/Button.svelte";
  import { marked } from "marked";
  import Cookie from "js-cookie";
  import { onMount } from "svelte";

  export let page;
  export let odd;

  // Initialize answers
  let pages = odd ? questionsA : questionsB;
  pages
    .map((page) => page.questions)
    .flat()
    .filter((question) => question)
    .forEach((question) => {
      if ($answers[`${question.qid}`] === undefined) {
        if (question.type === "group-likert") {
          $answers[`${question.qid}`] = question.answers.map((_) => null);
        } else $answers[`${question.qid}`] = null;
      }
    });

  onMount(() => {
    if (explanationType && pages.length - 1 === active) {
      // TODO: submit!
      console.log("TODO: Submit");
    }
  });

  $: active = parseInt(page);
  let check = false;

  $: Cookie.set("page", page);

  $: pageQuestions = pages[active].questions;
  $: pageTitle = pages[active].title;
  $: pageDescription = pages[active].description;
  $: pageTask = pages[active].task;
  $: questionType =
    pages[active].questions !== undefined && pages[active].task === undefined;
  $: taskType =
    pages[active].task !== undefined && pages[active].questions === undefined;
  $: explanationType =
    pages[active].task === undefined && pages[active].questions === undefined;
</script>

<div class="flex flex-col h-screen">
  <div class="flex-initial">
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
  <div
    class="grid grid-flow-row grid-cols-1 gap-2 p-2 select-none overflow-y-auto"
  >
    {#if pageDescription && (questionType || explanationType)}
      <div
        class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm"
      >
        {@html marked(pageDescription)}
      </div>
    {:else if taskType}
      <div
        class="box bg-blue-100 border-2 text-blue-900 border-blue-100 text-sm"
      >
        {#if pageDescription}
          {@html marked(pageDescription)}
        {/if}
        <div class="flex justify-center">
          <Button
            title="Fortfahren"
            on:click={() => goto(`/tasks/${pageTask}`)}
          />
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
