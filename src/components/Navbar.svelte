<script lang="ts">
  import IoLogoCodepen from 'svelte-icons/io/IoLogoCodepen.svelte';
  import IoLogoTwitter from 'svelte-icons/io/IoLogoTwitter.svelte';
  import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
  import IoLogoInstagram from 'svelte-icons/io/IoLogoInstagram.svelte';
  import IoIosSunny from 'svelte-icons/io/IoIosSunny.svelte';
  export let navItems: { name: string; link: string }[];
  let isMenuOpen = false;

  const toggleMenu = () => (isMenuOpen = !isMenuOpen);
</script>

<style lang="scss">
  .main-nav {
    :global(&__list) {
      padding: 0;
      display: flex;
      list-style-type: none;
      justify-content: flex-end;
      align-items: center;
      margin: 0;
    }

    :global(&__link),
    &__menu-btn {
      color: var(--dark);
      transition: all 300ms ease-out;
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
      display: inline-block;
      background-color: transparent;
      border: none;
      color: var(--dark);
      cursor: pointer;
    }

    & {
      :global(&__list) {
        justify-content: space-between;
      }

      :global(&__link),
      &__menu-btn {
        padding: var(--spacing-1) var(--spacing-1);
        min-width: 2rem;
      }

      &__menu-btn {
        display: none;
      }

      @media (max-width: 560px) {
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 999;
        left: 0;
        background-color: var(--light);

        &__menu-btn {
          display: inline-block;
        }
      }
    }

    &__sub-menu {
      list-style: none;
      justify-content: space-between;
      background: var(--primary);
      margin: 0;
      padding: 0;
      position: fixed;
      bottom: 60px;
      z-index: 999;
      left: 0;
      width: 100%;
      opacity: 0;
      pointer-events: none;
      transform: translateY(100%);
      transition: transform 0.2s ease-out, opacity 0.1s linear;
      display: none;

      @media (max-width: 560px) {
        display: flex;
      }

      &.is-visible {
        transform: translateY(0);
        opacity: 1;
        pointer-events: initial;
      }
      &-link,
      &-button {
        font-weight: bold;
        padding: var(--spacing-1) var(--spacing-1);
        display: inline-block;
        font-size: var(--font-size-2);
        color: var(--dark);
      }

      &-button {
        background-color: var(--light);
        border: none;
        height: 100%;
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
        <li class="main-nav__sub-menu-item">
          <a
            class="main-nav__sub-menu-link"
            title="codepen profile"
            href="https://codepen.io/nirjan_dev"
            rel="noopener noreferrer"
            target="_blank">
            <span class="icon" aria-hidden="true"><IoLogoCodepen /></span>
          </a>
        </li>

        <li class="main-nav__sub-menu-item">
          <a
            class="main-nav__sub-menu-link"
            title="twitter profile"
            href="https://twitter.com/nirjan_dev"
            rel="noopener noreferrer"
            target="_blank">
            <span class="icon" aria-hidden="true"><IoLogoTwitter /></span>
          </a>
        </li>
        <li class="main-nav__sub-menu-item">
          <a
            class="main-nav__sub-menu-link"
            title="github profile"
            href="https://github.com/nirjan-dev"
            rel="noopener noreferrer"
            target="_blank">
            <span class="icon" aria-hidden="true"><IoLogoGithub /></span>
          </a>
        </li>
        <li class="main-nav__sub-menu-item">
          <a
            class="main-nav__sub-menu-link"
            title="instagram profile"
            href="https://instagram.com/nirjan.dev"
            rel="noopener noreferrer"
            target="_blank">
            <span class="icon" aria-hidden="true"><IoLogoInstagram /></span>
          </a>
        </li>

        <li class="main-nav__sub-menu-item">
          <button class="main-nav__sub-menu-button">
            <span class="icon" aria-hidden="true"><IoIosSunny /></span>
          </button>
        </li>
      </ul>
    </li>
  </ul>
</nav>
