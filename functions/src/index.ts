import * as functions from 'firebase-functions';
import { app } from './ssr';

const ssr = functions.https.onRequest(app);

export { ssr };