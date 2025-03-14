import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbgk1_qQ-aJFpxz0UVfcIwIpP-OuIpves",
    authDomain: "bridge-5bcbd.firebaseapp.com",
    projectId: "bridge-5bcbd",
    storageBucket: "bridge-5bcbd.firebasestorage.app",
    messagingSenderId: "444464874647",
    appId: "1:444464874647:web:08c5b9ffbf4a5af9c395d2",
    measurementId: "G-ZPMVG2K56E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance and Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };

