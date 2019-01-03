

# firebase settings
firebase.jsonのfunctions sourceにて、functionsディレクトリを明示（これはデフォルトなので、書かなくてもよい）
https://firebase.google.com/docs/functions/manage-functions?hl=ja#deploy_functions

hostingのpublicにて、dist/appを指定

functionsフォルダ内のpackage.jsonのmainにて、ソースコードの場所を指定（jsにコンパイル済みのものの場所

https://cloud.google.com/functions/docs/concepts/nodejs-6-runtime
> In order to determine the module to load, Cloud Functions uses the main field in your package.json file. If the main field is not specified, Cloud Functions loads code from index.js 
