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

  const disableIndex = options.disableIndex ?? false;

  const jsonLd = (content) => `<${'script'} type="application/ld+json">${JSON.stringify(content)}</${'script'}>`;

  const jsonLdGraph: any[] = [
    {
      '@context': 'http://www.schema.org',
      '@type': 'person',
      name: 'Nirjan Khadka',
      jobTitle: 'developer',
      gender: 'male',
      url: 'https://nirjan.dev',
      sameAs: [
        'https://www.instagram.com/nirjan.dev',
        'https://www.linkedin.com/nirjankhadka',
        'https://twitter.com/nirjan.dev',
        'https://codepen.io/nk13_codes',
        'https://github.com/NK-WebDev',
      ],
      image: 'https://a.storyblok.com/f/101845/400x400/8bf3a1d122/6kqa90du_400x400.jpg',
      email: 'hi@nirjan.dev',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nirjan.dev/#website',
      url: 'https://nirjan.dev/',
      name: 'nirjan.dev',
      description: `I design and develop websites and applications that are blazing fast, user friendly, optimized and accessible to everyone. I also love sharing what I've learnt about web development and UI/UX. I specialize in modern JavaScript, CSS, HTML, Vue, Svelte and Node.js`,
      publisher: {
        '@id': 'https://nirjan.dev/#person',
      },
      inLanguage: 'en-US',
    },

    {
      '@type': 'WebPage',
      '@id': 'https://nirjan.dev' + pathname + '#webpage',
      url: 'https://nirjan.dev' + pathname,
      name: title,
      isPartOf: {
        '@id': 'https://nirjan.dev/#website',
      },
      inLanguage: 'en-US',
      description: description,
    },
  ];

  if (options.ogType === 'article') {
    jsonLdGraph[2]['potentialAction'] = [
      {
        '@type': 'ReadAction',
        target: ['https://nirjan.dev' + pathname],
      },
    ];

    jsonLdGraph[2]['primaryImageOfPage'] = {
      '@id': 'https://nirjan.dev' + pathname + '#primaryimage',
    };
    jsonLdGraph.push({
      '@type': 'ImageObject',
      '@id': 'https://nirjan.dev' + pathname + '#primaryimage',
      inLanguage: 'en-US',
      url: image,
      width: 700,
      height: 394,
      caption: title,
    });

    jsonLdGraph.push({
      '@type': 'Article',
      '@id': 'https://nirjan.dev' + pathname + '#article',
      isPartOf: {
        '@id': 'https://nirjan.dev' + pathname + '#webpage',
      },
      author: {
        '@id': 'https://nirjan.dev' + pathname + '#person',
      },
      headline: title,
      datePublished: options.datePublished,
      dateModified: options.dateModified,
      commentCount: 0,
      mainEntityOfPage: {
        '@id': 'https://nirjan.dev' + pathname + '#webpage',
      },
      publisher: {
        '@id': 'https://nirjan.dev/#organization',
      },
      image: {
        '@id': 'https://nirjan.dev' + pathname + '#primaryimage',
      },
      keywords: options.keywords,
      inLanguage: 'en-US',
    });
  }
</script>

<title>{title}</title>
<meta name="description" content={description} />
<meta name="image" content={image} />
<link rel="”canonical”" href={url} />

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

{@html jsonLd({ '@context': 'http://schema.org', '@graph': jsonLdGraph })}
