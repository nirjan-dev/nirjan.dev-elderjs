<script lang="ts">
  import { getImages, getJPEGSrcset, getWebPSrcset, sizes } from '../utils/responsiveImageHelpers';
  // function that takes in the original img url and generates different sized images
  export let originalLink = '';
  export let alt = '';

  const { JPEGImages, webPImages, placeholder } = getImages(originalLink, sizes);
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
      padding-bottom: 56.25%;
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

<div class="ratio-container unknown-ratio-container">
  <picture>
    <source type="image/webp" data-srcset={getWebPSrcset(webPImages, sizes)} />
    <source data-srcset={getJPEGSrcset(JPEGImages, sizes)} />
    <img
      class="lazyload blur-up responsive-image"
      src={placeholder}
      data-src={JPEGImages[JPEGImages.length - 1]}
      {alt} />
  </picture>
</div>
