<script lang="ts" context="module">
  export type QuestionType = 'likert' | 'text' | 'group-likert';

  export function questionAnswered(type: QuestionType, answer: string | Array<string>) {
    switch (type) {
      case 'group-likert':
        return answer.reduce((prev, curr) => curr !== undefined && prev, true);
      case 'likert':
        return answer !== undefined;
      default:
        return true;
    }
  }
</script>

<script lang="ts">
  import LikertScala, { LegendType } from '$lib/components/survey/LikertScala.svelte';

  export let id: string | number;
  export let question: string | [string, Array<string>];
  export let questionPrefix: string;
  export let type: QuestionType;
  export let answers: Array<string | Array<string>>;
  export let legendType: LegendType;
  export let answer: string | Array<string>;
  export let unfulfilledAlert: boolean;
</script>

<div
  class="shadow-md rounded p-1 bg-gray-50 border-2"
  class:border-gray-50={!unfulfilledAlert}
  class:border-red-500={unfulfilledAlert}
>
  <p class="font-medium text-md">
    {questionPrefix}
    <i>{type === 'group-likert' ? question[0] : question}</i>
  </p>
  {#if type === 'likert'}
    <div class="flex w-full justify-center pt-2">
      <div class="w-11/12">
        <LikertScala {id} bind:answer {answers} {legendType} />
      </div>
    </div>
  {:else if type === 'group-likert'}
    {#each answers as subAnswers, i}
      <div class="flex w-full justify-center items-end" class:h-8={i === 0} class:h-6={i !== 0}>
        <div class="w-2/12">{question[1][i]}</div>
        <div class="w-9/12">
          <LikertScala
            id="{id}.{i + 1}"
            bind:answer={answer[i]}
            answers={subAnswers}
            legendType={i === 0 ? legendType : 'none'}
          />
        </div>
      </div>
    {/each}
  {/if}
</div>
