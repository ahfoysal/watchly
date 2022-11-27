
import { initializeApp } from "firebase/app";
import { getAuth }  from "firebase/auth";

import { getFirestore } from '@firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCpATbE6XdxCQRgB9oPLwdtAOrFJlbnBmw",
  authDomain: "test-7513a.firebaseapp.com",
  projectId: "test-7513a",
  storageBucket: "test-7513a.appspot.com",
  messagingSenderId: "814578012624",
  appId: "1:814578012624:web:34ae95a17e885cb199e9d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app;