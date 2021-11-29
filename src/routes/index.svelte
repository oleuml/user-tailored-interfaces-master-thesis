<script>
  import { mdiAlert } from '@mdi/js';
  import Icon from 'mdi-svelte';
</script>

<div class="box text-blue-600 bg-blue-200">
  <article class="p-2">
    <p class="font-bold pb-1">Hallo und herzlich willkommen!</p>
    <p>
      Vielen Dank erstmal, dass Du den Weg hierher gefunden hast. Im Rahmen meiner Masterarbeit
      führe ich diese Studie durch. Die Studie dauert durchschnittlich ca. 15 min.
    </p>
  </article>
</div>
<div class="box text-red-600 bg-red-200">
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
<div class="box text-blue-600 bg-blue-200">
  <article class="p-2">
    <p class="font-bold pb-1">Hallo und herzlich willkommen!</p>
    <p>Vielen Dank und viel Spaß.</p>
  </article>
</div>

<a
  href="/survey"
  class="box active:text-green-600 active:bg-green-200 text-white bg-green-400 text-center font-bold"
  >Studie starten.</a
>
