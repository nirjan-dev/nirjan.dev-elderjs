<script lang="ts">
  import Container from '../../components/Container.svelte';
  import NewsletterForm from '../../components/NewsletterForm.svelte';
  import Seo from '../../components/SEO.svelte';
  import type { SEOProps } from '../../types/seoProps';

  const seoProps: SEOProps = {};
</script>

<style lang="scss">
  .intro-banner {
    padding: var(--spacing-2) 0;
    display: flex;
    justify-content: center;
    align-items: center;

    :global(.container) {
      max-width: 70ch;
    }

    @media (max-width: 560px) {
      padding-top: 0;
    }
    a:not(.contact-btn) {
      border-bottom: 3px solid currentColor;
    }
    :global(&__sub-title, &__title) {
      max-width: 50ch;
      margin-bottom: var(--spacing-2);
      font-size: var(--font-size-2);
      color: var(--darker);
      font-weight: var(--regular-font-weight);
      font-family: var(--body-font-family);
      font-variation-settings: 'CASL' 0.4;
      line-height: var(--body-line-height);

      @media (max-width: 680px) {
        font-size: var(--font-size-2);
      }
    }

    :global(.newsletterform-component) {
      margin-top: var(--spacing-4);
    }

    &__title-intro {
      font-size: var(--font-size-6);
      display: block;
      color: var(--primary-dark);
      margin-bottom: var(--spacing-2);
      font-family: var(--heading-font-family);
      font-weight: var(--black-font-weight);
      font-variation-settings: 'CASL' 1;

      @media (max-width: 680px) {
        font-size: var(--font-size-4);
      }
    }
  }

  .contact-btn {
    background: var(--primary-gradient);
    border: none;
    padding: var(--spacing-0) var(--spacing-3);
    color: var(--lightest);
    border-radius: var(--border-radius-normal);
    box-shadow: var(--box-shadow-DEFAULT);
    transition: transform 200ms cubic-bezier(0.08, 0.82, 0.17, 1), box-shadow linear 150ms;
    display: inline-block;
    &:hover,
    &:active,
    &:focus {
      box-shadow: var(--box-shadow-lg);
      transform: scale(1.025) translateY(-2px);
      color: var(--lightest);
    }

    @media (prefers-color-scheme: dark) {
      color: var(--darkest);
      &:hover,
      &:active,
      &:focus {
        color: var(--darkest);
      }
    }
  }
</style>

<svelte:head>
  <Seo options={seoProps} />
</svelte:head>

<section>
  <div class="intro-banner">
    <div>
      <Container>
        <h1 class="intro-banner__title">
          <span class="intro-banner__title-intro">Hi, I'm Nirjan.</span>I make websites and apps that are blazing fast,
          user friendly, optimized and accessible to everyone. I specialize in modern JavaScript, CSS, HTML, Vue, Svelte
          and Node.js
        </h1>
        <h2 class="intro-banner__sub-title">
          I also love sharing what I've learnt about web development and UI/UX design through my
          <a href="/blog">blog</a>,
          <a href="https://twitter.com/nirjan_dev" target="_blank" rel="noopener noreferrer"> twitter </a>{' '}
          and{' '}
          <a href="https://instagram.com/nirjan.dev" target="_blank" rel="noopener noreferrer"> instagram </a>
        </h2>

        <NewsletterForm hydrate-client={{}} hydrate-options={{ preload: true, loading: 'eager' }} />
      </Container>
    </div>
  </div>
</section>
