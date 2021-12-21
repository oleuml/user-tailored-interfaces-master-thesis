<script>
  import Color from 'color';
  import { getRandomInt } from '$lib/utils/math';
  import members from '../../../members.json';
  import NewPost from '$lib/components/NewPost.svelte';
  import NewPostPrivacy from '$lib/components/NewPostPrivacy.svelte';

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
</script>

<div class="z-0">
  <NewPost bind:post bind:loading nextPath="/survey/8" />
</div>
{#if post}
  <NewPostPrivacy bind:post {groups} on:background={() => (loading = false)} />
{/if}
