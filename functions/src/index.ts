import * as functions from 'firebase-functions';
import { app as ssrServer } from './ssr';

const ssr = functions.https.onRequest((req, res) => {
  console.log("in ssr");
  return ssrServer;
});

export { ssr };