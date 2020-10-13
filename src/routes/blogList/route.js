module.exports = {
  data: {},
  all: () => [
    {
      slug: 'blog',
    },
  ],
  permalink: ({ request }) => `/${request.slug}/`,
};
