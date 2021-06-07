module.exports = {
  origin: process.env.NODE_ENV === 'development' ? '' : 'https://nirjan.dev',
  srcDir: 'src',
  distDir: 'public',
  rootDir: process.cwd(),
  css: 'inline',
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
      port: 3001,
      delay: 1,
      origin: 'http://localhost',
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
    // 'elderjs-plugin-google-fonts': {
    //   fonts: {
    //     'Merriweather Sans': ['400', '700'],
    //     Merriweather: ['900'],
    //   },
    //   swap: true,
    // },
  },
  shortcodes: { closePattern: '}}', openPattern: '{{' },
};
