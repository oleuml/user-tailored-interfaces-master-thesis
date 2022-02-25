<script lang="ts">
  import Choice from '../choices/Choice.svelte';

  export let answer: { text: string; index: number };
  export let answers: string[];
  export let noStatement: boolean;
  export let noStatementText: string = null;
</script>

<ul class="space-y-1">
  {#each answers as name, i}
    <li class="relative">
      <div class:h-7={i < answers.length - 1} class="flex absolute justify-center w-6">
        <div class="w-1.5 bg-blue-900 opacity-50 h-full" />
      </div>
      <div class="relative">
        <Choice
          type="filled"
          {name}
          checked={answer !== null && answer.index === i}
          on:check={() => (answer = { text: name, index: i })}
        />
      </div>
    </li>
  {/each}
  {#if noStatement}
    <li>
      <Choice
        type="filled"
        name={noStatementText ? noStatementText : 'Keine Angabe'}
        checked={answer !== null && answer.index === answers.length}
        on:check={() => (answer = { text: 'none', index: answers.length })}
      />
    </li>
  {/if}
</ul>
