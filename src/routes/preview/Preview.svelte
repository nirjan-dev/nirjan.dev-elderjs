<script lang="ts">
  import BlogPage from '../../components/BlogPage.svelte';
  import type { Post } from '../../types/post';

  export let data: {
    post: Post;
  };
  const { post } = data;
</script>

<BlogPage hydrate-client={{ post, preview: true }} />
