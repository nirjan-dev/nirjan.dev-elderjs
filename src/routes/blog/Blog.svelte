<script lang="ts">
  import Banner from '../../components/Banner.svelte';
  import Container from '../../components/Container.svelte';
  import { DateFormatter } from '../../utils/dateFormatter';

  export let data; // data is mainly being populated from the /plugins/edlerjs-plugin-markdown/index.js
  const { html, frontmatter } = data;
</script>

<style lang="scss" global>
  .post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    a {
      text-decoration: underline;
    }
    * {
      margin-top: 0;
      margin-bottom: 0;
    }
    * + * {
      margin-top: var(--spacing-1);
    }
    img {
      margin: var(--spacing-2) auto;
    }
    blockquote {
      border-left: 8px solid var(--primary);
      padding: var(--spacing-0);
      background: var(--light);
    }

    pre {
      padding: var(--spacing-1);
      border-radius: 20px;
      overflow: auto;
    }
  }

  .share-links {
    margin: var(--spacing-1);
    &__list {
      list-style-type: none;
      padding: 0;
    }
  }
</style>

<Banner title={frontmatter.title} subtitle={`Last updated: ${DateFormatter(frontmatter.date)}`} />
<Container isNarrow={true}>
  <p class="lead">{frontmatter.excerpt}</p>
  <!-- <Img
  fluid={frontmatter.cover.childImageSharp.fluid}
  alt={frontmatter.title}
  css={theme => ({ margin: `${theme.spacing[2]} auto` })}
></Img> -->

  <article class="post">
  {@html html}
</article>

  <section class="share-links">
    <ul class="share-links__list">
      <li>
        <a
          href={`https://twitter.com/search?q=${encodeURIComponent('https://www.studiodagger.com/' + frontmatter.slug)}`}
          target="_blank"
          rel="noopener noreferrer">
          Discuss on Twitter
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=https://www.studiodagger.com/${frontmatter.slug}&text=${frontmatter.title} by @nk13_codes`}
          target="_blank"
          rel="noopener noreferrer">
          Share on Twitter
        </a>
      </li>
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://studiodagger.com/${frontmatter.slug}`}
          target="_blank"
          rel="noopener noreferrer">
          Share on Facebook
        </a>
      </li>
    </ul>
  </section>
</Container>
