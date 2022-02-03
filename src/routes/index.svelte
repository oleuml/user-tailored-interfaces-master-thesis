<script context="module">
  export async function load({ session }) {
    if (session.token !== undefined) {
      let page = session.page;
      return {
        status: 302,
        redirect: `/survey/${page !== undefined ? page : '0'}`
      };
    } else {
      return { status: 200 };
    }
  }
</script>

<script>
  import Button from '$lib/material/Button.svelte';
  import TopBar from '$lib/material/TopBar.svelte';
  import { mdiAlert, mdiOpenInNew } from '@mdi/js';
  import Icon from 'mdi-svelte';

  let height;
  let width;
  let scrollX;
  let scrollY;

  async function start() {
    return await fetch('/api/start', {
      redirect: 'follow',
      credentials: 'same-origin',
      method: 'POST',
      body: `{"screenSize": {"w": ${width}, "h": ${height}}}`,
      headers: new Headers([['Content-Type', 'application/json']])
    }).then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    });
  }

  let checked = false;
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} bind:scrollX bind:scrollY />

<div class="flex flex-col h-screen">
  <div class="flex-initial">
    <TopBar title="Studie">
      <div slot="start" />
      <div slot="end" />
    </TopBar>
  </div>
  <div class="flex-auto">
    <div class="grid grid-flow-row grid-cols-1 gap-2 mx-2 mt-2 select-none">
      <div class="box text-blue-900 bg-blue-100">
        <article class="p-2">
          <p class="font-bold pb-1">Hallo und herzlich willkommen!</p>
          <p>
            Vielen Dank erstmal, dass Du den Weg hierher gefunden hast. Im
            Rahmen meiner Masterarbeit führe ich diese Studie durch. Die Studie
            dauert durchschnittlich ca. 15 min.
          </p>
        </article>
      </div>
      <div class="box text-red-700 bg-red-200">
        <article class="p-2">
          <p class="font-bold pb-1 flex">
            <span class="pr-2"><Icon path={mdiAlert} /></span>
            <span>WICHTIG!</span>
          </p>
          Durchführung der Studie...
          <ul class="list-disc list-inside">
            <li><b>alleine,</b></li>
            <li><b>an einem Stück,</b></li>
            <li><b>auf dem Smartphone</b></li>
            <li>und <b>nur einmal.</b></li>
          </ul>
        </article>
      </div>
      <div class="box text-blue-900 bg-blue-100">
        <article class="p-2">
          <p class="font-bold pb-1">Hallo und herzlich willkommen!</p>
          <p>Vielen Dank und viel Spaß.</p>
        </article>
        <div class="flex px-2 pb-2">
          <input type="checkbox" bind:checked />
          <span on:click={() => (checked = !checked)} class="pl-2"
            >Ich bin mit den <a
              on:click|stopPropagation
              class="text-blue-900 text-opacity-80 flex flex-wrap "
              href="#"
              ><span>Datenschutzbestimmungen</span><Icon
                path={mdiOpenInNew}
                size={0.7}
              /></a
            > einverstanden</span
          >
        </div>
        <div class="flex flex-wrap justify-center">
          <Button disabled={!checked} title="Studie starten" on:click={start} />
        </div>
      </div>
    </div>
  </div>
</div>
