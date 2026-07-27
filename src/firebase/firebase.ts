import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Fill these in from your Firebase project settings, or provide them via a
// .env file using the VITE_FIREBASE_* keys below (Vite exposes any env
// variable prefixed with VITE_ through import.meta.env).
console.log("ENV:", import.meta.env);
console.log("API:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
console.log(import.meta.env)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // Fails loudly instead of silently running against an unconfigured Firebase project.
  throw new Error(
    'Firebase is not configured. Copy .env.example to .env and fill in your Firebase project credentials ' +
      '(Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration).'
  )
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
