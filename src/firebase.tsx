import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDJMIeMggOEkzvvmzFp4FffCYXRd5_EXnY",
  authDomain: "cilche-prototype.firebaseapp.com",
  projectId: "cilche-prototype",
  storageBucket: "cilche-prototype.appspot.com",
  messagingSenderId: "529483602235",
  appId: "1:529483602235:web:bdc665b2d901d9b5b6ff1e",
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
