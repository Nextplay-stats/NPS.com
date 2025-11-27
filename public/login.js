import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase config
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

// Grab DOM elements once
const signInBtn = document.getElementById("signIn");
const resetBtn = document.getElementById("reset");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const messageEl = document.getElementById("logError");

// Helper to show messages
function showMessage(text, isError = true) {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.classList.remove("error", "success");
  messageEl.classList.add(isError ? "error" : "success");
}

// 🔑 Sign in handler
signInBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) return showMessage("Please enter both email and password.");

  try {
    showMessage("Signing in...", false);
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const idToken = await user.getIdToken();
    const response = await fetch("/setSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    if (response.ok) {
      showMessage("Signed in. Redirecting...", false);
      window.location.replace("/homepage");
    } else {
      const errorText = await response.text();
      showMessage(`Failed to set session cookie: ${errorText}`);
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    showMessage(error.message || "Sign-in failed.");
  }
});

// 🔄 Reset password handler
resetBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return showMessage("Enter your email to reset your password.");

  try {
    showMessage("Sending reset email...", false);
    await sendPasswordResetEmail(auth, email);
    showMessage("Password reset email sent.", false);
  } catch (error) {
    console.error("Reset error:", error);
    showMessage(error.message || "Failed to send reset email.");
  }
});

// 👁 Toggle password visibility
togglePassword?.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.innerHTML =
    type === "password"
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
});