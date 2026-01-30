import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDweF6eR_TENWlY3bUhsASn-szZkQudAfY",
    authDomain: "future-you-ab1f2.firebaseapp.com",
    projectId: "future-you-ab1f2",
    storageBucket: "future-you-ab1f2.firebasestorage.app",
    messagingSenderId: "233690630120",
    appId: "1:233690630120:web:4f3658aa7aca0a5070865d",
    measurementId: "G-YTZ1D0S8V0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
