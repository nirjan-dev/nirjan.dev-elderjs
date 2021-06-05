<script lang="ts">
  import IoLogoCodepen from 'svelte-icons/io/IoLogoCodepen.svelte';
  import IoLogoTwitter from 'svelte-icons/io/IoLogoTwitter.svelte';
  import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
  import IoLogoInstagram from 'svelte-icons/io/IoLogoInstagram.svelte';
  import type { SocialMenuItems } from '../types/socialMenuItems';

  export let socialMenuItems: SocialMenuItems;

  let isMenuOpen = false;

  const toggleMenu = () => (isMenuOpen = !isMenuOpen);
</script>

<style lang="scss">
  .menu-btn {
    color: var(--dark);
    padding: var(--spacing-1) var(--spacing-2);
    min-width: 5rem;
    background-color: transparent;
    border: unset;
    cursor: pointer;
    display: none;

    @media (max-width: 560px) {
      display: inline-block;
    }
  }

  .sub-menu {
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
    &__link {
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

  .menu-btn {
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

<button tabindex="-1" aria-hidden="true" class="menu-btn" on:click={toggleMenu} class:is-active={isMenuOpen}>
  <i class="gg-menu" />
</button>

<ul class="sub-menu" class:is-visible={isMenuOpen}>
  {#each socialMenuItems as socialMenuItem}
    <li class="sub-menu__item">
      <a
        class="sub-menu__link"
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
