<script lang="ts">
  import Banner from '../../components/Banner.svelte';
  import ContactForm from '../../components/ContactForm.svelte';
  import Container from '../../components/Container.svelte';
</script>

<Banner title="Get in touch" />

<Container />
<Container isNarrow={true}>
  <ContactForm  hydrate-client={{}} hydrate-options={{ preload: true, loading: 'eager' }} />
</Container>
