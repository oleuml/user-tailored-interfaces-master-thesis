<script>
  import MemberSlider from './MemberSlider.svelte';

  export let members;
  export let threshold;
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
  class="flex flex-wrap w-full"
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
  {#each alphabet as char}
    {#if members.filter((x) => x.name.split(' ')[1][0] === char && !x.favorite).length !== 0}
      <span class="text-xs text-gray-400">#{char}</span>
      <div class="w-full h-0.25 bg-gray-100 mb-0.5" />
      <div class="w-full">
        {#each members.filter((x) => x.name.split(' ')[1][0] === char) as member}
          <div
            class="w-full h-10 first:rounded-t-xl last:rounded-b-xl last overflow-hidden"
            on:click={() => {
              member.checked = !member.checked;
              member.manuallyEdited = true;
              members = [...members];
              tracking.push({
                t: Date.now(),
                action: `member-checked-${member.checked}`,
                pos: `privacy-modal-list`,
                member: member.name
              });
            }}
          >
            <MemberSlider
              bind:score={member.riskScore}
              proposedScore={member.proposedScore}
              title={member.name}
              {threshold}
              color={member.color}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>
