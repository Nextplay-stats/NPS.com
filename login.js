// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";



const firebaseConfig = {
  apiKey: "AIzaSyDGdQXdq1cOdawjkF_hnSunb87RvNLF-lw",
  authDomain: "npsv5-5a9be.firebaseapp.com",
  projectId: "npsv5-5a9be",
  storageBucket: "npsv5-5a9be.firebasestorage.app",
  messagingSenderId: "1009523253982",
  appId: "1:1009523253982:web:50848006f7eb699056984f",
  measurementId: "G-H7GHBTF5WV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const login = document.getElementById('login');
login.addEventListener('click', function(event){

const email = document.getElementById("email").value
const password = document.getElementById("password").value

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("User signed in:", user);
    window.location.href = "/dashboard.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });

})



