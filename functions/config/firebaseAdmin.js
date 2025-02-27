import admin from 'firebase-admin';

// Check if Firebase app is already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();


export {admin, db}