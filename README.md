# Studiodagger

This is the personal site of Nirjan Khadka created using the project template for [Elder.js](https://elderguide.com/tech/elderjs/). You can view the live site [here](studiodagger.com). If you want you can use this project as a starting point for your own site but I would appreciate it if you gave me credit somewhere on the site but only if you want to.

### Install the dependencies:

```bash
yarn
```

### Start Project:

```bash
yarn start
```

Navigate to [localhost:3000](http://localhost:3000). You should see the site running.

### Development:

```bash
yarn dev
```
edit a component file in `src`, save it, and reload the page to see your changes.

### To Build HTML:

```bash
yarn build
```

This will build all of your html into the /public/ folder.

### What to Expect

- Nodemon is watching your files for changes. It will restart when it needs to.
- Rollup is watching your files for changes. It will restart when it needs to.
- If your `elder.config.js` has `@elderjs/plugin-browser-reload': {}` in it's plugins, your browser will automatically restart after the server restarts.
