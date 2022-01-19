<script>
  import members from '$lib/data/members-t2.json';
  import NewPost from '$lib/components/NewPost.svelte';
  import NewPostPrivacy from '$lib/components/NewPostPrivacy.svelte';

  import Cookies from 'js-cookie';
  import PrivacyList from '$lib/components/ui2/PrivacyList.svelte';
  import { onMount } from 'svelte';
  import { task2 } from '$lib/stores/task2';
  import RiskIndicator from '$lib/components/RiskIndicator.svelte';

  let post = false;
  let loading = false;

  let imagePath = '/images/party_image.png';

  onMount(() => {
    if (!$task2['start']) $task2['start'] = Date.now();
    if (!$task2['members']) $task2['members'] = members;
    if (!$task2['tracking']) $task2['tracking'] = [];
  });
</script>

<NewPost
  bind:post
  bind:loading
  title={'Aufgabe ' + (parseInt(Cookies.get('task')) + 1)}
  nextPath="/survey/{parseInt(Cookies.get('page')) + 1}"
  {imagePath}
  on:send={() => {
    if (!$task2['end']) {
      $task2['end'] = Date.now();
      Cookies.set('task', parseInt(Cookies.get('task')) + 1);
    }
  }}
/>

{#if post}
  <NewPostPrivacy
    bind:tracking={$task2['tracking']}
    bind:post
    on:background={() => (loading = false)}
  >
    <div class="mx-6">
      <RiskIndicator riskValue={0.9} bind:tracking={$task2['tracking']} />
    </div>
    <PrivacyList bind:tracking={$task2['tracking']} bind:members={$task2.members} />
  </NewPostPrivacy>
{/if}
