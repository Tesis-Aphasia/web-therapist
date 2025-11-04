import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGbeUovCiz7fw021sVffODfSM7_WYp5XQ",
  authDomain: "apphasia-7a930.firebaseapp.com",
  projectId: "apphasia-7a930",
  storageBucket: "apphasia-7a930.firebasestorage.app",
  messagingSenderId: "835895355070",
  appId: "1:835895355070:web:48e8b7cf1339988813a0ef",
  measurementId: "G-E7G9PD2JKH"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");