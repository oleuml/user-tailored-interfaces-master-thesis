<script lang="ts">
  import Choice from './Choice.svelte';

  export let answer: { text: string; index: number };
  export let answers: string[];
</script>

<ul class="space-y-1">
  {#each answers as name, i}
    <li>
      <Choice
        type="filled"
        {name}
        checked={answer !== null && answer.index === i}
        on:check={() => (answer = { text: name, index: i })}
      />
    </li>
  {/each}
</ul>
