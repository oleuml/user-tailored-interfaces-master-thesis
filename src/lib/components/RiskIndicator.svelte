<script>
  export let riskValue; // between 0 and 1
  export let tracking;
  function showInfo() {
    alert(
      'Dieser Indikator zeigt dir das Risiko deines Post an. Risiko bedeutet wie sensibel dein Post ist.'
    );
    tracking.push({
      t: Date.now(),
      action: 'alert-show-info',
      pos: 'privacy-modal-risk-indicator'
    });
  }
</script>

<div class="relative pt-1 overflow-hidden">
  <div class="flex mb-2 items-center justify-between" on:click={showInfo}>
    <div>
      <span
        class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
        class:text-green-600={riskValue <= 0.2}
        class:text-yellowgreen-600={riskValue > 0.2 && riskValue <= 0.4}
        class:text-yellow-600={riskValue > 0.4 && riskValue <= 0.6}
        class:text-orange-600={riskValue > 0.6 && riskValue <= 0.8}
        class:text-red-600={riskValue > 0.8}
        class:bg-green-200={riskValue <= 0.2}
        class:bg-yellowgreen-200={riskValue > 0.2 && riskValue <= 0.4}
        class:bg-yellow-200={riskValue > 0.4 && riskValue <= 0.6}
        class:bg-orange-200={riskValue > 0.6 && riskValue <= 0.8}
        class:bg-red-200={riskValue > 0.8}
      >
        Risiko
      </span>
    </div>
    <div class="text-right">
      <span
        class="text-xs font-semibold inline-block"
        class:text-green-600={riskValue <= 0.2}
        class:text-yellowgreen-500={riskValue > 0.2 && riskValue <= 0.4}
        class:text-yellow-600={riskValue > 0.4 && riskValue <= 0.6}
        class:text-orange-600={riskValue > 0.6 && riskValue <= 0.8}
        class:text-red-600={riskValue > 0.8}
      >
        {#if riskValue <= 0.2}
          Sehr gering
        {:else if riskValue <= 0.4}
          gering
        {:else if riskValue <= 0.6}
          mittel
        {:else if riskValue <= 0.8}
          hoch
        {:else}
          sehr hoch
        {/if}
      </span>
    </div>
  </div>
  <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
    <div
      style="width: 20%"
      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
    />
    <div
      style="width: 20%"
      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellowgreen-500"
    />
    <div
      style="width: 20%"
      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
    />
    <div
      style="width: 20%"
      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
    />
    <div
      style="width: 20%"
      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
    />
    <div
      class="absolute w-4 h-4"
      class:text-green-800={riskValue <= 0.2}
      class:text-yellowgreen-800={riskValue > 0.2 && riskValue <= 0.4}
      class:text-yellow-800={riskValue > 0.4 && riskValue <= 0.6}
      class:text-orange-800={riskValue > 0.6 && riskValue <= 0.8}
      class:text-red-800={riskValue > 0.8}
      style="left: calc({riskValue * 100}% - 0.5rem)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <path style="fill: currentColor" d="M 8,3 0,16 16,16 z" />
      </svg>
    </div>
  </div>
</div>

<style>
  .bg-yellowgreen-800 {
    background-color: #09af00;
  }
  .bg-yellowgreen-600 {
    background-color: #61d800;
  }
  .bg-yellowgreen-500 {
    background-color: #75e900;
  }
  .bg-yellowgreen-200 {
    background-color: #c6f68d;
  }
</style>
