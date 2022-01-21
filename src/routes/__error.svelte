<script context="module">
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ error, status, url, session }) {
    if (url.pathname === '/survey') {
      return {
        status: 302,
        redirect: `/survey/${session.page !== undefined ? session.page : '0'}`
      };
    }
    return {
      props: {
        title: `${status}: ${error.message}`
      }
    };
  }
</script>

<script>
  export let title;
</script>

{#if title}
  {title}
{/if}
