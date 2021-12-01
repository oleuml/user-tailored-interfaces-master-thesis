<script context="module">
  export async function load({ session }) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(session.userAgent)) {
      return {
        status: 200
      };
    }
    return {
      status: 400,
      error: 'You have to use this website on a mobile phone.'
    };
  }
</script>

<script>
  import '../app.css';
</script>

<div class="grid grid-flow-row grid-cols-1 gap-2 mx-2 select-none">
  <slot />
</div>
