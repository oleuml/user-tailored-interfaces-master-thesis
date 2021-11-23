<script>
  import PrivacyGroupItem from './PrivacyGroupItem.svelte';

  export let groups;
  let groupEdit = null;
</script>

<div class="w-full">
  {#each groups as group, i}
    <PrivacyGroupItem
      bind:groupEdit
      edit={i}
      title={group.title}
      checked={group.checked}
      members={group.members}
      on:click={() => (groups[i].checked = !groups[i].checked)}
    />
  {/each}
</div>
