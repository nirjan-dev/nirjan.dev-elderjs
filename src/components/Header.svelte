<script lang="ts">
  import Navbar from './Navbar.svelte';
  import NavBrand from './NavBrand.svelte';

  export let helpers: {
    permalinks: {
      home: (option: { slug: string }) => string;
      contact: (option: { slug: string }) => string;
      blogList: (option: { slug: string }) => string;
    };
  };

  const navItems = [
    {
      name: 'Home',
      link: helpers.permalinks.home({ slug: '/' }),
    },
    {
      name: 'Blog',
      link: helpers.permalinks.blogList({ slug: 'blog' }),
    },
    {
      name: 'Contact',
      link: helpers.permalinks.contact({ slug: 'contact' }),
    },
  ];
</script>

<style lang="scss">
  header {
    padding: 0rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 40em) {
      flex-direction: column;
    }
  }
</style>

<header>
  <NavBrand {helpers} />
  <Navbar hydrate-options={{ preload: true, loading: 'eager' }} hydrate-client={{ navItems }} />
</header>
