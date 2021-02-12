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
    'elderjs-plugin-google-fonts': {
      fonts: {
        'Merriweather Sans': ['400', '700'],
        Merriweather: ['900'],
      },
      swap: true,
    },
    '@elderjs/plugin-critical-path-css': {
      rebuild: false, // set to true to rebuild the critical path css on next build. NOTE: completely overwrites allRequests.
      folder: `./src/assets/critical/`, // relative to root of the project.
      requests: false, // used to specify the specific requests you want used for critical path css generation.
      disable: false, // if for some reason you don't want the critical path css added when the file exists. Also disables building.
      critical: {
        // settings here: https://github.com/addyosmani/critical
        penthouse: {
          forceInclude: [], // you can force include styles here '.btn' for example
          keepLargerMediaQueries: true,
        },
        dimensions: [
          {
            height: 500,
            width: 300,
          },
          {
            height: 900,
            width: 1280,
          },
        ],
      },
    },
  },
  shortcodes: { closePattern: '}}', openPattern: '{{' },
};
