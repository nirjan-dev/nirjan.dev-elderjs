<script lang="ts">
  import SubMenu from './SubMenu.svelte';
  import type { SocialMenuItems } from '../types/socialMenuItems';
  import IoMdHome from 'svelte-icons/io/IoMdHome.svelte';
  import IoIosBook from 'svelte-icons/io/IoIosBook.svelte';
  import MdEmail from 'svelte-icons/md/MdEmail.svelte';

  export let navItems: { name: string; link: string; icon: string }[];
  export let socialMenuItems: SocialMenuItems;
</script>

<style lang="scss">
  .main-nav {
    .icon {
      width: 2em;
      height: 2em;
      color: inherit;
      display: none;
      & > :global(svg) {
        fill: currentColor;
      }
    }
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

      .icon {
        display: inline-block;
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
      padding: var(--spacing-0) var(--spacing-2);
      min-width: 5rem;
      text-align: center;
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
      <li class="main-nav__item">
        <a class="main-nav__link" href={navItem.link}>
          <span class="icon" aria-hidden="true">
            {#if navItem.icon === 'IoMdHome'}
              <IoMdHome />
            {:else if navItem.icon === 'IoIosBook'}
              <IoIosBook />
            {:else if navItem.icon === 'MdEmail'}
              <MdEmail />
            {/if}
          </span>
          {navItem.name}
        </a>
      </li>
    {/each}

    <li class="main-nav__sub-menu">
      <SubMenu hydrate-client={{ socialMenuItems }} />
    </li>
  </ul>
</nav>
