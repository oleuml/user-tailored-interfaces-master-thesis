<script>
  import Question, { questionAnswered } from '$lib/components/survey/Question.svelte';
  import { createEventDispatcher } from 'svelte';

  export let questions;
  export let answers;

  const dispatcher = createEventDispatcher();

  answers = generateInitialAnswers(questions);

  function generateInitialAnswers(questions) {
    let answers = questions.map((q) => {
      if (q.type === 'group-likert') return q.answers.map((a) => undefined);
      else return undefined;
    });
    return answers;
  }

  function checkAllFulfilled(questions, answers) {
    return answers.reduce(
      (prev, curr, i) => questionAnswered(questions[i].type, curr) && prev,
      true
    );
  }

  let check = false;
</script>

<div class="space-y-2 mx-2">
  {#each questions as q, i}
    <Question
      id={q.id}
      question={q.question}
      questionPrefix={q.questionPrefix}
      type={q.type}
      answers={q.answers}
      legendType={q.legendType}
      bind:answer={answers[i]}
      unfulfilledAlert={!questionAnswered(q.type, answers[i]) && check}
    />
  {/each}
</div>
<button
  on:click={() => {
    check = true;
    if (checkAllFulfilled(questions, answers)) dispatcher('next');
  }}>Next</button
>
