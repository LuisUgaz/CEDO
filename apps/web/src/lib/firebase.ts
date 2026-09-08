import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

// Configuración por defecto o mediante variables de entorno Vite
const DEFAULT_FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCEDO-REHAB-TEST-API-KEY-0001',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cedo-rehab.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cedo-rehab',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cedo-rehab.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890'
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
}

export function getFirebaseApp(customConfig?: FirebaseOptions): FirebaseApp {
  if (appInstance) return appInstance;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    appInstance = getApp();
    return appInstance;
  }

  const config = customConfig || DEFAULT_FIREBASE_CONFIG;
  appInstance = initializeApp(config);
  return appInstance;
}

export function getFirebaseAuth(app?: FirebaseApp): Auth {
  if (authInstance) return authInstance;
  const currentApp = app || getFirebaseApp();
  authInstance = getAuth(currentApp);
  return authInstance;
}

export function getFirestoreDb(app?: FirebaseApp): Firestore {
  if (dbInstance) return dbInstance;
  const currentApp = app || getFirebaseApp();

  try {
    // Inicializar Firestore con persistencia offline habilitada (IndexedDB)
    dbInstance = initializeFirestore(currentApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    // Si ya fue inicializado previamente o en un entorno sin IndexedDB completo
    dbInstance = getFirestore(currentApp);
  }

  return dbInstance;
}

// Inicialización diferida / por defecto
export const app = getFirebaseApp();
export const auth = getFirebaseAuth(app);
export const db = getFirestoreDb(app);
