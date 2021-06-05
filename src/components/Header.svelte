<script lang="ts">
  import type { SocialMenuItems } from '../types/socialMenuItems';

  import Navbar from './Navbar.svelte';
  import NavBrand from './NavBrand.svelte';

  export let helpers: {
    permalinks: {
      home: (option: { slug: string }) => string;
      contact: (option: { slug: string }) => string;
      blogList: (option: { slug: string }) => string;
    };
  };

  export let socialMenuItems: SocialMenuItems;

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
    @media (max-width: 560px) {
      flex-direction: column;
    }
  }
</style>

<header>
  <NavBrand {helpers} />
  <Navbar {socialMenuItems} {navItems} />
</header>
