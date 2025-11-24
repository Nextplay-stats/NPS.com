import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyApdCfhPlJOMQ0uZpX8O8PAiUSHpWR595I",
  authDomain: "tasksync-60bc6.firebaseapp.com",
  projectId: "tasksync-60bc6",
  storageBucket: "tasksync-60bc6.appspot.com",
  messagingSenderId: "722766845317",
  appId: "1:722766845317:web:1290b1ebd82489fcc5a0ec",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Basic email format check
 * Returns true for simple valid-looking emails, false otherwise.
 */
function isValidEmail(email) {
  // Simple regex for basic validation; not exhaustive
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signIn");
  const resetBtn = document.getElementById("reset");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const logError = document.getElementById("logError");

  // Ensure required elements exist before attaching listeners
  if (!signInBtn || !resetBtn || !emailInput || !passwordInput || !logError) {
    console.warn("Auth.js: one or more required DOM elements are missing.");
    return;
  }

  // Helper to show messages safely
  function showMessage(message, isError = true) {
    logError.textContent = message;
    logError.classList.toggle("error", isError);
    logError.classList.toggle("success", !isError);
  }

  // Helper to toggle UI while async operations run
  function setProcessing(isProcessing) {
    signInBtn.disabled = isProcessing;
    resetBtn.disabled = isProcessing;
  }

  signInBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Please fill in both fields.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    setProcessing(true);
    showMessage("Signing in...", false);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        window.location.href = "/dashboard.html";
      })
      .catch((error) => {
        // Show a safe, user-friendly message
        const errorMessage = error && error.message ? error.message : "Sign-in failed.";
        showMessage(errorMessage);
      })
      .finally(() => {
        setProcessing(false);
      });
  });

  resetBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      showMessage("Please enter your email to reset your password.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    setProcessing(true);
    showMessage("Sending password reset email...", false);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showMessage("Password reset email sent!", false);
      })
      .catch((error) => {
        const errorMessage = error && error.message ? error.message : "Failed to send reset email.";
        showMessage(errorMessage);
      })
      .finally(() => {
        setProcessing(false);
      });
  });
});