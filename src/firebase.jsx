import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace this with your actual Firebase project configuration!
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyAMjWewJBooJZ2gmXjpH_RmV_fOr4cfo9o",
  authDomain: "hackbattle-341d3.firebaseapp.com",
  projectId: "hackbattle-341d3",
  storageBucket: "hackbattle-341d3.firebasestorage.app",
  messagingSenderId: "852089686365",
  appId: "1:852089686365:web:26dcce4678076ed68040b4",
  measurementId: "G-GX8FCW6XB3"
};

// Initialize the Firebase app only once to avoid duplicate-app errors during HMR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get a reference to the Authentication service
export const auth = getAuth(app);

// Get a reference to the Firestore database service
export const db = getFirestore(app);
