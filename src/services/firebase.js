import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCdZi7bn7wp58H9qPRrrr3YN6iiq24CW4",
  authDomain: "fitnessapp-f33cc.firebaseapp.com",
  projectId: "fitnessapp-f33cc",
  storageBucket: "fitnessapp-f33cc.appspot.com",
  messagingSenderId: "857196813627",
  appId: "1:857196813627:web:7e85665d216a37bbc5ab1e",
  measurementId: "G-F8MRYC6Y6S",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase as default, auth, firestore };
