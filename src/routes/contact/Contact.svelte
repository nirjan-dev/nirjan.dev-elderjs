<script lang="ts">
  import Banner from '../../components/Banner.svelte';
  import ContactForm from '../../components/ContactForm.svelte';
  import Container from '../../components/Container.svelte';
  import Seo from '../../components/SEO.svelte';
  import type { SEOProps } from '../../types/seoProps';

  const seoProps: SEOProps = {
    title: `Contact | Nirjan Khadka's contact form`,
    description: `If you want to work with me then get in touch, I'm available for freelance work and have experience building frontend experiences consisting of a clean UI and a friendly UX with modern web technologies like JavaScript, CSS, HTML, Vue and Svelte`,
    pathname: '/contact',
  };
</script>

<svelte:head>
  <Seo options={seoProps} />
</svelte:head>

<Banner title="Get in touch" />

<Container />
<Container isNarrow={true}>
  <ContactForm hydrate-client={{}} hydrate-options={{ preload: true, loading: 'eager' }} />
</Container>
