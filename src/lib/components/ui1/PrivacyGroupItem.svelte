<script lang="ts">
  import Icon from 'mdi-svelte';
  import {
    mdiAccountMultipleCheck,
    mdiAccountMultipleRemove,
    mdiBackupRestore,
    mdiCheckboxMultipleBlankCircleOutline,
    mdiCheckboxMultipleMarkedCircle,
    mdiCheckCircle,
    mdiChevronDown,
    mdiCircleOutline
  } from '@mdi/js';
  import MemberBadge from '../MemberBadge.svelte';
  import { slide, fade } from 'svelte/transition';

  export let title: string;
  export let members: any;
  export let tracking: any;
  export let defaultMembers: any;

  let expanded = false;

  function toggleExpanded() {
    expanded = !expanded;
    tracking.push({
      t: Date.now(),
      action: `toggle-expansion-${expanded}`,
      pos: `privacy-modal-group-list-${title}`
    });
  }

  function reset() {
    members.forEach((x) => {
      let checked = defaultMembers.find((y) => x.name === y.name).checked;
      x.checked = checked;
    });
    members = [...members];
  }
</script>

<div class="w-full">
  <div class="relative rounded-md shadow-md bg-gray-100">
    <div class="flex justify-between h-full">
      <div class="h-full w-full">
        <div
          class="flex items-end pl-2 p-1 text-sm text-gray-500 font-semibold"
          class:top-0={expanded}
          class:bottom-0={!expanded}
          on:click|stopPropagation={toggleExpanded}
        >
          <span>{title}</span>
          <span class="pl-3 pr-1 text-green-500"
            ><Icon path={mdiAccountMultipleCheck} size="1.3rem" /></span
          >
          <span class="text-green-500">{members.filter((m) => m.checked).length}</span>
          <span class="pl-3 pr-1 text-red-500"
            ><Icon path={mdiAccountMultipleRemove} size="1.3rem" /></span
          >
          <span class="text-red-500">{members.filter((m) => !m.checked).length}</span>
        </div>

        {#if !expanded}
          <div
            class="flex flex-wrap content-start min-h-20 max-h-20 gap-1 overflow-auto px-1 rounded-md bg-white m-1 p-1.5"
            out:fade={{ duration: 100 }}
            in:fade={{ delay: 100, duration: 100 }}
          >
            {#each members as member}
              <MemberBadge
                name={member.name}
                color={member.color}
                badged={member.checked}
                on:click={() => {
                  member.checked = !member.checked;
                  tracking.push({
                    t: Date.now(),
                    action: `member-checked-${member.checked}`,
                    pos: `privacy-modal-group-list-${title}`,
                    data: { expanded: expanded, member: member.name }
                  });
                }}
              />
            {/each}
          </div>
        {:else}
          <div class="overflow-auto m-1 max-h-52" in:slide out:slide={{ duration: 200 }}>
            {#each members as member, i}
              <div
                class="flex flex-wrap items-center justify-between p-1 space-x-2 text-gray-500"
                class:pt-1={expanded}
                class:bg-gray-50={i % 2}
                class:bg-gray-200={!(i % 2)}
                class:rounded-t-md={i === 0}
                class:rounded-b-md={i === members.length - 1}
                on:click|stopPropagation={() => {
                  members[i].checked = !members[i].checked;
                  tracking.push({
                    t: Date.now(),
                    action: `member-checked-${members[i].checked}`,
                    pos: `privacy-modal-group-list-${title}`,
                    data: { expanded: expanded, member: members[i].name }
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
                <span class="pr-2" class:text-green-500={member.checked}>
                  {#if member.checked}
                    <Icon path={mdiCheckCircle} size={0.8} />
                  {:else}
                    <Icon path={mdiCircleOutline} size={0.8} />
                  {/if}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      <div class="flex flex-wrap content-between min-h-20 flex-grow-0 flex-shrink-0 w-10">
        <button
          class="flex justify-center items-center h-10 w-10 text-gray-500"
          on:click|stopPropagation={toggleExpanded}
        >
          <div class="transition duration-300" class:rotate-180={expanded}>
            <Icon path={mdiChevronDown} />
          </div>
        </button>
        <div class="text-gray-500">
          {#if expanded}
            <button
              class="flex justify-center items-center h-8 w-10"
              on:click|stopPropagation={() => {
                reset();
                tracking.push({
                  t: Date.now(),
                  action: `member-checked-reset`,
                  pos: `privacy-modal-group-list-${title}`,
                  data: { expanded: expanded }
                });
              }}
              in:fade={{ delay: 100, duration: 200 }}
              out:fade={{ duration: 200 }}
            >
              <Icon path={mdiBackupRestore} />
            </button>
          {/if}
          <button
            class="flex justify-center items-center h-8 w-10"
            on:click|stopPropagation={() => {
              members.forEach((_, i) => (members[i].checked = false));
              tracking.push({
                t: Date.now(),
                action: `all-members-unchecked`,
                pos: `privacy-modal-group-list-${title}`,
                data: { expanded: expanded }
              });
            }}
          >
            <Icon path={mdiCheckboxMultipleBlankCircleOutline} />
          </button>
          <button
            class="flex justify-center items-center h-8 w-10"
            on:click|stopPropagation={() => {
              members.forEach((_, i) => (members[i].checked = true));
              tracking.push({
                t: Date.now(),
                action: `all-members-checked`,
                pos: `privacy-modal-group-list-${title}`,
                data: { expanded: expanded }
              });
            }}
          >
            <Icon path={mdiCheckboxMultipleMarkedCircle} />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
