<script lang="ts">
  import Container from '../../components/Container.svelte';
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
    a:not(.contact-btn) {
      border-bottom: 3px solid currentColor;
    }
    p {
      max-width: 60ch;
      margin: var(--spacing-1) 0;
    }

    &__title {
      font-size: var(--font-size-5);

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
        <h1 class="intro-banner__title">Hi, I'm Nirjan</h1>
        <p>
          I design and develop websites and applications that are blazing fast, user friendly, optimized and accessible
          to everyone. I also love sharing what I've learnt about web development and UI/UX design through my
          <a href="/blog">blog</a>,
          <a href="https://twitter.com/nirjan_dev" target="_blank" rel="noopener noreferrer"> twitter </a>{' '}
          and{' '}
          <a href="https://instagram.com/nirjan.dev" target="_blank" rel="noopener noreferrer"> instagram </a>
        </p>
        <p>If you need a developer who loves design, accessibility and performance then feel free to contact me.</p>
        <a class="contact-btn" href="/contact"> Get in touch </a>
      </Container>
    </div>
  </div>
</section>
