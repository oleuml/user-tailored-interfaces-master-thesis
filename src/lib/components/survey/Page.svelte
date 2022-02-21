<script>
  import Question from '$lib/components/survey/Question.svelte';
  import { questionAnswered } from '$lib/stores/answers';

  export let questions;
  export let answers;

  export let check;

  let lastQuestions = [];

  $: if (questions !== lastQuestions) {
    lastQuestions = questions;
    questions.forEach((question) => {
      if (answers[`${question.id}`] === undefined) {
        if (question.type === 'group-likert') {
          answers[`${question.id}`] = question.answers.map((_) => null);
        } else answers[`${question.id}`] = null;
      }
    });
  }
</script>

<div class="space-y-2">
  {#if answers && Object.keys(answers).length > 0 && Object.getPrototypeOf(answers) === Object.prototype}
    {#each questions as q}
      <Question
        question={q.question}
        questionPrefix={q.questionPrefix}
        type={q.type}
        answers={q.answers}
        legendType={q.legendType}
        bind:answer={answers[q.id]}
        unfulfilledAlert={check && !questionAnswered(q.type, answers[q.id])}
        noStatement={q.noStatement}
      />
    {/each}
  {/if}
</div>
