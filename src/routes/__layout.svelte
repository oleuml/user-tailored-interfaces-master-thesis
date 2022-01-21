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

<svelte:head><title>Studie</title></svelte:head>
<slot />
