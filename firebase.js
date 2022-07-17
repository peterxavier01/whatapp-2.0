import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFsmJLFC2lzayT3X0CRnXggqCsSYPt52s",
  authDomain: "whatsapp-2-8116c.firebaseapp.com",
  projectId: "whatsapp-2-8116c",
  storageBucket: "whatsapp-2-8116c.appspot.com",
  messagingSenderId: "881605363960",
  appId: "1:881605363960:web:2fae327ab6ee1bc8c6d30d",
  measurementId: "G-YHVCYHMPZB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let provider = new GoogleAuthProvider();

// const analytics = getAnalytics(app);

export { db, auth, provider };