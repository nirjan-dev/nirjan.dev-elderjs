<script lang="ts">
  import Container from './Container.svelte';
  import IoLogoCodepen from 'svelte-icons/io/IoLogoCodepen.svelte';
  import IoLogoTwitter from 'svelte-icons/io/IoLogoTwitter.svelte';
  import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
  import IoLogoInstagram from 'svelte-icons/io/IoLogoInstagram.svelte';
  import type { SocialMenuItems } from '../types/socialMenuItems';

  export let socialMenuItems: SocialMenuItems;
</script>

<style lang="scss">
  footer {
    background: var(--lighter);
    padding: 2rem 0rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--spacing-6);

    @media only screen and (max-width: 560px) {
      margin-top: var(--spacing-1);
    }

    @media (max-width: 560px) {
      ul {
        display: none;
      }
    }

    a {
      color: var(--dark);
      &:hover,
      &:active,
      &:focus {
        color: var(--secondary);
      }
    }
    @media (max-width: 630px) {
      padding: 1rem 0;
    }
    ul {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
      a {
        margin: 0 var(--spacing-1);
        font-size: var(--font-size-2);
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
</style>

<footer>
  <Container>
    <ul>
      {#each socialMenuItems as socialMenuItem}
        <li>
          <a title={socialMenuItem.title} href={socialMenuItem.link} rel="noopener noreferrer" target="_blank">
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
  </Container>
</footer>
