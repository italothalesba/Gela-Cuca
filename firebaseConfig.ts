import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwAKnufk7NiSNn4AImEKjE6k7E8a-RUPc",
  authDomain: "gela-cuca.firebaseapp.com",
  projectId: "gela-cuca",
  storageBucket: "gela-cuca.firebasestorage.app",
  messagingSenderId: "568832918230",
  appId: "1:568832918230:web:0abf640ad9d83d1b29bf77",
  measurementId: "G-QRX3JZGEYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, analytics };