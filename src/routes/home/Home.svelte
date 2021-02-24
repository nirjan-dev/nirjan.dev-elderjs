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
      border-bottom: 3px solid var(--primary);
    }
    p {
      max-width: 60ch;
      margin: var(--spacing-1) 0;
    }
  }

  .contact-btn {
    background: var(--primary-gradient);
    border: none;
    padding: var(--spacing-0) var(--spacing-3);
    color: var(--light);
    border-radius: var(--border-radius-normal);
    box-shadow: 0px 4px 3px 0px rgba(50, 50, 50, 0.2);
    opacity: 0.9;
    transition: all 200ms cubic-bezier(0.08, 0.82, 0.17, 1);
    display: inline-block;
    &:hover,
    &:active,
    &:focus {
      box-shadow: 0px 5px 3px 0px rgba(50, 50, 50, 0.3);
      opacity: 1;
      transform: scale(1.025);
      color: var(--light);
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
        <h2>Hi, I'm Nirjan</h2>
        <p>
          I design and develop websites and applications that are blazing fast, user friendly, optimized and accessible
          to everyone. I also love sharing what I've learnt about web development and UI/UX design through my
          <a href="/blog">blog</a>,
          <a href="https://twitter.com/nk13_codes" target="_blank" rel="noopener noreferrer"> twitter </a>{' '}
          and{' '}
          <a href="https://instagram.com/nk13_codes" target="_blank" rel="noopener noreferrer"> instagram </a>
        </p>
        <p>If you need a developer who loves design, accessibility and performance then feel free to contact me.</p>
        <a class="contact-btn" href="/contact"> Get in touch </a>
      </Container>
    </div>
  </div>
</section>
