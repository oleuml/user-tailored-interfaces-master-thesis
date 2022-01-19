<script>
  import PrivacyGroupItem from './PrivacyGroupItem.svelte';

  export let groups;
  export let tracking;
  export let defaultMembers;
</script>

<div class="w-full space-y-2.5">
  {#each groups as group, i}
    <PrivacyGroupItem
      title={group.title}
      {defaultMembers}
      bind:members={group.members}
      bind:tracking
    />
  {/each}
</div>
