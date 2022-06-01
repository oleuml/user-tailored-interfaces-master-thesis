<!--
  Exercise Modal is used to display the task description,
  whether the task has been completed, and whether this task needs to be repeated.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Exercise } from '$lib/exercises';
  import Button from '$lib/components/material/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  export let visible: boolean;
  export let started: boolean;
  export let sent: boolean;
  export let fulfilled: boolean;
  export let activeExercise: Writable<number>;
  export let exercises: Exercise[];

  let showTaskDescription = false;

  const dispatch = createEventDispatcher();
</script>

{#if visible}
  <div
    class="fixed w-screen h-screen top-0 bg-opacity-80 bg-black flex justify-center items-center"
    transition:fade={{ duration: 100 }}
  >
    <div
      class="bg-white p-3 max-h-full overflow-y-auto rounded-lg w-4/5"
      in:fly={{ duration: 150, delay: 50, y: 200 }}
    >
      {#if !started && !fulfilled}
        <article>
          <p class="font-semibold">
            Aufgabe {$activeExercise + 1}/{exercises.length}: {exercises[$activeExercise].title}
          </p>
          <p class="text-sm">
            {@html exercises[$activeExercise].description}
          </p>
        </article>
        <div class="flex justify-center scale-90">
          <Button on:click={() => dispatch('start')} title="Aufgabe starten" />
        </div>
      {:else if started && sent && !fulfilled}
        {#if !showTaskDescription}
          <article>Aufgabe nicht korrekt erfüllt. Versuche es noch einmal.</article>

          <div class="flex justify-center scale-90">
            <Button
              on:click={() => {
                showTaskDescription = true;
              }}
              title="Zur Aufgabenstellung"
            />
          </div>
        {:else}
          <article>
            <p class="font-semibold">
              Aufgabe {$activeExercise + 1}/{exercises.length}: {exercises[$activeExercise].title}
            </p>
            <p class="text-sm">
              {@html exercises[$activeExercise].description}
            </p>
          </article>
          <div class="flex justify-center scale-90">
            <Button
              on:click={() => {
                dispatch('restart');
                showTaskDescription = false;
              }}
              title="Aufgabe starten"
            />
          </div>
        {/if}
      {:else if fulfilled}
        <article>
          Super, Du hast die Aufgabe {$activeExercise + 1}/{exercises.length} erfolgreich gelöst!
        </article>
        <div class="flex justify-center scale-90">
          {#if $activeExercise < exercises.length - 1}
            <Button
              on:click={() => {
                activeExercise.set($activeExercise + 1);
                dispatch('next-exercise');
              }}
              title="Nächste Aufgabe"
            />
          {:else}
            <Button
              on:click={() => {
                document.body.style.background = 'white';
                goto('/survey');
              }}
              title="Zum Fragebogen"
            />
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
