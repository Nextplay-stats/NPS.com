// Register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
  console.warn("Analytics not initialized:", e);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  const signUpBtn = document.getElementById("signup");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const usernameInput = document.getElementById("username");
  const messageEl = document.getElementById("logError");

  if (!signUpBtn || !emailInput || !passwordInput) {
    console.warn("Register.js: required DOM elements missing (signup, email, password).");
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
    signUpBtn.disabled = state;
    if (state) signUpBtn.setAttribute("aria-busy", "true");
    else signUpBtn.removeAttribute("aria-busy");
  }

  signUpBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = (emailInput.value || "").trim();
    const password = passwordInput.value || "";
    const username = (usernameInput && usernameInput.value) ? usernameInput.value.trim() : "";

    if (!email || !password) {
      showMessage("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long.");
      return;
    }

    setProcessing(true);
    showMessage("Creating account...", false);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        
        if (username) {
          updateProfile(user, { displayName: username })
            .catch((err) => {
              console.warn("Failed to set display name:", err);
            });
        }

        showMessage("Account created. Redirecting...", false);
        window.location.href = "/dashboard.html";
      })
      .catch((error) => {
        const safeMessage = error && error.message ? error.message : "Failed to create account.";
        showMessage(safeMessage);
      })
      .finally(() => {
        setProcessing(false);
      });
  });
});