<script lang="ts" context="module">
  export async function load({ session }) {
    if (session.token !== undefined) {
      return {
        status: 302,
        redirect: `/survey`
      };
    } else {
      return { status: 200 };
    }
  }
</script>

<script lang="ts">
  import Button from '$lib/components/material/Button.svelte';
  import TopBar from '$lib/components/material/TopBar.svelte';
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
            Vielen Dank erstmal, dass Sie den Weg hierher gefunden haben. Ich, Ole Umlauft, führe
            diese Studie im Rahmen meiner Masterarbeit durch. Untersucht werden Entscheidungen
            bezüglich des Personenkreises bei Bildveröffentlichungen in sozialen Netzwerken. Dafür
            wickeln Sie mehrere Bildveröffentlichungen in fiktiven Szenarien ab. Bitte bearbeiten
            Sie die Studie nach bestem Wissen und Gewissen. Sie benötigen ca. 35 min für die
            Durchführung. Holen Sie sich also ruhig einen Kaffee oder Tee dazu.
          </p>
        </article>
      </div>
      <div class="box text-red-700 bg-red-200">
        <article class="p-2">
          <p class="font-bold pb-1 flex">
            <span class="pr-2"><Icon path={mdiAlert} /></span>
            <span>WICHTIG!</span>
          </p>
          <ul class="list-disc list-inside text-sm">
            <li><b>Sie dürfen nur teilnehmen, wenn Sie 18 Jahre oder älter sind.</b></li>
            <li><b>Bitte führen Sie die Studie nur an einem Smartphone durch.</b></li>
            <li><b>Sie dürfen die Studie nur einmal bearbeiten.</b></li>
          </ul>
        </article>
      </div>
      <div class="box text-blue-900 bg-blue-100">
        <article class="p-2">
          <p class="font-bold pb-1">Vielen Dank und viel Spaß!</p>
          <p class="text-sm">
            Senden Sie den Link gerne an ihre Freunde und Bekannten weiter. Das würde mir sehr
            helfen!
          </p>
        </article>
        <div class="flex px-2 pb-2">
          <input type="checkbox" bind:checked />
          <span on:click={() => (checked = !checked)} class="pl-2"
            >Ich bin mit den <a
              target="_blank"
              rel="noopener noreferrer"
              on:click|stopPropagation
              class="text-blue-900 text-opacity-80 flex flex-wrap"
              href="/privacy-policy.pdf"
              ><span>Datenschutzbestimmungen</span><Icon path={mdiOpenInNew} size={0.7} /></a
            > einverstanden.</span
          >
        </div>
        <div class="flex flex-wrap justify-center">
          <Button disabled={!checked} title="Studie starten" on:click={start} />
        </div>
      </div>
    </div>
  </div>
</div>
