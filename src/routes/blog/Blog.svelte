<script lang="ts">
  import Banner from '../../components/Banner.svelte';
  import Container from '../../components/Container.svelte';
  import { DateFormatter } from '../../utils/dateFormatter';
  import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.es';
  import Image from '../../components/Image.svelte';
  // const RichTextResolver = require('storyblok-js-client/dist/rich-text-resolver.cjs')
  import richTextSchema from '../../utils/richTextSchema';

  const resolver = new RichTextResolver(richTextSchema);

  export let data: {
    post: {
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
  };

  const { post } = data;
</script>

<style lang="scss" global>
  .post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

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
    img {
      margin: var(--spacing-2) auto;
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
  <Image
    hydrate-options={{ preload: true, loading: 'eager' }}
    hydrate-client={{ originalLink: post.content.cover.filename, alt: post.content.cover.alt }} />

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
