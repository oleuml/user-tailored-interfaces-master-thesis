<script>
  import PrivacyGroupList from '$lib/components/PrivacyGroupList.svelte';
  import { mdiSend } from '@mdi/js';
  import Icon from 'mdi-svelte';

  let groups = [
    {
      title: 'Familie',
      checked: true,
      members: [
        {
          name: 'O U'
        },
        { name: 'N C' },
        { name: 'K U' },
        { name: 'J U' },
        { name: 'M U' },
        { name: 'J U' },
        { name: 'W U' },
        { name: 'I U' },
        { name: 'G K' },
        { name: 'R U' }
      ]
    },
    {
      title: 'Freunde',
      checked: true,
      members: [
        { name: 'N C' },
        { name: 'D E' },
        { name: 'N R' },
        { name: 'D L' },
        { name: 'J S' },
        { name: 'J D' },
        { name: 'E B' },
        { name: 'D M' },
        { name: 'V S' },
        { name: 'F M R' },
        { name: 'A L' },
        { name: 'N B' }
      ]
    },
    {
      title: 'Arbeit',
      checked: false,
      members: [{ name: 'F G' }, { name: 'N R' }, { name: 'L G' }]
    }
  ];
</script>

<div class="relative flex flex-wrap h-screen justify-center mx-4 gap-2">
  <PrivacyGroupList {groups} />
  <button class="absolute w-full bottom-2 bg-blue-500 text-white rounded-md h-12 text-lg">
    <span class="flex justify-center items-center"
      ><span>Senden</span>
      <span class="absolute right-4"><Icon path={mdiSend} /></span>
    </span>
  </button>
</div>
