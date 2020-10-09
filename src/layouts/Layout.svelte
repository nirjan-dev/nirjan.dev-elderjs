<script>
  export let templateHtml, settings;
</script>

<style>
  :global(h1) {
    font-style: italic;
  }
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }

  :root {
    --balloon-color: #06395a;
    --balloon-font-size: 14px;
  }
</style>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&family=Merriweather:wght@900&display=swap" rel="stylesheet"> 
  <link rel="stylesheet" href="/style.css" />
</svelte:head>
<div class="container">
  {@html templateHtml}
</div>
