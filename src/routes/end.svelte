<script>
  import { onMount } from 'svelte';
  import ConfettiGenerator from 'confetti-js';

  let confettiElement;

  onMount(() => {
    setTimeout(() => {
      const confettiSettings = {
        target: confettiElement,
        max: '150',
        size: '1.3',
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [
          [165, 104, 246],
          [230, 61, 135],
          [0, 199, 228],
          [253, 214, 126]
        ],
        clock: '25',
        start_from_edge: true,
        respawn: false
      };

      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    }, 100);
  });
</script>

<div class="flex justify-center items-center h-screen">
  <canvas class="absolute -z-10" bind:this={confettiElement} />
  <article class="text-center mx-10 shadow-md rounded-md p-2 bg-blue-100 text-blue-900">
    <p class="font-bold text-lg">Danke!</p>
    <p>Ich bedanke mich rechtherzlich bei Ihnen und danke für ihre Teilnahme an dieser Studie!</p>
  </article>
</div>
