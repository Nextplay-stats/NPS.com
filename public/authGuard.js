// authGuard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGdQXdq1cOdawjkF_hnSunb87RvNLF-lw",
  authDomain: "npsv5-5a9be.firebaseapp.com",
  projectId: "npsv5-5a9be",
  storageBucket: "npsv5-5a9be.appspot.com",
  messagingSenderId: "1009523253982",
  appId: "1:1009523253982:web:50848006f7eb699056984f"
};

// Initialize Firebase app (only once)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Guard function to protect pages
export function protectPage(redirectUrl = "/index.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Not logged in → redirect immediately
      window.location.replace(redirectUrl);
    }
  });
}