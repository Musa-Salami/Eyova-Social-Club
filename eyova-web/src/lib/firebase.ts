import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "omis-electrical",
  appId: "1:976127650384:web:73840046add94aefc53f55",
  storageBucket: "omis-electrical.firebasestorage.app",
  apiKey: "AIzaSyBZoUaDqJttlCbKJPJ86N5E9qZ-sBi79Bg",
  authDomain: "omis-electrical.firebaseapp.com",
  messagingSenderId: "976127650384",
  measurementId: "G-GPMYGD7E4X",
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
