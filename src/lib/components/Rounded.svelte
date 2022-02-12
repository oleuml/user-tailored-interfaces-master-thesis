<script lang="ts">
  export let active: boolean = false;
</script>

<div
  class:rounded-t-xl={active}
  class:duration-100={!active}
  class:duration-200={active}
  class:overflow-hidden={active}
  class="transition:rounded-t-xl h-full"
>
  <slot />
</div>
