// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps} from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4SxzrCGR7sXvYoVgY47IQuAW5ZlQ8m28",
  authDomain: "prepwise-b1efd.firebaseapp.com",
  projectId: "prepwise-b1efd",
  storageBucket: "prepwise-b1efd.firebasestorage.app",
  messagingSenderId: "603059146721",
  appId: "1:603059146721:web:f4e8e996b480d4cb038ca0",
  measurementId: "G-VZ2LG769F6"
};

// Initialize Firebase
const app = getApps().length===0 ? initializeApp(firebaseConfig) : getApp();
export const auth =getAuth(app);
export const db= getFirestore(app);