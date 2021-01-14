module.exports = {
  origin: '', // TODO: update this.
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
    // '@elderjs/plugin-markdown': {
    //   routes: ['blog'],
    //   useSyntaxHighlighting: {
    //     theme: 'material-theme-darker', // available themes: https://github.com/shikijs/shiki/blob/master/packages/themes/README.md#literal-values - try material-theme-darker
    //     // theme is the only option available - for now.
    //   },
    // },
    '@elderjs/plugin-browser-reload': {
      // this reloads your browser when nodemon restarts your server.
      port: 8080,
    },
    // '@elderjs/plugin-images': {
    //   folders: [
    //     {
    //       src: '/assets/img/*',
    //       output: '/img/',
    //     },
    //   ],
    //   imageManifest: '/assets/img/ejs-image-manifest.json', // relative to root dir
    //   cacheFolder: '/assets/img/sizes/', // relative to root dir
    // },
  },
  shortcodes: { closePattern: '}}', openPattern: '{{' },
};
