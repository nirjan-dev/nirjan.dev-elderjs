<script lang="ts">
  export let isNarrow: boolean = false;
  export let isFlex: boolean = false;
</script>

<style lang="scss">
  .container {
    max-width: 95%;
    margin: 0 auto;
    padding: 0 1rem;

    &.narrow {
      width: 100%;
      max-width: 800px;
    }

    &.flex {
      display: flex;
    }
    @media (min-width: 90em) {
      max-width: 1600px;
      &.narrow {
        max-width: 960px;
      }
    }
  }
</style>

<div class="container" class:narrow={isNarrow} class:flex={isFlex}>
  <slot />
</div>
