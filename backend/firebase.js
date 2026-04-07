const admin = require('firebase-admin');

let app;

/**
 * Initialize Firebase Admin SDK
 */
function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  let serviceAccount;

  // Option 1: From ENV variable (Recommended for production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT must be valid JSON');
    }
  } 
  // Option 2: From local file (for development)
  else {
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (error) {
      throw new Error(
        'Service account not found. Add serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT env variable.'
      );
    }
  }

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('🔥 Firebase Admin Initialized Successfully');
  return app;
}

// Initialize once
const firebaseApp = initFirebase();

// Firestore database
const db = firebaseApp.firestore();

// Export everything needed
module.exports = {
  admin,
  db,
};
