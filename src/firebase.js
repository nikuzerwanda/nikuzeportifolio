import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbudjWIFVdkFbvewv6FNEkfCTJIOhyTA8",
  authDomain: "nikuzeportfolio.firebaseapp.com",
  projectId: "nikuzeportfolio",
  storageBucket: "nikuzeportfolio.firebasestorage.app",
  messagingSenderId: "158373976578",
  appId: "1:158373976578:web:080a58461a2bbcb616651b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
