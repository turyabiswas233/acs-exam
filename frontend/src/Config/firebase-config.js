import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
const firebaseConfig = {
  apiKey: "AIzaSyAbewhsgNlLVMB09dmfB1Gk9YU1HVcTwEM",
  authDomain: "tb-exam-app.firebaseapp.com",
  projectId: "tb-exam-app",
  storageBucket: "tb-exam-app.appspot.com",
  messagingSenderId: "719056802961",
  appId: "1:719056802961:web:c5e96d7a6ce3f3508c1b30",
  measurementId: "G-9S362YGKK0"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, storage };
