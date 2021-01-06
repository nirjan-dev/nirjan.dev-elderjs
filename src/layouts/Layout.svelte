<script>
  import Footer from '../components/Footer.svelte';
  import Header from '../components/Header.svelte';

  export let templateHtml, helpers;
</script>

<style>
</style>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&family=Merriweather:wght@900&display=swap"
    rel="stylesheet" />
  <link rel="stylesheet" href="/style.css" />
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js">
  </script>
</svelte:head>
<Header {helpers} />
<main>
  {@html templateHtml}
</main>
<Footer />
