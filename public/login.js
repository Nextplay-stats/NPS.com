import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGdQXdq1cOdawjkF_hnSunb87RvNLF-lw",
  authDomain: "npsv5-5a9be.firebaseapp.com",
  projectId: "npsv5-5a9be",
  storageBucket: "npsv5-5a9be.appspot.com",
  messagingSenderId: "1009523253982",
  appId: "1:1009523253982:web:50848006f7eb699056984f",
  measurementId: "G-H7GHBTF5WV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signIn");
  const resetBtn = document.getElementById("reset");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageEl = document.getElementById("logError");

  function msg(t, err = true) {
    if (!messageEl) return;
    messageEl.textContent = t;
    messageEl.classList.toggle("error", err);
    messageEl.classList.toggle("success", !err);
  }

  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) return msg("Please enter both email and password.");
    try {
      msg("Signing in...", false);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // 🔑 Step 3: Exchange ID token for session cookie
      const idToken = await user.getIdToken();
      const response = await fetch("/setSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (response.ok) {
        msg("Signed in. Redirecting...", false);
        window.location.replace("/homepage"); // protected route
      } else {
        msg("Failed to set session cookie.");
      }
    } catch (error) {
      msg(error.message || "Sign-in failed.");
      console.error(error);
    }
  });

  resetBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return msg("Enter your email to reset your password.");
    try {
      msg("Sending reset email...", false);
      await sendPasswordResetEmail(auth, email);
      msg("Password reset email sent.", false);
    } catch (error) {
      msg(error.message || "Failed to send reset email.");
      console.error(error);
    }
  });
});