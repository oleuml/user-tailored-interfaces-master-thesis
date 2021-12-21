<script>
  export let answer;
  export let answers;
</script>

<ul class="space-y-1.5">
  {#each answers as a, i}
    <li>
      <label class="flex items-stretch">
        <button
          class="button self-center mr-1.5"
          class:bg-blue-50={answer === null || answer.index !== i}
          class:bg-yellow-500={answer !== null && answer.index === i}
          on:click={() => (answer = { text: a, index: i })}
        />
        <div class="text-sm">{a}</div>
      </label>
    </li>
  {/each}
</ul>

<style lang="scss">
  .button {
    @apply rounded-full border-2 border-blue-900 w-5 h-5;
  }
</style>
