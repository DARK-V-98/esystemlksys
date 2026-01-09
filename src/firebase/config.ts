// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClqbfmL5kFN1gfUfel06tAJaiydLgvCL8",
  authDomain: "esystemlk.firebaseapp.com",
  databaseURL: "https://esystemlk-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esystemlk",
  storageBucket: "esystemlk.firebasestorage.app",
  messagingSenderId: "520998716067",
  appId: "1:520998716067:web:8a24e2cd2cb581bb687516",
  measurementId: "G-MQ9S4TKT2E"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };
