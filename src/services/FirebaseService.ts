import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

class FirebaseService {
  private app;
  public auth: Auth;
  public database: Database;
  public storage: FirebaseStorage;
  public functions: Functions;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    // Ensure React Native persistence and register auth before first getAuth() usage
    try {
      this.auth = initializeAuth(this.app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      this.auth = getAuth(this.app);
    }
    this.database = getDatabase(this.app);
    this.storage = getStorage(this.app);
    this.functions = getFunctions(this.app);
  }

  getInstance() {
    return this.app;
  }
}

export const firebaseService = new FirebaseService();
export const { auth, database, storage, functions } = firebaseService;