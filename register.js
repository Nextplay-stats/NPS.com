// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";



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

//submit button
const signUp = document.getElementById('signup');
signUp.addEventListener('click', function(event){
event.preventDefault();

const email = document.getElementById("email").value
const password = document.getElementById("password").value
const username = document.getElementById("username").value
createUserWithEmailAndPassword(auth, email, password,username)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("Account Created Successfully")
        window.location.href = "index.html";
    })

    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
    })

})


