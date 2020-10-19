<script lang="ts">
  export let helpers;
</script>

<style lang="scss">
  img {
    margin: 0.2rem;
    max-height: 4.5rem;
    padding: var(--spacing-0);
    @media (max-width: 40em) {
      max-height: 3rem;
      padding: 0;
    }
  }
</style>

<a href={helpers.permalinks.home({slug: '/'})}>
  <img src="/img/logo.svg" alt="Studio Dagger Logo" />
</a>
