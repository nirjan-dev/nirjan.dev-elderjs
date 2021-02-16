<script>
  import Footer from '../components/Footer.svelte';
  import Header from '../components/Header.svelte';

  export let templateHtml, helpers;
</script>

<style>
</style>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#845ec2" />
  <meta name="msapplication-TileColor" content="#fbeaff" />
  <meta name="theme-color" content="#fbeaff" />
  <script defer src="/lazysizes/lazysizes.min.js">
  </script>
  <script defer src="/lazysizes/ls.blur-up.min.js">
  </script>
  <script defer src="/lazysizes/ls.native-loading.min.js">
  </script>
  <script defer src="/prism/prism.js">
  </script>
  <link rel="stylesheet" href="/style.css" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="/style.css" /></noscript>

  <link rel="stylesheet" href="/prism/prism.css" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="/prism/prism.css" /></noscript>
</svelte:head>
<Header {helpers} />
<main>
  {@html templateHtml}
</main>
<Footer />
