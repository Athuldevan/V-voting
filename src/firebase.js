// // src/firebase.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// // Your Firebase config

// const firebaseConfig = {
//     apiKey: "AIzaSyC3cBmwCrnKhWiIWtFrVKIiT8-z_WpDj-g",
//     authDomain: "v-voting-js.firebaseapp.com",
//     projectId: "v-voting-js",
//     storageBucket: "v-voting-js.firebasestorage.app",
//     messagingSenderId: "834035338249",
//     appId: "1:834035338249:web:b9355c5e74d9971bbc3cd8"
//   };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app); // Firestore for storing user, admin, and candidate data



// Import Firebase functions from the modular SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3cBmwCrnKhWiIWtFrVKIiT8-z_WpDj-g",
    authDomain: "v-voting-js.firebaseapp.com",
    projectId: "v-voting-js",
    storageBucket: "v-voting-js.firebasestorage.app",
    messagingSenderId: "834035338249",
    appId: "1:834035338249:web:b9355c5e74d9971bbc3cd8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
