<script>
  import { onMount } from 'svelte';

  onMount(() => {
    document.body.style.background = 'black';
  });
</script>

<slot />
