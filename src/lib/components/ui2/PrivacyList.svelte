<script>
  import { mdiCheckCircle } from '@mdi/js';
  import Icon from 'mdi-svelte';
  import MemberBadge from '../MemberBadge.svelte';

  export let members;
  export let tracking;
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
</script>

<div
  class="flex flex-wrap w-full justify-center"
  on:scroll={(event) => {
    tracking.push({
      t: Date.now(),
      action: 'scroll',
      pos: 'privacy_modal_list',
      data: {
        scrollHeight: event.target.scrollHeight,
        scrollLeft: event.target.scrollLeft,
        scrollLeftMax: event.target.scrollLeftMax,
        scrollTop: event.target.scrollTop,
        scrollTopMax: event.target.scrollTopMax,
        scrollWidth: event.target.scrollWidth
      }
    });
  }}
>
  <div class="w-5/6">
    <div class="pt-3">
      <span class="text-xs text-gray-400">#☆</span>
      <div class="w-full h-0.25 bg-gray-100 mb-0.5" />
      {#each members.filter((x) => x.favorite) as member}
        <li
          class="flex flex-column justify-between items-center py2-0.5"
          on:click={() => {
            member.checked = !member.checked;
            tracking.push({
              t: Date.now(),
              action: `member-checked-${member.checked}`,
              pos: `privacy-modal-list`,
              member: member.name
            });
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
              on:click={() => (member.checked = !member.checked)}
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
<!-- <div class="flex w-4">
    <ul>
      {#each ["☆", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] as char}
        <li class="text-xs text-center text-gray-400">{char}</li>
      {/each}
    </ul>
  </div> -->
