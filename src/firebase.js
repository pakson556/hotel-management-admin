// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBFv0rj2OvcCTPbfzH9aTi_VfrOZIxGt8",
  authDomain: "hotel-mgt-test.firebaseapp.com",
  databaseURL:   "https://hotel-mgt-test-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hotel-mgt-test",
  storageBucket: "hotel-mgt-test.firebasestorage.app",
  messagingSenderId: "631975738400",
  appId: "1:631975738400:web:a6c2f96f2f112dc3395045",
  measurementId: "G-H8F5KT8FMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
