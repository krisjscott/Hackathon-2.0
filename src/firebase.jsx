// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD14-38y2XZcIIj4EZuiq_X9_JvKJ5YkC4",
    authDomain: "propertykeapi-430c8.firebaseapp.com",
    projectId: "propertykeapi-430c8",
    storageBucket: "propertykeapi-430c8.firebasestorage.app",
    messagingSenderId: "513720940445",
    appId: "1:513720940445:web:82ce6a27cdb3e139406174",
    measurementId: "G-S2KZJRVS0F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, RecaptchaVerifier, signInWithPhoneNumber };
