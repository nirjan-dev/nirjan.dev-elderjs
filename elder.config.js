module.exports = {
  origin: 'https://nirjan.dev',
  srcDir: 'src',
  distDir: 'public',
  rootDir: process.cwd(),
  build: {},
  server: {
    prefix: '',
  },
  debug: {
    stacks: false,
    hooks: false,
    performance: false,
    build: false,
    automagic: false,
  },
  hooks: {
    // disable: ['elderWriteHtmlFileToPublic'], // this is used to disable internal hooks. Uncommenting this would disabled writing your files on build.
  },
  plugins: {
    '@elderjs/plugin-browser-reload': {
      // this reloads your browser when nodemon restarts your server.
      port: 8080,
    },

    '@elderjs/plugin-sitemap': {
      origin: 'https://nirjan.dev', // the https://yourdomain.com
      exclude: ['preview'], // an array of permalinks or permalink prefixes. So you can do ['500'] and it will match /500**
      routeDetails: {}, // set custom priority and change freq if not it falls back to default
      lastUpdate: {
        blog: async ({ request }) => {
          return new Date(request.published_at);
        },
      }, // configurable last update for each route type.
    },
  },
  shortcodes: { closePattern: '}}', openPattern: '{{' },
};
