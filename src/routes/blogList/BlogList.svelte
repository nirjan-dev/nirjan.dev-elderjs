<script lang="ts">
  import Banner from '../../components/Banner.svelte';
  import Container from '../../components/Container.svelte';
  import Seo from '../../components/SEO.svelte';
  import type { Post } from '../../types/post';
  import type { SEOProps } from '../../types/seoProps';

  import { DateFormatter } from '../../utils/dateFormatter';
  export let data: {
    posts: Post[];
  };
  export let helpers: {
    permalinks: {
      blog: ({ slug: string }) => string;
    };
  };

  let { posts } = data;

  posts = posts.filter((post) => !post.content.draft);

  const seoProps: SEOProps = {
    title: `Blog | Nirjan Khadka's web dev blog`,
    description:
      'I write about different web technologies like HTML, CSS, JavaScript, Svelte, Vue, Storybook, Node.js, SVG, WebGL, web animation and best coding practices',
    pathname: '/blog',
  };
</script>

<style lang="scss">
  .posts {
    max-width: 60ch;
    margin: 0 auto;
    &__list {
      list-style-type: none;
      padding: 0;
    }
    &__list-item {
      margin: 2rem 0;
    }
    &__title {
      max-width: 25ch;
      transition: color 200ms ease-in;
      color: var(--primary-dark);

      font-size: var(--font-size-4);

      @media (prefers-color-scheme: dark) {
        color: var(--primary-light);
      }

      @media (max-width: 680px) {
        font-size: var(--font-size-3);
      }
      &:hover,
      &:active,
      &:focus {
        color: var(--secondary);
      }
    }
    &__link {
      color: inherit;
    }
    &__date {
      color: var(--dark);
      margin: var(--spacing-0) 0;
      display: block;
    }
  }
</style>

<svelte:head>
  <Seo options={seoProps} />
</svelte:head>

<Banner title="My Blog" />

<Container>
  <section class="posts">
    <ul class="posts__list">
      {#each posts as post}
        <li class="posts__list-item">
          <h2 class="posts__title">
            <a class="posts__link" href={helpers.permalinks.blog({ slug: post.slug })}>{post.name}</a>
          </h2>
          <p><small class="posts__date"> {DateFormatter(post.first_published_at)} </small></p>
          <p class="posts__excerpt">{post.content.excerpt}</p>
        </li>
      {/each}
    </ul>
  </section>
</Container>
