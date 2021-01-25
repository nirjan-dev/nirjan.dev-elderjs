<script lang="ts">
  import Banner from './Banner.svelte';
  import Container from './Container.svelte';
  import { DateFormatter } from '../utils/dateFormatter';
  import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.es';
  import Image from './Image.svelte';
  import richTextSchema from '../utils/richTextSchema';
  import { getImages, getJPEGSrcset, getWebPSrcset, sizes } from '../utils/responsiveImageHelpers';
  import { onMount } from 'svelte';
  const resolver = new RichTextResolver(richTextSchema);
  export let preview = false;
  export let post: {
    slug: string;
    name: string;
    published_at: string;
    content: {
      excerpt: string;
      body: string;
      cover: {
        alt: string;
        filename: string;
      };
    };
  };
  // cover image stuff
  const originalLink = post.content.cover.filename;
  const { JPEGImages, webPImages, placeholder } = getImages(originalLink, sizes);
  const JPEGSrcset = getJPEGSrcset(JPEGImages, sizes);
  const WebPSrcset = getWebPSrcset(webPImages, sizes);
  const src = JPEGImages[JPEGImages.length - 1];
  const alt = post.content.cover.alt;
  // live preview stuff
  onMount(() => {
    if (preview === true) {
      const storyblokBridge = document.createElement('script');
      const token = 'IOjlPrsDjUHGJbuooR5TQQtt';
      storyblokBridge.src = `//app.storyblok.com/f/storyblok-latest.js?t=${token}`;
      console.log('in preview mode');
      storyblokBridge.onload = () => {
        console.log('loaded bridge');
        window.storyblok.init({
          accessToken: token,
        });
        window.storyblok.pingEditor(() => {
          if (window.storyblok.isInEditor) {
            window.storyblok.enterEditmode();
          }
        });
        window.storyblok.on(['input'], (payload) => {
          console.log('changed sometrhing');
          post = payload.story;
        });
      };
      document.head.append(storyblokBridge);
    }
  });
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
    margin: var(--spacing-1);
    &__list {
      list-style-type: none;
      padding: 0;
    }
  }
</style>

<Banner title={post.name} subtitle={`Last updated: ${DateFormatter(post.published_at)}`} />
<Container isNarrow={true}>
  <Image className="post__cover-img" {JPEGSrcset} {placeholder} {alt} {src} {WebPSrcset} />

  <article class="post">
    {@html resolver.render(post.content.body)}
  </article>

  <section class="share-links">
    <ul class="share-links__list">
      <li>
        <a
          href={`https://twitter.com/search?q=${encodeURIComponent('https://www.studiodagger.com/' + post.slug)}`}
          target="_blank"
          rel="noopener noreferrer">
          Discuss on Twitter
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=https://www.studiodagger.com/${post.slug}&text=${post.name} by @nk13_codes`}
          target="_blank"
          rel="noopener noreferrer">
          Share on Twitter
        </a>
      </li>
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://studiodagger.com/${post.name}`}
          target="_blank"
          rel="noopener noreferrer">
          Share on Facebook
        </a>
      </li>
    </ul>
  </section>
</Container>
