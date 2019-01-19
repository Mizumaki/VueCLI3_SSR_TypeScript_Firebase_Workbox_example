# SSR SPA sample using Vue.js with TypeScript and Firebase Hosting & Cloud Functions
This is a sample App built by Vue CLI3. You can run this app on both localhost and Web.

If you want to run this app in the real world, use Firebase. All settings is included in this sample.

The same app using Nuxt.js instead of Vue CLI3 is [here](https://github.com/Mizumaki/Nuxt_SSR_TypeScript_Firebase_Workbox_example).

## Usage
Install dependencies in root directory and functions directory:

```
// in root directory
yarn

// in funcitons directory
yarn
```

Build app:

```
yarn build
```

Run app in localhost:

```
yarn serve:pro

// now, app is served in http://localhost:8080
```

In fact, this sample doesn't provide dev server, because I can't do it.
If you have good answer for this issue, please pull request it!

### deploy to Firebase
First, build this app.

Second, following instruction in [Firebase Official page](https://firebase.google.com), set up the environments.

If you create project and [install and set up firebase cli](https://firebase.google.com/docs/cli), you are ready to deploy.

```
yarn deploy
```

## References
I use these example project as references. 
Thanks!

- [vue ssr guide](https://ssr.vuejs.org)
- [vue-cli-ssr-example](https://github.com/eddyerburgh/vue-cli-ssr-example)
- [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0)