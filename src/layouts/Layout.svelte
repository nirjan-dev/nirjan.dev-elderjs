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
  <link rel="stylesheet" href="/prismjs/prism.css" />
  <script defer src="/lazysizes/lazysizes.min.js">
  </script>
  <script defer src="/lazysizes/ls.blur-up.min.js">
  </script>
  <script defer src="/lazysizes/ls.native-loading.min.js">
  </script>
  <script defer src="/prismjs/prism.js">
  </script>
  <link rel="preload" href="/web-components/dist/index.js" as="script" />
  <script src="/web-components/dist/index.js">
  </script>
</svelte:head>
<Header {helpers} />
<main>
  {@html templateHtml}
</main>
<Footer />
