<script>
import Header from "../components/Header.svelte";

  export let templateHtml,helpers;
</script>

<style>

</style>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&family=Merriweather:wght@900&display=swap" rel="stylesheet"> 
  <link rel="stylesheet" href="/style.css" />
</svelte:head>
<Header {helpers} />
<main>
  {@html templateHtml}
</main>
