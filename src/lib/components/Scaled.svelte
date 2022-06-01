<!--
  Simple wrapper component for scaling and animations for subcomponents.
  This is for the modal stacking.
-->

<script lang="ts" context="module">
  export type Scale = 1.0 | 0.95 | 0.9;
</script>

<script lang="ts">
  export let scale: Scale = 1.0;
  export let position: number = 0;
</script>

<div
  class:duration-100={scale === 1.0}
  class:duration-200={scale <= 1.0}
  class:scale-100={scale === 1.0}
  class:scale-95={scale === 0.95}
  class:scale-90={scale === 0.9}
  class:-translate-y-4={position === -4}
  class:-translate-y-8={position === -8}
  class="absolute bottom-0 box-border transition:padding h-full w-full"
>
  <slot />
</div>
