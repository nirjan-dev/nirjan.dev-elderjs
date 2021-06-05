<script lang="ts">
  import SubMenu from './SubMenu.svelte';
  import type { SocialMenuItems } from '../types/socialMenuItems';

  export let navItems: { name: string; link: string }[];
  export let socialMenuItems: SocialMenuItems;
</script>

<style lang="scss">
  .main-nav {
    &__sub-menu {
      display: none;
    }
    @media (max-width: 560px) {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: var(--z-index-bottom-nav);
      background-color: var(--light);
      box-shadow: var(--box-shadow-bottom-nav);

      &__sub-menu {
        display: block;
      }
    }

    :global(&__list) {
      padding: 0;
      display: flex;
      list-style-type: none;
      align-items: center;
      margin: 0;
      justify-content: space-around;
    }

    :global(&__link) {
      color: var(--dark);
      transition: color 100ms linear;
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-2);
      min-width: 5rem;
      &:hover,
      &:active,
      &:focus {
        color: var(--secondary);
      }
    }
  }
</style>

<nav class="main-nav">
  <ul class="main-nav__list">
    {#each navItems as navItem}
      <li class="main-nav__item"><a class="main-nav__link" href={navItem.link}> {navItem.name} </a></li>
    {/each}

    <li class="main-nav__sub-menu">
      <SubMenu hydrate-client={{ socialMenuItems }} />
    </li>
  </ul>
</nav>
