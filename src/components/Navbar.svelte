<script lang="ts">
  export let helpers;

  export let navItems = [
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
  ul {
    padding: 0;
    display: flex;
    list-style-type: none;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
  }

  a {
    color: var(--dark);
    transition: all 300ms ease-out;
    display: inline-block;
    padding: 0.3em 2em;
    min-width: 5rem;
    &:hover,
    &:active,
    &:focus {
      color: var(--secondary);
    }
  }
</style>

<nav>
  <ul>
    {#each navItems as navItem}
      <li><a href={navItem.link}> {navItem.name} </a></li>
    {/each}
  </ul>
</nav>
