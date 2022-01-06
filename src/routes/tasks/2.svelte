<script>
  import { goto } from "$app/navigation";
  import Cookies from "js-cookie";
</script>

<button
  class="w-10 h-6 bg-blue-900"
  on:click={() => {
    goto(`/survey/${parseInt(Cookies.get("page")) + 1}`);
  }}
/>
