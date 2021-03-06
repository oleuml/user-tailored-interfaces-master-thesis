<script lang="ts">
  import type { LegendType, QuestionType } from '$lib/blocks';

  import LikertScala from '$lib/components/survey/likert/LikertScala.svelte';
  import MultipleChoice from './choices/MultipleChoice.svelte';
  import SingleChoice from './choices/SingleChoice.svelte';
  import LikertVertical from './likert/LikertVertical.svelte';
  import TextArea from './textarea/TextArea.svelte';

  export let question: string | [string, string[]];
  export let questionPrefix: string;
  export let type: QuestionType;
  export let answers: string[] | string[][];
  export let legendType: LegendType;
  export let answer: object | object[];
  export let unfulfilledAlert: boolean;
  export let noStatement: boolean;
  export let noStatementText: string = null;
  export let others: boolean = false;
</script>

<div
  class="box bg-blue-100 border-2 text-blue-900"
  class:border-blue-100={!unfulfilledAlert}
  class:border-red-500={unfulfilledAlert}
>
  <div class="font-medium text-md">
    {questionPrefix ? questionPrefix : ''}
    <i class="hyphens-manual">{@html type === 'group-likert' ? question[0] : question}</i>
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
        class:mt-1={i !== 0}
        class:h-8={i === 0}
        class:h-6={i !== 0}
      >
        <div class="w-2/12 mr-2 text-sm text-right">
          {question[1][i]}
        </div>
        <div class="w-9/12">
          <LikertScala
            bind:answer={answer[i]}
            answers={subAnswers}
            legendType={i === 0 ? legendType : 'none'}
            {noStatement}
            {noStatementText}
          />
        </div>
      </div>
    {/each}
  {:else if type === 'likert-vertical'}
    <div class="flex w-full justify-center pt-2">
      <div class="w-11/12">
        <LikertVertical {answers} bind:answer {noStatement} {noStatementText} />
      </div>
    </div>
  {:else if type === 'single-choice'}
    <div class="flex w-full justify-center pt-2">
      <div class="w-11/12">
        <SingleChoice {answers} bind:answer {noStatement} {noStatementText} />
      </div>
    </div>
  {:else if type === 'multiple-choice'}
    <div class="flex w-full justify-center pt-2">
      <div class="w-11/12">
        <MultipleChoice {answers} bind:answer {others} {noStatement} {noStatementText} />
      </div>
    </div>
  {:else if type === 'text'}
    <div class="pt-2">
      <TextArea bind:answer />
    </div>
  {/if}
</div>

<style>
  .hyphens-manual {
    hyphens: manual;
  }
</style>
