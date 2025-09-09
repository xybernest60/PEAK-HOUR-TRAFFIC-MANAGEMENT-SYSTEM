// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1IE2VmWjsDFZC0C79OJJlB4savo1UQho",
  authDomain: "peak-hour-traffic-management.firebaseapp.com",
  databaseURL: "https://peak-hour-traffic-management-default-rtdb.firebaseio.com",
  projectId: "peak-hour-traffic-management",
  storageBucket: "peak-hour-traffic-management.firebasestorage.app",
  messagingSenderId: "793875835833",
  appId: "1:793875835833:web:dd5cf9e5f9bd28baf2e468",
  measurementId: "G-LHFBR4W6F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
