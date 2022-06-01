<!--
  Pure visual separator between the pieces of cake.
  It is an SVG path.
-->

<script>
  import { drawSeparator } from './PrivacyCake.svelte';

  export let strokeColor;
  export let strokeWidth;
  export let radius;
  export let startAngle;

  const center = { x: 0, y: 0 };

  $: d = drawSeparator(center.x, center.y, radius, startAngle);
</script>

<path {d} stroke={strokeColor} stroke-width={strokeWidth} />
