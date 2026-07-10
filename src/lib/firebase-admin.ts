import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      // Automatically uses GOOGLE_APPLICATION_CREDENTIALS from .env for local dev
      initializeApp();
    }
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

export const adminAuth = getApps().length > 0 ? getAuth() : null;
