<script lang="ts">
  export let answer: { text: string; index: number };

  let othersTextValue = '';
  if (answer === null) answer = { text: othersTextValue, index: 0 };
</script>

<textarea
  class="w-full h-24 outline-none focus:ring-2 ring-blue-900 rounded-md p-2 text-sm select-text"
  bind:value={othersTextValue}
  on:input={() => {
    answer = { text: othersTextValue, index: 0 };
  }}
/>
