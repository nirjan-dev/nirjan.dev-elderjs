<script lang="ts">
  import Banner from '../../components/Banner.svelte';
  import Container from '../../components/Container.svelte';

  import { DateFormatter } from '../../utils/dateFormatter';
  export let data: {
    posts: {
      slug: string;
      name: string;
      published_at: string;
      content: {
        excerpt: string;
      };
    }[];
  };
  export let helpers: {
    permalinks: {
      blog: ({ slug: string }) => string;
    };
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
      color: var(--extra-dark);
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

<Banner title="My Blog" />

<Container>
  <section class="posts">
    <ul class="posts__list">
      {#each data.posts as post}
        <li class="posts__list-item">
          <h3 class="posts__title">
            <a class="posts__link" href={helpers.permalinks.blog({ slug: post.slug })}>{post.name}</a>
          </h3>
          <p><small class="posts__date"> {DateFormatter(post.published_at)} </small></p>
          <p class="posts__excerpt">{post.content.excerpt}</p>
        </li>
      {/each}
    </ul>
  </section>
</Container>
