const { getImages, getJPEGSrcset, getWebPSrcset, sizes } = require('./responsiveImageHelpers');

const getResponsiveImage = function (node) {
  const originalLink = node.attrs.src;
  const { JPEGImages, webPImages, placeholder } = getImages(originalLink, sizes);
  return {
    tag: [
      {
        tag: 'div',
        attrs: {
          class: 'ratio-container unknown-ratio-container',
        },
      },
      {
        tag: 'picture',
      },
      {
        tag: 'source',
        attrs: {
          type: 'image/webp',
          'data-srcset': `${getWebPSrcset(webPImages, sizes)}`,
        },
      },
      {
        tag: 'source',
        attrs: {
          'data-srcset': `${getJPEGSrcset(JPEGImages, sizes)}`,
        },
      },
      {
        tag: 'img',
        attrs: {
          src: placeholder,
          alt: node.attrs.alt,
          class: 'lazyload blur-up responsive-image',
          'data-src': `${JPEGImages[JPEGImages.length - 1]}`,
        },
      },
    ],
  };
};

const isEmailLinkType = (type) => type === 'email';

module.exports = {
  nodes: {
    horizontal_rule(node) {
      return {
        singleTag: 'hr',
      };
    },
    blockquote(node) {
      return {
        tag: 'blockquote',
      };
    },
    bullet_list(node) {
      return {
        tag: 'ul',
      };
    },
    code_block(node) {
      return {
        tag: [
          'pre',
          {
            tag: 'code',
            attrs: {
              ...node.attrs,
            },
          },
        ],
      };
    },
    hard_break(node) {
      return {
        singleTag: 'br',
      };
    },
    heading(node) {
      return {
        tag: `h${node.attrs.level}`,
      };
    },
    image(node) {
      return getResponsiveImage(node);
    },
    list_item(node) {
      return {
        tag: 'li',
      };
    },
    ordered_list(node) {
      return {
        tag: 'ol',
      };
    },
    paragraph(node) {
      return {
        tag: 'p',
      };
    },
  },
  marks: {
    bold() {
      return {
        tag: 'b',
      };
    },
    strike() {
      return {
        tag: 'strike',
      };
    },
    underline() {
      return {
        tag: 'u',
      };
    },
    strong() {
      return {
        tag: 'strong',
      };
    },
    code() {
      return {
        tag: 'code',
      };
    },
    italic() {
      return {
        tag: 'i',
      };
    },
    link(node) {
      const attrs = { ...node.attrs };
      const { linktype = 'url' } = node.attrs;

      if (isEmailLinkType(linktype)) {
        attrs.href = `mailto:${attrs.href}`;
      }

      if (attrs.anchor) {
        attrs.href = `${attrs.href}#${attrs.anchor}`;
        delete attrs.anchor;
      }

      return {
        tag: [
          {
            tag: 'a',
            attrs: attrs,
          },
        ],
      };
    },
    styled(node) {
      return {
        tag: [
          {
            tag: 'span',
            attrs: node.attrs,
          },
        ],
      };
    },
  },
};
