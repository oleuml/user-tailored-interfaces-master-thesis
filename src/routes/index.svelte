<script>
  import PrivacyGroupList from '$lib/components/PrivacyGroupList.svelte';
  import { mdiSend } from '@mdi/js';
  import Icon from 'mdi-svelte';
  import Color from 'color';
  import { getRandomInt } from '$lib/utils/math';
  import members from '../members.json';

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
</script>

<div class="flex flex-col justify-center mx-4 space-y-2 select-none">
  <div><PrivacyGroupList {groups} /></div>
  <button class="w-full bg-blue-500 text-white rounded-md h-12 text-lg">
    <span class="flex justify-center items-center"
      ><span>Senden</span>
      <span class="absolute right-4"><Icon path={mdiSend} /></span>
    </span>
  </button>
</div>
