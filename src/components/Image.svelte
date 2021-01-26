<script lang="ts">
  import { getDimensions, getPaddingBottomValue } from '../utils/responsiveImageHelpers';
  export let src = '';
  export let JPEGSrcset = '';
  export let WebPSrcset = '';
  export let placeholder = '';
  export let alt = '';
  export let className = '';

  const dimensions = getDimensions(src);
  const pdBottomValue = getPaddingBottomValue(dimensions);
</script>

<style lang="scss">
  :global(.blur-up) {
    -webkit-filter: blur(5px);
    filter: blur(5px);
    transition: filter 400ms, -webkit-filter 400ms;
  }
  :global(.blur-up.lazyloaded) {
    -webkit-filter: blur(0);
    filter: blur(0);
  }
  :global(.ratio-container) {
    position: relative;
    &:after {
      content: '';
      display: block;
      height: 0;
      width: 100%;
      /* 16:9 = 56.25% = calc(9 / 16 * 100%) */
      padding-bottom: var(--padding-bottom, 56.25%);
      content: '';
    }
  }
  :global(.responsive-image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  /* unknown ration variation */
  :global(.unknown-ratio-container > *) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>

<div class="ratio-container unknown-ratio-container {className}" style="--padding-bottom: {pdBottomValue}">
  <picture>
    <source type="image/webp" data-srcset={WebPSrcset} />
    <source data-srcset={JPEGSrcset} />
    <img class="lazyload blur-up responsive-image" src={placeholder} data-src={src} {alt} />
  </picture>
</div>
