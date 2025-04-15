// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA7nqVjsHENRE5DB0OkHKOR9547AVDPxOM",
    authDomain: "expensetracker-b7650.firebaseapp.com",
    projectId: "expensetracker-b7650",
    storageBucket: "expensetracker-b7650.firebasestorage.app",
    messagingSenderId: "151795527220",
    appId: "1:151795527220:web:03c8487f00cef4eb9d6461"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//users
export const auth = getAuth(app);

//database
export const db = getFirestore(app);