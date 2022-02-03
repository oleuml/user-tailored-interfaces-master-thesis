<script context="module">
  export const checked = (threshold, score) => {
    return !(score === 0 ? false : score >= threshold);
  };
</script>

<script>
  export let score;
  export let threshold;

  let slider;
  let touched = false;
</script>

<div bind:this={slider} class="relative w-full bg-gray-200 overflow-hidden">
  <div
    class:bg-green-400={checked(threshold, score)}
    class:bg-green-300={!checked(threshold, score)}
    class="absolute h-full transition duration-200"
    style="width: {100 - score * 100}%"
  />
  <div
    class:w-3={touched}
    class:w-1={!touched}
    class:bg-blue-500={touched}
    class:bg-blue-300={!touched}
    class="absolute h-full transition duration-200 transition-margin"
    style="margin-left: calc({(1 - score) * 100}% - {!touched ? 4 / 2 : 12 / 2}px)"
  />
  <div
    class="absolute h-full flex flex-wrap justify-center content-center font-medium bg-red-500 w-0.5"
    style="margin-left: calc({(1 - threshold) * 100}% - {1}px)"
  />
  <div class="absolute h-full flex flex-wrap justify-center content-center">
    <slot />
  </div>

  <div class="relative h-full w-full">
    <div
      class="absolute h-full w-6"
      style="margin-left: calc({100 - score * 100}% - {24 / 2}px)"
      on:touchstart|preventDefault={() => {
        touched = true;
      }}
      on:touchmove|preventDefault={(event) => {
        let { left, width } = slider.getBoundingClientRect();
        let touch = event.changedTouches[0].clientX - left;
        score = 1 - Math.min(Math.max(touch / width, 0), 1);
      }}
      on:touchend|preventDefault={() => {
        touched = false;
      }}
    />
  </div>
</div>
