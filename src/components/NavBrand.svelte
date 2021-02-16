<script lang="ts">
  export let helpers: {
    permalinks: {
      home: (options: { slug: string }) => string;
    };
  };
</script>

<style lang="scss">
  img {
    margin: 0.2rem;
    max-width: 100%;
    height: auto;
    padding: var(--spacing-1);
    max-height: 4.5rem;
    @media (max-width: 40em) {
      max-height: 3.5rem;
      padding: var(--spacing-0);
    }
  }
</style>

<a href={helpers.permalinks.home({ slug: '/' })}>
  <img width="205" height="70" src="/img/logo.svg" alt="Studio Dagger Logo" />
</a>
