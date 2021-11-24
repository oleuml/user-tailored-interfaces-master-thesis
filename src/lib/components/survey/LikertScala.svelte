<script lang="ts" context="module">
  export type LegendType = 'none' | 'top' | 'bottom' | 'bottom-rotated' | 'start-end';
</script>

<script lang="ts">
  export let id;
  export let answers = ['1', '2', '3'];
  export let noStatement = false;
  export let legendType: LegendType = 'none';
  export let answer: string = undefined;
</script>

<div class="flex w-full items-center">
  {#if legendType === 'start-end'}
    <div class="start-end">{answers[0]}</div>
  {/if}
  <div class="flex-grow relative">
    {#if legendType === 'top'}
      <div class="grid grid-flow-col justify-between items-center">
        {#each answers as a}
          <div class="flex justify-center w-4 text-sm">{a}</div>
        {/each}
      </div>
    {/if}
    <div class="grid grid-flow-col justify-between items-center">
      <div class="flex w-full absolute h-4 items-center">
        <div class="w-full h-1.5 bg-gray-200" />
      </div>
      {#each answers as a}
        <button
          class="relative rounded-full border-2 border-gray-400 w-4 h-4"
          class:bg-gray-200={answer === undefined || answer.answer !== a}
          class:bg-blue-400={answer !== undefined && answer.answer === a}
          on:click={() => (answer = { answer: a, id: id })}
        />
      {/each}
    </div>
    {#if legendType === 'bottom'}
      <div class="grid grid-flow-col justify-between items-center">
        {#each answers as a}
          <div class="flex justify-center w-4 text-sm">{a}</div>
        {/each}
      </div>
    {/if}
  </div>
  {#if legendType === 'start-end'}
    <div class="start-end">
      {answers[answers.length - 1]}
    </div>
  {/if}
</div>

<style lang="scss">
  .start-end {
    @apply flex flex-wrap flex-grow-0 justify-center text-center w-14 text-sm px-1;
  }
</style>
