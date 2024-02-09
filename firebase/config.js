// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Your web app's Firebase configuration here
  // See https://firebase.google.com/docs/web/setup#add-sdks-initialize
  apiKey: "AIzaSyC1fJin7rP6jMtzdemmSgGrkoOX67cWTGA",
  authDomain: "ezout-backend.firebaseapp.com",
  projectId: "ezout-backend",
  storageBucket: "ezout-backend.appspot.com",
  messagingSenderId: "520617196632",
  appId: "1:520617196632:web:042809a5b11cee2c5c5e2d",
  measurementId: "G-45G1LER5SS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

