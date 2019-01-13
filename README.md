# SSR SPA sample using Vue.js with TypeScript and Firebase Hosting & Cloud Functions
This is a sample App built by Vue CLI3. You can run this app on both localhost and Web.

If you want to run this app in the real world, use Firebase. All settings is included in this sample.

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




# firebase settings
firebase.jsonのfunctions sourceにて、functionsディレクトリを明示（これはデフォルトなので、書かなくてもよい）
https://firebase.google.com/docs/functions/manage-functions?hl=ja#deploy_functions

hostingのpublicにて、dist/appを指定

functionsフォルダ内のpackage.jsonのmainにて、ソースコードの場所を指定（jsにコンパイル済みのものの場所

https://cloud.google.com/functions/docs/concepts/nodejs-6-runtime
> In order to determine the module to load, Cloud Functions uses the main field in your package.json file. If the main field is not specified, Cloud Functions loads code from index.js 
