<script lang="ts">
  import Container from './Container.svelte';
  import IoLogoCodepen from 'svelte-icons/io/IoLogoCodepen.svelte';
  import IoLogoTwitter from 'svelte-icons/io/IoLogoTwitter.svelte';
  import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
  import IoLogoInstagram from 'svelte-icons/io/IoLogoInstagram.svelte';
</script>

<style lang="scss">
  footer {
    background: var(--lightest);
    padding: 2rem 0rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--spacing-6);

    @media only screen and (max-width: 540px) {
      margin-top: var(--spacing-1);
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
        font-weight: bold;
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
      <li>
        <a title="codepen profile" href="https://codepen.io/nirjan_dev" rel="noopener noreferrer" target="_blank">
          <span class="icon"><IoLogoCodepen aria-hidden="true" /></span>
        </a>
      </li>

      <li>
        <a title="twitter profile" href="https://twitter.com/nirjan_dev" rel="noopener noreferrer" target="_blank">
          <span class="icon"><IoLogoTwitter aria-hidden="true" /></span>
        </a>
      </li>
      <li>
        <a title="github profile" href="https://github.com/nirjan-dev" rel="noopener noreferrer" target="_blank">
          <span class="icon"><IoLogoGithub aria-hidden="true" /></span>
        </a>
      </li>
      <li>
        <a title="instagram profile" href="https://instagram.com/nirjan.dev" rel="noopener noreferrer" target="_blank">
          <span class="icon"><IoLogoInstagram aria-hidden="true" /></span>
        </a>
      </li>
    </ul>
  </Container>
</footer>
