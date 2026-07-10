import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    // Automatically uses GOOGLE_APPLICATION_CREDENTIALS from .env
    initializeApp();
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

export const adminAuth = getApps().length > 0 ? getAuth() : null;
