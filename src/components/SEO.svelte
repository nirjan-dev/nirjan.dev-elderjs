<script lang="ts">
  import type { SEOProps } from '../types/seoProps';

  export let options: SEOProps;

  const title = options.title ?? 'Nirjan Khadka | Web Developer and UI Designer';

  const description =
    options.description ??
    "I design and develop websites and applications that are blazing fast, user friendly, optimized and accessible to everyone. I also love sharing what I've learnt about web development and UI/UX. I specialize in modern JavaScript, CSS, HTML, Vue, Svelte and Node.js";

  const pathname = options.pathname ?? '';

  const url = `https://nirjan.dev${pathname}`;

  const image =
    options.image ??
    'https://a.storyblok.com/f/101845/1918x985/dd5d08d498/screenshot_2021-01-27-elder-js-template-home.png';

  const ogTitle = options.ogTitle ?? title;
  const ogDescription = options.ogDescription ?? description;
  const ogType = options.ogType ?? 'website';
  const ogImage = options.ogImage ?? image;

  const twitterUsername = 'nk13_codes';
  const twitterTitle = options.twitterTitle ?? title;
  const twitterDescription = options.twitterDescription ?? description;
  const twitterImage = options.twitterImage ?? image;

  const disableIndex = options.disableIndex ?? true;
</script>

<title>{title}</title>
<link rel="dns-prefetch" href="//fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />
<link
  href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700|Merriweather:900&display=swap"
  rel="stylesheet" />
<meta name="description" content={description} />
<meta name="image" content={image} />

<!-- OpenGraph   -->
<meta property="og:url" content={url} />
<meta property="og:type" content={ogType} />
<meta property="og:title" content={ogTitle} />
<meta property="og:description" content={ogDescription} />
<meta property="og:image" content={ogImage} />

<!-- Twitter Card  -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content={twitterUsername} />
<meta name="twitter:title" content={twitterTitle} />
<meta name="twitter:description" content={twitterDescription} />
<meta name="twitter:image" content={twitterImage} />

{#if disableIndex}
  <meta name="robots" content="noindex" />
  <meta name="bingbot" content="noindex" />
  <meta name="googlebot" content="noindex" />
{/if}
