// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (typeof window !== "undefined") {
    console.log("Firebase Config:", {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket,
        apiKey: firebaseConfig.apiKey ? "Set" : "Missing",
        appId: firebaseConfig.appId ? "Set" : "Missing",
    });
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with settings to avoid "offline" errors
// This forces long polling instead of WebSockets which can be blocked or unstable
import { initializeFirestore } from "firebase/firestore";
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// Analytics'i sadece tarayıcı tarafında (client-side) başlat
// Sunucu tarafında (window undefined ise) çalışmasını engelliyoruz
let analytics;

if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    }).catch((err) => {
        console.error("Analytics initialization failed", err);
    });
}

export { analytics };