<script lang="ts">
  import Choice from './Choice.svelte';

  export let answer: object[];
  export let answers: string[];
  export let others: boolean;
  export let noStatement: boolean;

  let othersTextValue = '';

  if (answer === null || answer === undefined) answer = answers.map((a) => null);
  if (others) answer.push(null);
  if (noStatement) answer.push(null);

  $: othersIndex = answers.length;
  $: noStatementIndex = answers.length + (noStatement && others ? 1 : 0);
</script>

<ul class="space-y-1">
  {#each answers as name, index}
    <li>
      <Choice
        type="checked"
        {name}
        checked={answer[index] !== null}
        on:check={() => {
          answer[index] = { text: name, index: index };
          if (noStatement) {
            answer[noStatementIndex] = null;
          }
        }}
        on:uncheck={() => {
          answer[index] = null;
        }}
      />
    </li>
  {/each}
  {#if others}
    <li>
      <Choice
        type="checked"
        name="Sonstiges"
        checked={answer[othersIndex] !== null}
        on:check={() => {
          answer[othersIndex] = { text: othersTextValue, index: othersIndex };
          if (noStatement) {
            answer[noStatementIndex] = null;
          }
        }}
        on:uncheck={() => {
          answer[othersIndex] = null;
        }}
      />
    </li>
    {#if answer[othersIndex] !== null}
      <textarea
        class="w-full h-24 outline-none focus:ring-2 ring-blue-900 rounded-md p-2 text-sm"
        bind:value={othersTextValue}
        on:input={() => {
          answer[othersIndex] = { text: othersTextValue, index: othersIndex };
        }}
      />
    {/if}
  {/if}
  {#if noStatement && answer
      .slice(0, noStatementIndex)
      .map((a) => a === null)
      .reduce((a, b) => a && b)}
    <li>
      <Choice
        type="filled"
        name="Keines der Genannten"
        checked={answer[noStatementIndex] !== null}
        on:check={() => {
          answer[noStatementIndex] = {
            text: 'Keines der Genannten',
            index: noStatementIndex
          };
        }}
        on:uncheck={() => {
          answer[noStatementIndex] = null;
        }}
      />
    </li>
  {/if}
</ul>
