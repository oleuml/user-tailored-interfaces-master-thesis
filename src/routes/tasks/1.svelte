<script>
  import Color from 'color';
  import { getRandomInt } from '$lib/utils/math';
  import members from '$lib/data/members-t1.json';
  import NewPost from '$lib/components/NewPost.svelte';
  import NewPostPrivacy from '$lib/components/NewPostPrivacy.svelte';
  import Cookies from 'js-cookie';
  import PrivacyGroupList from '$lib/components/ui1/PrivacyGroupList.svelte';
  import { task1 } from '$lib/stores/task1';
  import { onMount } from 'svelte';
  import RiskIndicator from '$lib/components/RiskIndicator.svelte';

  let groups = [
    {
      title: 'Familie',
      members: members.filter((m) => m.group === 'Familie')
    },
    {
      title: 'Freunde',
      members: members.filter((m) => m.group === 'Freunde')
    },
    {
      title: 'Arbeitskollegen',
      members: members.filter((m) => m.group === 'Arbeitskollegen')
    },
    {
      title: 'Bekannte',
      members: members.filter((m) => m.group === 'Bekannte')
    }
  ];

  groups.map((group) => {
    group.members.map((member) => {
      if (member.color === undefined) {
        member['color'] = Color.rgb(
          getRandomInt(0, 255),
          getRandomInt(0, 255),
          getRandomInt(0, 255)
        );
      }
    });
  });

  let post = false;
  let loading = false;
  let imagePath = '/images/pet_image.png';

  onMount(() => {
    if (!$task1['start']) $task1['start'] = Date.now();
    if (!$task1['members']) $task1['members'] = groups;
    if (!$task1['tracking']) $task1['tracking'] = [];
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
    if (!$task1['end']) {
      $task1['end'] = Date.now();
      Cookies.set('task', parseInt(Cookies.get('task')) + 1);
    }
  }}
/>

{#if post}
  <NewPostPrivacy
    bind:post
    bind:tracking={$task1['tracking']}
    on:background={() => (loading = false)}
  >
    <RiskIndicator riskValue={0.35} bind:tracking={$task1['tracking']} />
    <PrivacyGroupList bind:tracking={$task1['tracking']} bind:groups={$task1.members} />
  </NewPostPrivacy>
{/if}
