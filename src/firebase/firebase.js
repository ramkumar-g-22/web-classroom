import firebase from "firebase";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWwhkiHzss0NmCCW9mS75tCjVnrwaT1-U",
  authDomain: "web-classroom-45a5b.firebaseapp.com",
  projectId: "web-classroom-45a5b",
  storageBucket: "web-classroom-45a5b.appspot.com",
  messagingSenderId: "391194152796",
  appId: "1:391194152796:web:92ab08a0f22a131be8fb99",
};
// console.log(firebase.database.ServerValue.TIMESTAMP);

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();