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
  <link
    rel="preload"
    href="/u-4n0qyriQwlOrhSvowK_l52_wFZWMf6.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous" />
  <link
    rel="preload"
    href="/2-cO9IRs1JiJN1FRAMjTN5zd9vgsFF_5asQTb6hZ2JKZou4ViesH.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous" />
  <link
    rel="preload"
    href="/2-cO9IRs1JiJN1FRAMjTN5zd9vgsFF_5asQTb6hZ2JKZRekViesH.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous" />

  <link rel="stylesheet" href="/style.css" />
</svelte:head>
<Header {helpers} />
<main>
  {@html templateHtml}
</main>
<Footer />
