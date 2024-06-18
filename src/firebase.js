// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import { getFirestore ,doc,setDoc} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyB0dXB7Z8nhNb40INKl4TaveHab35X3RsQ",
  authDomain: "bemybudget-4aa5b.firebaseapp.com",
  projectId: "bemybudget-4aa5b",
  storageBucket: "bemybudget-4aa5b.appspot.com",
  messagingSenderId: "752549750480",
  appId: "1:752549750480:web:39a2666dea6c5ad96460d5",
  measurementId: "G-1Q87WB8Z9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };