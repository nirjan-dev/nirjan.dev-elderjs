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
  import slugify from 'slugify';

  const resolver = new RichTextResolver(richTextSchema);

  const componentsToLoad = [];
  const componentResolver = (component, blok) => {
    switch (component) {
      case 'quiz':
        componentsToLoad.push('quiz');
        return `<nk-quiz options='${JSON.stringify(blok.questions).replace(/[\/\(\)\']/g, '&apos;')}'></nk-quiz>
       
        `;
        break;
    }
  };

  resolver.addNode('blok', (node) => {
    let html = '';
    node.attrs.body.forEach((blok) => {
      html += componentResolver(blok.component, blok);
    });
    return {
      html: html,
    };
  });

  const generateTOC = (html) => {
    const content = (<any>post.content.body).content;

    let outputHTML = `<ul>`;

    content.forEach((node) => {
      if (node.type === 'heading' && node.attrs.level === 2) {
        outputHTML += `
          <li>
            <a href="#${slugify(node.content[0].text)}">${node.content[0].text}</a>  
          </li>
        `;
      }
    });

    outputHTML += `</ul>`;

    return outputHTML;
  };

  const loadScripts = () => {
    if (componentsToLoad.length > 0) {
      const scripts = [];
      componentsToLoad.forEach((component) => {
        scripts.push(`
        <script type="module" src="/web-components/${component}/dist/index.mjs">
          <script nomodule src="/web-components/${component}/dist/index.js">
        `);
      });
      return scripts.join(' ');
    } else {
      return '';
    }
  };

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
  let postBody;
  $: postBody = resolver.render(post.content.body);
</script>

<style lang="scss" global>
  .post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    h2 {
      font-size: var(--font-size-4);

      @media (max-width: 680px) {
        font-size: var(--font-size-3);
      }
    }

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

    @media (min-width: 480px) {
      * + * {
        margin-left: var(--spacing-0);
      }
    }
  }

  .social-btn {
    background: transparent;
    border: 3px solid;
    border-color: var(--dark);
    padding: var(--spacing-0) var(--spacing-1);
    display: inline-block;
    color: var(--extra-dark);
    border-radius: var(--border-radius-normal);
    margin-bottom: var(--spacing-0);
    opacity: 0.8;
    transition: opacity 0.2s;
    display: inline-flex;
    align-items: center;
    line-height: 0;

    @media (max-width: 480px) {
      display: flex;
      justify-content: center;
    }

    &:hover,
    &:focus,
    &:active {
      opacity: 1;
    }

    &--twitter {
      border-color: hsl(202.8, 80.1%, 53.1%);

      .icon {
        color: hsl(202.8, 80.1%, 53.1%);
      }
    }

    &--facebook {
      border-color: hsl(220, 40%, 44%);
      .icon {
        color: hsl(220, 40%, 44%);
      }
    }
    .icon {
      width: 1em;
      height: 1em;
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

  .post__wrapper {
    margin: 0 auto;
    max-width: 60ch;

    @media (max-width: 1660px) and (min-width: 641px) {
      margin-left: 26ch;
    }
  }

  .toc {
    position: sticky;
    top: 5%;
    float: left;
    padding: var(--spacing-0);

    a {
      display: block;
      color: var(--gray);
      transition: color 0.6s ease-in-out;
      max-width: 20ch;
      padding: var(--spacing-0);
      opacity: 0.8;
      transition: color 0.3s linear, opacity 0.3s linear;
    }

    .active a,
    a:hover {
      color: var(--primary-dark);
      opacity: 1;
    }

    .active a {
      font-weight: bold;
    }

    ul {
      margin-left: var(--spacing-0);
      transform-origin: 50% 0;
      padding-left: var(--spacing-0);
    }

    li {
      list-style: none;
      display: block;
    }

    .toc-button {
      width: 100%;
      padding: var(--spacing-0);
      background-color: var(--primary);
      color: var(--extra-light);
      display: none;
      border: none;
    }

    .toc-header {
      font-size: var(--font-size-2);
      text-align: center;
    }

    @media only screen and (max-width: 640px) {
      .toc-button {
        display: block;
      }

      .toc-header {
        display: none;
      }

      & {
        float: none;
        border-right: none;
        border-radius: var(--border-radius-normal);
        margin-bottom: var(--spacing-1);

        z-index: 1;
        top: 0%;
        // position: fixed;
        width: 100%;

        & > ul {
          background-color: var(--light);

          display: none;
          // transform: translateY(-110%);
          padding: var(--spacing-0);

          &.active {
            display: block;
          }
        }

        ul {
          margin-left: 0;
          padding-left: 0;
        }

        a {
          max-width: 100%;
        }
      }
    }
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
  <script>
    console.log(document);
    document.addEventListener('DOMContentLoaded', (event) => {
      const toc = document.querySelector('.toc > ul');

      if (toc) {
        toc.addEventListener('click', function () {
          this.classList.remove('active');
        });
      }

      const tocBtn = document.querySelector('.toc-button');

      if (tocBtn) {
        tocBtn.addEventListener('click', function () {
          document.querySelector('.toc > ul').classList.toggle('active');
        });
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          if (entry.intersectionRatio > 0) {
            document.querySelector(`.toc li a[href="#${id}"]`).parentElement.classList.add('active');
          } else {
            document.querySelector(`.toc li a[href="#${id}"]`).parentElement.classList.remove('active');
          }
        });
      });

      // Track all sections that have an `id` applied
      document.querySelectorAll('h2[id]').forEach((section) => {
        observer.observe(section);
      });
    });
  </script>
  {@html loadScripts()}
  <Seo options={seoProps} />
</svelte:head>

<Banner title={post.name} subtitle={`Last updated: ${DateFormatter(post.published_at)}`} />

<aside class="toc">
  <button class="toc-button">Toggle Table of Contents</button>
  <h2 class="toc-header">Table of Contents</h2>
  {@html generateTOC(postBody)}
</aside>

<Container>
  <div class="post__wrapper">
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
      {@html postBody}
    </article>
    <section class="share-links">
      <a
        class="social-btn social-btn--twitter"
        href={`https://twitter.com/intent/tweet?url=https://nirjan.dev/${post.slug}&text=${post.name} by @nirjan_dev`}
        aria-label="share on twitter"
        target="_blank"
        rel="noopener noreferrer">
        Share
        <span aria-hidden="true" class="icon"><IoLogoTwitter /></span>
      </a>
      <a
        class="social-btn social-btn--twitter"
        href={`https://twitter.com/search?q=${encodeURIComponent('https://nirjan.dev/' + post.slug)}`}
        target="_blank"
        aria-label="discuss on twitter"
        rel="noopener noreferrer">
        Discuss
        <span class="icon" aria-hidden="true"><IoLogoTwitter /></span>
      </a>
      <a
        class="social-btn social-btn--facebook"
        href={`https://facebook.com/sharer/sharer.php?u=https://nirjan.dev/${post.name}`}
        target="_blank"
        aria-label="share on facebook"
        rel="noopener noreferrer">
        Share
        <span aria-hidden="true" class="icon"><IoLogoFacebook /></span>
      </a>
    </section>
    <script
      src="https://utteranc.es/client.js"
      repo="nirjan-dev/site-comments"
      issue-term="pathname"
      theme="github-light"
      crossorigin="anonymous"
      async>
    </script>
  </div>
</Container>
