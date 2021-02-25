<script lang="ts">
  import Banner from './Banner.svelte';
  import Container from './Container.svelte';
  import { DateFormatter } from '../utils/dateFormatter';
  import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.es';
  import Image from './Image.svelte';
  import richTextSchema from '../utils/richTextSchema';
  import { getImages, getJPEGSrcset, getWebPSrcset, sizes } from '../utils/responsiveImageHelpers';
  import { onMount, tick } from 'svelte';
  import type { Post } from '../types/post';
  import type { SEOProps } from '../types/seoProps';
  import Seo from './SEO.svelte';
  import IoLogoTwitter from 'svelte-icons/io/IoLogoTwitter.svelte';
  import IoLogoFacebook from 'svelte-icons/io/IoLogoFacebook.svelte';

  const resolver = new RichTextResolver(richTextSchema);
  export let preview = false;
  export let post: Post;
  // cover image stuff
  let coverImage:
    | undefined
    | {
        originalLink?: string;
        JPEGSrcset?: string;
        WebPSrcset?: string;
        src?: string;
        alt?: string;
        placeholder?: string;
      };
  if (post.content.cover.filename) {
    coverImage = {};
    coverImage.originalLink = post.content.cover.filename;
    const { JPEGImages, webPImages, placeholder } = getImages(coverImage.originalLink, sizes);
    coverImage.JPEGSrcset = getJPEGSrcset(JPEGImages, sizes);
    coverImage.WebPSrcset = getWebPSrcset(webPImages, sizes);
    coverImage.src = JPEGImages[JPEGImages.length - 1];
    coverImage.alt = post.content.cover.alt;
    coverImage.placeholder = placeholder;
  }

  // live preview stuff
  onMount(() => {
    if (preview === true) {
      Prism.highlightAll();

      const storyblokBridge = document.createElement('script');
      const token = 'IOjlPrsDjUHGJbuooR5TQQtt';
      storyblokBridge.src = `//app.storyblok.com/f/storyblok-latest.js?t=${token}`;
      storyblokBridge.onload = () => {
        window.storyblok.init({
          accessToken: token,
        });
        window.storyblok.pingEditor(() => {
          if (window.storyblok.isInEditor) {
            window.storyblok.enterEditmode();
          }
        });
        window.storyblok.on(['input'], (payload) => {
          post = payload.story;
          tick().then(() => Prism.highlightAll());
        });
      };
      document.head.append(storyblokBridge);
    }
  });

  const { seo } = post.content;
  const seoProps: SEOProps = {
    title: seo.title || post.name,
    description: seo.description || post.content.excerpt,
    pathname: `/${post.slug}`,
    image: post.content.cover.filename,

    ogTitle: seo.og_title || post.name,
    ogImage: seo.og_image || post.content.cover.filename,
    ogDescription: seo.og_description || post.content.excerpt,
    ogType: 'article',

    twitterTitle: seo.twitter_title || post.name,
    twitterDescription: seo.twitter_description || post.content.excerpt,
    twitterImage: seo.twitter_image || post.content.cover.filename,

    disableIndex: preview,
    dateModified: post.published_at,
    datePublished: post.first_published_at,
    keywords: post.tag_list.join(','),
  };
</script>

<style lang="scss" global>
  .post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    &__cover-img {
      margin: var(--spacing-2) 0;
    }
    a {
      text-decoration: underline;
    }
    * {
      margin-top: 0;
      margin-bottom: 0;
    }
    * + * {
      margin-top: var(--spacing-1);
    }

    blockquote {
      border-left: 8px solid var(--primary);
      padding: var(--spacing-0);
      background: var(--light);
    }
    pre {
      padding: var(--spacing-1);
      border-radius: 10px;
      overflow: auto;
    }
    // prismjs overides
    .toolbar-item + .toolbar-item {
      margin-left: var(--spacing-0);
    }
    .toolbar-item:last-child {
      margin-right: var(--spacing-0);
    }
    div.code-toolbar > .toolbar a,
    div.code-toolbar > .toolbar button,
    div.code-toolbar > .toolbar span {
      padding: var(--spacing-0);
      border-radius: 10px;
      &:hover,
      &:focus {
        color: var(--extra-light);
      }
    }
    div.code-toolbar > .toolbar button {
      background: var(--secondary);
      color: var(--extra-light);
      cursor: pointer;
      transition: 200ms linear background-color;
      &:hover,
      &:focus {
        background-color: var(--primary);
      }
    }
  }
  .share-links {
    margin: var(--spacing-1) 0;
    &__list {
      list-style-type: none;
      padding: 0;
      display: flex;

      * + * {
        margin-left: var(--spacing-0);
      }
    }
  }

  .social-btn {
    background: var(--dark);
    padding: var(--spacing-0) var(--spacing-1);
    display: inline-block;
    color: var(--extra-light);
    border-radius: var(--border-radius-normal);
    margin-bottom: var(--spacing-0);
    opacity: 0.8;
    transition: opacity 0.2s;
    display: inline-flex;
    align-items: center;
    line-height: 0;

    &:hover,
    &:focus,
    &:active {
      color: var(--extra-light);
      opacity: 1;
    }

    &--twitter {
      background: #1da1f2;
    }

    &--facebook {
      background: #43609c;
    }
    .icon {
      width: 1em;
      height: 1em;
      color: inherit;
      display: inline-block;
      margin-left: 0.2em;
      & > :global(svg) {
        fill: currentColor;
      }
    }
  }
  .utterances {
    max-width: 100%;
  }
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
  <Seo options={seoProps} />
</svelte:head>

<Banner title={post.name} subtitle={`Last updated: ${DateFormatter(post.published_at)}`} />
<Container isNarrow={true}>
  <p class="lead">{post.content.excerpt}</p>

  {#if coverImage}
    <!-- content here -->
    <Image
      className="post__cover-img"
      JPEGSrcset={coverImage.JPEGSrcset}
      placeholder={coverImage.placeholder}
      alt={coverImage.alt}
      src={coverImage.src}
      WebPSrcset={coverImage.WebPSrcset} />
  {/if}

  <article class="post">
    {@html resolver.render(post.content.body)}
  </article>

  <section class="share-links">
    <ul class="share-links__list">
      <li>
        <a
          class="social-btn social-btn--twitter"
          href={`https://twitter.com/intent/tweet?url=https://nirjan.dev/${post.slug}&text=${post.name} by @nirjan_dev`}
          aria-label="share on twitter"
          target="_blank"
          rel="noopener noreferrer">
          Share
          <span class="icon"><IoLogoTwitter aria-hidden="true" /></span>
        </a>
      </li>
      <li>
        <a
          class="social-btn social-btn--twitter"
          href={`https://twitter.com/search?q=${encodeURIComponent('https://nirjan.dev/' + post.slug)}`}
          target="_blank"
          aria-label="discuss on twitter"
          rel="noopener noreferrer">
          Discuss
          <span class="icon"><IoLogoTwitter aria-hidden="true" /></span>
        </a>
      </li>
      <li>
        <a
          class="social-btn social-btn--facebook"
          href={`https://facebook.com/sharer/sharer.php?u=https://nirjan.dev/${post.name}`}
          target="_blank"
          aria-label="share on facebook"
          rel="noopener noreferrer">
          Share
          <span class="icon"><IoLogoFacebook aria-hidden="true" /></span>
        </a>
      </li>
    </ul>
  </section>
  <script
    src="https://utteranc.es/client.js"
    repo="nirjan-dev/site-comments"
    issue-term="pathname"
    theme="github-light"
    crossorigin="anonymous"
    async>
  </script>
</Container>
