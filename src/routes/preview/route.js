module.exports = {
  permalink: ({ request }) => `/preview/blog/${request.slug}/`,
  all: async ({ data }) => data.posts,
  data: async ({ request, data }) => {
    return {
      post: data.posts.find((post) => post.slug === request.slug),
    };
  },
};
