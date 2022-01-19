<script>
  import Color from 'color';
  import { getRandomInt } from '$lib/utils/math';
  import members from '$lib/data/members-t0.json';
  import NewPost from '$lib/components/NewPost.svelte';
  import NewPostPrivacy from '$lib/components/NewPostPrivacy.svelte';
  import Cookies from 'js-cookie';
  import PrivacyGroupList from '$lib/components/ui1/PrivacyGroupList.svelte';
  import { onMount } from 'svelte';
  import { task0 } from '$lib/stores/task0';
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

  let imagePath = '/images/party_image.png';

  onMount(() => {
    if (!$task0['start']) $task0['start'] = Date.now();
    if (!$task0['members']) $task0['members'] = groups;
    if (!$task0['tracking']) $task0['tracking'] = [];
  });
</script>

<NewPost
  bind:post
  bind:loading
  title={'Aufgabe ' + (parseInt(Cookies.get('task')) + 1)}
  nextPath="/survey/{parseInt(Cookies.get('page')) + 1}"
  {imagePath}
  on:send={() => {
    if (!$task0['end']) {
      $task0['end'] = Date.now();
      Cookies.set('task', parseInt(Cookies.get('task')) + 1);
    }
  }}
/>

{#if post}
  <NewPostPrivacy
    bind:tracking={$task0['tracking']}
    bind:post
    on:background={() => (loading = false)}
  >
    <RiskIndicator riskValue={0.9} bind:tracking={$task0['tracking']} />
    <PrivacyGroupList
      defaultMembers={members}
      bind:tracking={$task0['tracking']}
      bind:groups={$task0['members']}
    />
  </NewPostPrivacy>
{/if}
