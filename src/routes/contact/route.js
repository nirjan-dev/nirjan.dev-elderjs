module.exports = {
  data: {},
  all: () => [{ slug: '/contact' }],
  permalink: ({ request }) => request.slug,
};
