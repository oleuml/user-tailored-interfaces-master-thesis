<script>
  import members from '$lib/data/members-t3.json';
  import NewPost from '$lib/components/NewPost.svelte';
  import NewPostPrivacy from '$lib/components/NewPostPrivacy.svelte';
  import Cookies from 'js-cookie';
  import PrivacyList from '$lib/components/ui2/PrivacyList.svelte';
  import { task3 } from '$lib/stores/task3';
  import { onMount } from 'svelte';
  import RiskIndicator from '$lib/components/RiskIndicator.svelte';

  let post = false;
  let loading = false;

  let imagePath = '/images/pet_image.png';

  onMount(() => {
    if (!$task3['start']) $task3['start'] = Date.now();
    if (!$task3['members']) $task3['members'] = members;
    if (!$task3['tracking']) $task3['tracking'] = [];
  });
</script>

<!-- TODO: Change selected members -->

<NewPost
  bind:post
  bind:loading
  title={'Aufgabe ' + (parseInt(Cookies.get('task')) + 1)}
  nextPath="/survey/{parseInt(Cookies.get('page')) + 1}"
  {imagePath}
  on:send={() => {
    if (!$task3['end']) {
      $task3['end'] = Date.now();
      Cookies.set('task', parseInt(Cookies.get('task')) + 1);
    }
  }}
/>

{#if post}
  <NewPostPrivacy
    bind:tracking={$task3['tracking']}
    bind:post
    on:background={() => (loading = false)}
  >
    <div class="mx-6">
      <RiskIndicator riskValue={0.35} bind:tracking={$task3['tracking']} />
    </div>
    <PrivacyList bind:tracking={$task3['tracking']} {members} />
  </NewPostPrivacy>
{/if}
