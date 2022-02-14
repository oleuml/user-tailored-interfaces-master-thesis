<script lang="ts" context="module">
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

<script lang="ts">
  import Button from '$lib/material/Button.svelte';
  import TopBar from '$lib/material/TopBar.svelte';
  import { mdiAlert, mdiOpenInNew } from '@mdi/js';
  import Icon from 'mdi-svelte';

  let height: number;
  let width: number;
  let scrollX: number;
  let scrollY: number;

  const start = async () => {
    return await fetch('/api/start', {
      redirect: 'follow',
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({ screenSize: { w: width, h: height } }),
      headers: new Headers([['Content-Type', 'application/json']])
    }).then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    });
  };

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
          <p class="text-sm">
            Vielen Dank erstmal, dass Du den Weg hierher gefunden hast. Ich, Ole Umlauft, führe im
            Rahmen meiner Masterarbeit diese Studie durch. In dieser Studie geht es um die
            Abwicklung mehrerer Bildveröffentlichungen innerhalb fiktiver Szenarien. Jede Abwicklung
            ist eine Aufgabe, welche im Vorhinein beschrieben wird. Ziel dabei ist es schlussendlich
            herauszufinden, ob es für verschiedene Situationen oder Personengruppen mit ähnlichen
            Eigenschaften zugeschnittene Benutzeroberflächen benötigt. Zusätzlich wird auch
            evaluiert, ob die Hinweise und Darstellungsweisen dem Nutzer dabei helfen, die
            "richtigen" Entscheidungen zu treffen und das in einer angemessenen Zeit.
          </p>
          <p class="text-sm">Die Durchführung der Studie dauert ca. 30 min.</p>
        </article>
      </div>
      <div class="box text-red-700 bg-red-200">
        <article class="p-2">
          <p class="font-bold pb-1 flex">
            <span class="pr-2"><Icon path={mdiAlert} /></span>
            <span>WICHTIG!</span>
          </p>
          <ul class="list-disc list-inside text-sm">
            <li><b>Du musst mindestens 18 Jahre alt sein.</b></li>
            <li><b>Du musst diese Studie an einem Smartphone durchführen.</b></li>
            <li><b>Du darfst an dieser Studie nur einmal teilnehmen.</b></li>
          </ul>
        </article>
      </div>
      <div class="box text-blue-900 bg-blue-100">
        <article class="p-2">
          <p class="font-bold pb-1">Vielen Dank und viel Spaß.</p>
          <p class="text-sm">
            Gerne kannst Du den Link an Freunde und Bekannte weiterleiten. Dies würde mir sehr
            helfen.
          </p>
        </article>
        <div class="flex px-2 pb-2">
          <input type="checkbox" bind:checked />
          <span on:click={() => (checked = !checked)} class="pl-2"
            >Du bist <a
              target="_blank"
              rel="noopener noreferrer"
              on:click|stopPropagation
              class="text-blue-900 text-opacity-80 flex flex-wrap"
              href="/privacy-policy.pdf"
              ><span>Datenschutzbestimmungen</span><Icon path={mdiOpenInNew} size={0.7} /></a
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
