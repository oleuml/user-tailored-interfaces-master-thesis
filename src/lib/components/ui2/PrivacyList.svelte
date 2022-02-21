<script lang="ts">
  import type { Member } from '$lib/members';
  import type { Action } from '$lib/stores/taskTracking';

  import { mdiCheckCircle, mdiBackupRestore } from '@mdi/js';
  import Icon from 'mdi-svelte';
  import { createEventDispatcher } from 'svelte';
  import MemberBadge from '../MemberBadge.svelte';

  const dispatcher = createEventDispatcher();

  export let members: Array<Member>;
  export let defaultMembers: Array<Member>;
  const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];
  $: members.sort((a, b) => a.name.split(' ')[1].localeCompare(b.name.split(' ')[1]));

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<div
  class="flex flex-wrap w-full justify-center"
  on:scroll={(event) => {
    let data = {
      scrollHeight: event.target['scrollHeight'],
      scrollTop: event.target['scrollTop'],
      scrollTopMax: event.target['scrollTopMax']
    };
    track('scroll', data);
  }}
>
  <div class="w-full">
    <div class="flex flex-column justify-between items-center py-0.5">
      <button
        class="flex items-center text-gray-500 gap-2"
        on:click={() => {
          members = JSON.parse(JSON.stringify(defaultMembers));
          track('select-defaults');
        }}
      >
        <div><Icon path={mdiBackupRestore} /></div>
        <div class="text-xs">Zurücksetzen</div>
      </button>
      <button
        class="flex items-center gap-2"
        on:click={() => {
          if (members.filter((m) => !m.checked).length === 0) {
            members.forEach((m) => (m.checked = false));
            track('deselect-all');
          } else {
            members.forEach((m) => (m.checked = true));
            track('select-all');
          }
          members = [...members];
        }}
      >
        <div class="text-xs text-gray-500">
          {#if members.filter((m) => !m.checked).length === 0}
            Alle abwählen
          {:else}
            Alle auswählen
          {/if}
        </div>
        <div
          class="pr-2"
          class:text-green-500={members.filter((m) => !m.checked).length === 0}
          class:text-gray-400={members.filter((m) => !m.checked).length !== 0}
        >
          {#if members.filter((m) => !m.checked).length === 0}
            <Icon path={mdiCheckCircle} size={1.0} />
          {:else}
            <svg
              viewBox="0 0 24 24"
              style=" width:1.5rem; height:1.5rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="gray" stroke-width="1.2" fill="transparent" />
            </svg>
          {/if}
        </div>
      </button>
    </div>
    <div class="pt-3">
      <span class="text-xs text-gray-400">#☆</span>
      <div class="w-full h-0.25 bg-gray-100 mb-0.5" />
      {#each members.filter((x) => x.favorite) as member}
        <li
          class="flex flex-column justify-between items-center py-0.5"
          on:click={() => {
            member.checked = !member.checked;
            if (member.checked) {
              track('select', { member: member.name });
            } else {
              track('deselect', { member: member.name });
            }
          }}
        >
          <span class="flex flex-wrap items-center gap-2"
            ><MemberBadge
              name={member.name}
              color={member.color}
              badged={null}
            />{member.name}</span
          >
          <span
            class="pr-2"
            class:text-green-500={member.checked}
            class:text-gray-400={!member.checked}
          >
            {#if member.checked}
              <Icon path={mdiCheckCircle} size={1.0} />
            {:else}
              <svg
                viewBox="0 0 24 24"
                style=" width:1.5rem; height:1.5rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="gray"
                  stroke-width="1.2"
                  fill="transparent"
                />
              </svg>
            {/if}
          </span>
        </li>
      {/each}
    </div>

    {#each alphabet as char}
      {#if members.filter((x) => x.name.split(' ')[1][0] === char && !x.favorite).length !== 0}
        <div class="pt-3">
          <span class="text-xs text-gray-400">#{char}</span>
          <div class="w-full h-0.25 bg-gray-100 mb-0.5" />
          {#each members.filter((x) => x.name.split(' ')[1][0] === char && !x.favorite) as member}
            <li
              class="flex flex-column justify-between items-center py-0.5"
              on:click={() => {
                member.checked = !member.checked;
                if (member.checked) {
                  track('select', { member: member.name });
                } else {
                  track('deselect', { member: member.name });
                }
              }}
            >
              <span class="flex flex-wrap items-center gap-2"
                ><MemberBadge
                  name={member.name}
                  color={member.color}
                  badged={null}
                />{member.name}</span
              >
              <span
                class="pr-2"
                class:text-green-500={member.checked}
                class:text-gray-400={!member.checked}
              >
                {#if member.checked}
                  <Icon path={mdiCheckCircle} size={1.0} />
                {:else}
                  <svg
                    viewBox="0 0 24 24"
                    style=" width:1.5rem; height:1.5rem"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="gray"
                      stroke-width="1.2"
                      fill="transparent"
                    />
                  </svg>
                {/if}
              </span>
            </li>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</div>
