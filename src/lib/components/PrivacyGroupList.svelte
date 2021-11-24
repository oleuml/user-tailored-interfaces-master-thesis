<script>
  import PrivacyGroupItem from './PrivacyGroupItem.svelte';

  export let groups;
</script>

<div class="w-full space-y-2.5">
  {#each groups as group, i}
    <PrivacyGroupItem title={group.title} members={group.members} />
  {/each}
</div>
