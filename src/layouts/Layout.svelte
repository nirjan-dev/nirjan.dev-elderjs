<script>
  import Footer from '../components/Footer.svelte';
  import Header from '../components/Header.svelte';

  export let templateHtml, helpers;

  const socialMenuItems = [
    {
      title: 'codepen profile',
      link: 'https://codepen.io/nirjan_dev',
      icon: 'IoLogoCodepen',
    },
    {
      title: 'twitter profile',
      link: 'https://twitter.com/nirjan_dev',
      icon: 'IoLogoTwitter',
    },
    {
      title: 'github profile',
      link: 'https://github.com/nirjan-dev',
      icon: 'IoLogoGithub',
    },
    {
      title: 'instagram profile',
      link: 'https://instagram.com/nirjan.dev',
      icon: 'IoLogoInstagram',
    },
  ];
</script>

<style lang="scss">
  .skip-link {
    position: absolute;
    top: 1rem;
    left: -9999rem;

    &:focus {
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#845ec2" />
  <meta name="msapplication-TileColor" content="#fbeaff" />
  <meta name="theme-color" content="#fbeaff" />
  <!-- <link
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
    crossorigin="anonymous" /> -->

  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Recursive:wght,CASL@300..800,0..1&display=swap"
    rel="stylesheet" />

  <link rel="stylesheet" href="/style.css" />
  <!-- Panelbear Analytics - We respect your privacy -->
  <script async src="https://cdn.panelbear.com/analytics.js?site=ByU4h80Ugbv">
  </script>
  <script>
    window.panelbear =
      window.panelbear ||
      function () {
        (window.panelbear.q = window.panelbear.q || []).push(arguments);
      };
    panelbear('config', { site: 'ByU4h80Ugbv' });
  </script>
</svelte:head>

<a href="#content" class="skip-link"> Skip to main content </a>

<Header {helpers} {socialMenuItems} />
<main id="content" tabindex="-1">
  {@html templateHtml}
</main>
<Footer {socialMenuItems} />
