import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGdQXdq1cOdawjkF_hnSunb87RvNLF-lw",
  authDomain: "npsv5-5a9be.firebaseapp.com",
  projectId: "npsv5-5a9be",
  storageBucket: "npsv5-5a9be.appspot.com",
  messagingSenderId: "1009523253982",
  appId: "1:1009523253982:web:50848006f7eb699056984f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function protectPage(redirectUrl = "/index.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.replace(redirectUrl);
    }
  });
}