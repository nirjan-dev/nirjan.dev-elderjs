<script lang="ts">
  import IoLogoCodepen from 'svelte-icons/io/IoLogoCodepen.svelte';
  import IoLogoTwitter from 'svelte-icons/io/IoLogoTwitter.svelte';
  import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
  import IoLogoInstagram from 'svelte-icons/io/IoLogoInstagram.svelte';
  import type { SocialMenuItems } from '../types/socialMenuItems';

  export let navItems: { name: string; link: string }[];
  export let socialMenuItems: SocialMenuItems;

  let isMenuOpen = false;

  const toggleMenu = () => (isMenuOpen = !isMenuOpen);
</script>

<style lang="scss">
  .main-nav {
    :global(&__list) {
      padding: 0;
      display: flex;
      list-style-type: none;
      align-items: center;
      margin: 0;
      justify-content: space-around;
    }

    :global(&__link),
    &__menu-btn {
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

    &__menu-btn {
      background-color: transparent;
      border: unset;
      cursor: pointer;
      display: none;

      &:hover,
      &:active,
      &:focus {
        color: var(--dark);
      }
    }

    @media (max-width: 560px) {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: var(--z-index-bottom-nav);
      background-color: var(--light);
      box-shadow: var(--box-shadow-bottom-nav);

      &__menu-btn {
        display: inline-block;
      }
    }

    &__sub-menu {
      list-style: none;
      justify-content: space-between;
      background: var(--light);
      margin: 0;
      padding: 0;
      position: fixed;
      bottom: 58px;
      left: 0;
      width: 100%;
      opacity: 0;
      pointer-events: none;
      transform: translateY(100%);
      transition: transform 0.2s ease-out, opacity 0.1s linear;
      display: flex;

      &.is-visible {
        transform: translateY(0);
        opacity: 1;
        pointer-events: initial;
      }
      &-link {
        padding: var(--spacing-1) var(--spacing-1);
        display: inline-block;
        font-size: var(--font-size-2);
        color: var(--dark);
      }
    }

    .icon {
      width: 1em;
      height: 1em;
      color: inherit;
      display: inline-block;
      & > :global(svg) {
        fill: currentColor;
      }
    }
  }

  .gg-menu {
    transform: scale(var(--ggs, 1));
  }
  .gg-menu,
  .gg-menu::after,
  .gg-menu::before {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 20px;
    height: 2px;
    border-radius: 3px;
    background: currentColor;
    transition: opacity 0.1s, transform 0.2s ease-out;
  }
  .gg-menu::after,
  .gg-menu::before {
    content: '';
    position: absolute;
    top: -6px;
  }
  .gg-menu::after {
    top: 6px;
  }

  .main-nav__menu-btn {
    &.is-active {
      .gg-menu::before {
        opacity: 0;
      }
      .gg-menu::after {
        transform: rotate(-90deg) translateX(6px);
      }

      .gg-menu {
        transform: rotate(44deg);
      }
    }
  }
</style>

<nav class="main-nav">
  <ul class="main-nav__list">
    {#each navItems as navItem}
      <li class="main-nav__item"><a class="main-nav__link" href={navItem.link}> {navItem.name} </a></li>
    {/each}

    <li>
      <button aria-hidden="true" class="main-nav__menu-btn" on:click={toggleMenu} class:is-active={isMenuOpen}>
        <i class="gg-menu" />
      </button>

      <ul class="main-nav__sub-menu" class:is-visible={isMenuOpen}>
        {#each socialMenuItems as socialMenuItem}
          <li class="main-nav__sub-menu-item">
            <a
              class="main-nav__sub-menu-link"
              title={socialMenuItem.title}
              href={socialMenuItem.link}
              rel="noopener noreferrer"
              target="_blank">
              <span class="icon" aria-hidden="true">
                {#if socialMenuItem.icon === 'IoLogoCodepen'}
                  <IoLogoCodepen />
                {:else if socialMenuItem.icon === 'IoLogoGithub'}
                  <IoLogoGithub />
                {:else if socialMenuItem.icon === 'IoLogoTwitter'}
                  <IoLogoTwitter />
                {:else if socialMenuItem.icon === 'IoLogoInstagram'}
                  <IoLogoInstagram />
                {/if}
              </span>
            </a>
          </li>
        {/each}
      </ul>
    </li>
  </ul>
</nav>
