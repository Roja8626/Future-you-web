import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDweF6eR_TENWlY3bUhsASn-szZkQudAfY",
    authDomain: "future-you-ab1f2.firebaseapp.com",
    projectId: "future-you-ab1f2",
    storageBucket: "future-you-ab1f2.firebasestorage.app",
    messagingSenderId: "233690630120",
    appId: "1:233690630120:web:8ee99146ea8a560070865d",
    measurementId: "G-YJLQQDQNFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
