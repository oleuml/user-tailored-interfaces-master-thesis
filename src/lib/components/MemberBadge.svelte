<script>
  export let name = '#';
  let short = name
    .split(' ')
    .map((x) => x[0])
    .join('');
</script>

<div
  class="rounded-2xl h-8 w-8 bg-red-200 flex flex-wrap content-center justify-center text-red-500 overflow-hidden"
>
  {short}
</div>
