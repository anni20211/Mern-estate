// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-mern-6523f.firebaseapp.com",
  projectId: "estate-mern-6523f",
  storageBucket: "estate-mern-6523f.appspot.com",
  messagingSenderId: "34053081993",
  appId: "1:34053081993:web:bc99ab7d5745f58da32f58"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);