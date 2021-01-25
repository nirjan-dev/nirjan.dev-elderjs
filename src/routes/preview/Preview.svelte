<script lang="ts">
  import BlogPage from '../../components/BlogPage.svelte';
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

<BlogPage hydrate-client={{ post, preview: true }} />
