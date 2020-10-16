<script>
import Navbar from "./Navbar.svelte";
import NavBrand from "./NavBrand.svelte";
export let helpers;
</script>
<style lang="scss">
  header {
    padding: 0rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 40em) {
      flex-direction: column;
      nav {
        margin: var(--spacing-1);
      }
    }
  }
</style>

<header>
    <NavBrand {helpers} />
    <Navbar {helpers} />
</header>
