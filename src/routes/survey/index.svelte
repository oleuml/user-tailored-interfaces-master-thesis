<script>
  import Page from '$lib/components/survey/Page.svelte';
  import { answers } from '$lib/stores/answers';
  import questions from '../../questions.json';

  $: questions.forEach((q) => {
    if ($answers[`${q.qid}`] === undefined) {
      if (q.type === 'group-likert') $answers[`${q.qid}`] = q.answers.map((_) => null);
      else $answers[`${q.qid}`] = null;
    }
  });

  let questionsPerPage = 4;
  let numPages = Math.ceil(questions.length / questionsPerPage);
  let active = 0;

  $: console.log($answers);
</script>

{#each [...Array(numPages).keys()] as page}
  {#if active === page}
    <Page
      questions={questions.slice(page * questionsPerPage, (page + 1) * questionsPerPage)}
      bind:answers={$answers}
      on:next={() => {
        active = (active + 1) % numPages;
      }}
    />
  {/if}
{/each}
