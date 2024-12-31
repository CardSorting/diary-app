import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHXwuGjxf3vsIMqvPw7NFwyaSTOABp-ig",
  authDomain: "mmarket-1bedd.firebaseapp.com",
  projectId: "mmarket-1bedd",
  storageBucket: "mmarket-1bedd.firebasestorage.app",
  messagingSenderId: "728020001045",
  appId: "1:728020001045:web:1935bed777a0f9c05a091c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };