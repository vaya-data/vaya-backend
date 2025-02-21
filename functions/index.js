import functions from 'firebase-functions';
import app from './app.js';

// Export Firebase functions
export const api = functions.https.onRequest(app);