<script>
  import Question, { questionAnswered } from '$lib/components/survey/Question.svelte';
  import { createEventDispatcher } from 'svelte';

  export let questions;
  export let answers;

  const dispatcher = createEventDispatcher();

  function checkAllFulfilled(questions, answers) {
    return questions
      .map((q) => questionAnswered(q.type, answers[q.qid]))
      .reduce((prev, curr) => prev && curr, true);
  }

  let check = false;
</script>

<div class="space-y-2">
  {#each questions as q}
    <Question
      question={q.question}
      questionPrefix={q.questionPrefix}
      type={q.type}
      answers={q.answers}
      legendType={q.legendType}
      bind:answer={answers[q.qid]}
      unfulfilledAlert={check && !questionAnswered(q.type, answers[q.qid])}
      noStatement={q.noStatement}
    />
  {/each}
</div>
<button
  on:click={() => {
    check = true;
    if (checkAllFulfilled(questions, answers)) dispatcher('next');
  }}>Next</button
>
