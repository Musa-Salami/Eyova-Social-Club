import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "eyova-social-club",
  appId: "1:45917804068:web:51be797c9078f151352ab1",
  storageBucket: "eyova-social-club.firebasestorage.app",
  apiKey: "AIzaSyBbN64mbtCryoLHbSJALBmOOdliVnhjuaY",
  authDomain: "eyova-social-club.firebaseapp.com",
  messagingSenderId: "45917804068",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}

export function getStorageBucket(): FirebaseStorage {
  if (storage) return storage;
  storage = getStorage(getFirebaseApp());
  return storage;
}
