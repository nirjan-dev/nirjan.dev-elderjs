<script lang="ts">
  export let helpers;
</script>

<style lang="scss">
  img {
    margin: 0.2rem;
    max-width: 100%;
    height: auto;
    padding: var(--spacing-0);
    @media (max-width: 40em) {
      padding: 0;
    }
  }
</style>

<a href={helpers.permalinks.home({slug: '/'})}>
  <img width="205" height="70" src="/img/logo.svg" alt="Studio Dagger Logo" />
</a>
