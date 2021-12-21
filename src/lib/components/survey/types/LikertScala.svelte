<script lang="ts" context="module">
  export type LegendType =
    | 'none'
    | 'top'
    | 'top-rotated'
    | 'bottom'
    | 'bottom-rotated'
    | 'start-end';
</script>

<script lang="ts">
  export let answers;
  export let noStatement = false;
  export let legendType: LegendType = 'none';
  export let answer: string;

  $: barSize =
    legendType === 'start-end'
      ? 100
      : ((answers.length - (noStatement ? 1.0 : 0.0)) / answers.length) * 100;
  let noStatementTitle = 'K.A.';
</script>

<div class="flex w-full items-center">
  {#if legendType === 'start-end'}
    <div class="start-end">{answers[0]}</div>
  {/if}
  <div class="flex-grow relative">
    {#if legendType === 'top'}
      <div class="grid grid-flow-col justify-between items-center">
        {#each answers as a}
          <div class="flex justify-center w-4 text-sm text-center ">{a}</div>
        {/each}
        {#if noStatement}
          <div class="flex justify-center w-4 text-sm text-center">{noStatementTitle}</div>
        {/if}
      </div>
    {:else if legendType === 'top-rotated'}
      <div class="grid grid-flow-col justify-between items-center">
        {#each answers as a}
          <div class="flex text-center w-4 text-sm -rotate-45">{a}</div>
        {/each}
        {#if noStatement}
          <div class="flex w-4 text-sm text-center -rotate-45">
            {noStatementTitle}
          </div>
        {/if}
      </div>
    {/if}
    <div class="grid grid-flow-col justify-between items-center">
      <div class="flex w-full absolute h-6 px-0.5 items-center">
        <div class="h-1.5 bg-blue-900 opacity-50" style="width: {barSize}%;" />
      </div>
      {#each answers as a, i}
        <button
          class="relative button"
          class:bg-blue-50={answer === null || answer.index !== i}
          class:bg-yellow-500={answer !== null && answer.index === i}
          on:click={() => (answer = { text: a, index: i })}
        />
      {/each}
      {#if noStatement && legendType != 'start-end'}
        <button
          class="relative button"
          class:bg-blue-50={answer === null || answer.text !== 'none'}
          class:bg-yellow-500={answer !== null && answer.text === 'none'}
          on:click={() => (answer = { text: 'none', index: answers.length })}
        />
      {/if}
    </div>
    {#if legendType === 'bottom'}
      <div class="grid grid-flow-col justify-between items-center">
        {#each answers as a}
          <div class="flex justify-center w-4 text-sm">{a}</div>
        {/each}
        {#if noStatement}
          <div class="flex justify-center w-4 text-sm text-center">{noStatementTitle}</div>
        {/if}
      </div>
    {/if}
  </div>
  {#if legendType === 'start-end'}
    <div class="start-end">
      {answers[answers.length - 1]}
    </div>
    {#if noStatement}
      <div class="text-sm pr-1">{noStatementTitle}</div>
      <button
        class="relative button"
        class:bg-blue-50={answer === null || answer.text !== 'none'}
        class:bg-yellow-500={answer !== null && answer.text === 'none'}
        on:click={() => (answer = { text: 'none', index: answers.length })}
      />
    {/if}
  {/if}
</div>

<style lang="scss">
  .start-end {
    @apply flex flex-wrap flex-grow-0 justify-center text-center w-14 text-sm px-1;
  }

  .button {
    @apply rounded-full border-2 border-blue-900 w-6 h-6;
  }
</style>
