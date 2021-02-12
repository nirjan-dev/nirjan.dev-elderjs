<script>
  import Footer from '../components/Footer.svelte';
  import Header from '../components/Header.svelte';

  export let templateHtml, helpers;
</script>

<style>
</style>

<svelte:head>
  <link rel="stylesheet" href="/prism/prism.css" />
  <script defer src="/lazysizes/lazysizes.min.js">
  </script>
  <script defer src="/lazysizes/ls.blur-up.min.js">
  </script>
  <script defer src="/lazysizes/ls.native-loading.min.js">
  </script>
  <script defer src="/prism/prism.js">
  </script>
  <link rel="stylesheet" href="/style.css" />
</svelte:head>
<Header {helpers} />
<main>
  {@html templateHtml}
</main>
<Footer />
