// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics may fail in some environments; continue without it
  console.warn("Analytics not initialized:", e);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signIn") || document.getElementById("login");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageEl = document.getElementById("logError");

  if (!signInBtn || !emailInput || !passwordInput) {
    console.warn("login.js: required DOM elements missing (signIn/login, email, password).");
    return;
  }

  function showMessage(text, isError = true) {
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.classList.toggle("error", isError);
      messageEl.classList.toggle("success", !isError);
      messageEl.setAttribute("aria-live", "polite");
    } else {
      console[isError ? "error" : "log"](text);
    }
  }

  function setProcessing(state) {
    signInBtn.disabled = state;
    if (state) signInBtn.setAttribute("aria-busy", "true");
    else signInBtn.removeAttribute("aria-busy");
  }

  signInBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = (emailInput.value || "").trim();
    const password = passwordInput.value || "";

    if (!email || !password) {
      showMessage("Please enter both email and password.");
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
        showMessage("Signed in. Redirecting...", false);
        window.location.href = "/dashboard.html";
      })
      .catch((error) => {
        const safeMessage = error && error.message ? error.message : "Sign-in failed.";
        showMessage(safeMessage);
      })
      .finally(() => {
        setProcessing(false);
      });
  });
});