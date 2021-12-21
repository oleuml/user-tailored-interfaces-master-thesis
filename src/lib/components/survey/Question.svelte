<script lang="ts" context="module">
  export type QuestionType =
    | 'likert'
    | 'text'
    | 'group-likert'
    | 'single-choice';

  export function questionAnswered(type: QuestionType, answer: string | Array<string>) {
    switch (type) {
      case 'group-likert':
        if (Array.isArray(answer)) {
          return answer.reduce((prev, curr) => curr !== null && prev, true);
        } else {
          throw new Error('group-likert questions need string[] as answers');
        }
      case 'likert':
        return answer !== null;
      case 'single-choice':
        return answer !== null;
      default:
        return true;
    }
  }
</script>

<script lang="ts">
  import SingleChoice from './types/SingleChoice.svelte';

  export let question: string | [string, Array<string>];
  export let questionPrefix: string;
  export let type: QuestionType;
  export let answers: Array<string | Array<string>>;
  export let legendType: LegendType;
  export let answer: string | Array<string>;
  export let unfulfilledAlert: boolean;
  export let noStatement: boolean;
</script>

<div
  class="box bg-gray-50 border-2"
  class:border-gray-50={!unfulfilledAlert}
  class:border-red-500={unfulfilledAlert}
>
  <div class="font-medium text-md">
    {questionPrefix}
    <i>{type === 'group-likert' ? question[0] : question}</i>
  </div>
  {#if type === 'likert'}
    <div class="flex w-full justify-center pt-2">
      <div class="w-11/12">
        <LikertScala bind:answer {answers} {legendType} {noStatement} />
      </div>
    </div>
  {:else if type === 'group-likert'}
    {#each answers as subAnswers, i}
      <div
        class="flex w-full justify-center items-end"
        class:mt-8={i === 0}
        class:h-8={i === 0}
        class:h-6={i !== 0}
      >
        <div class="w-2/12">{question[1][i]}</div>
        <div class="w-9/12">
          <LikertScala
            bind:answer={answer[i]}
            answers={subAnswers}
            legendType={i === 0 ? legendType : 'none'}
            {noStatement}
          />
        </div>
      </div>
    {/each}
  {:else if type === 'single-choice'}
    <div class="flex w-full justify-center pt-2">
      <div class="w-11/12">
        <SingleChoice {answers} bind:answer />
      </div>
    </div>
  {/if}
</div>
