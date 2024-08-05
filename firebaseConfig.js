// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDF8SYjAhBmbrh2rJyuqjTqWpDZRjYeuyk",
  authDomain: "pantry-tracker-d41e8.firebaseapp.com",
  projectId: "pantry-tracker-d41e8",
  storageBucket: "pantry-tracker-d41e8.appspot.com",
  messagingSenderId: "259101264382",
  appId: "1:259101264382:web:3b101b6a5330562eaf98af",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage, collection, onSnapshot, doc, setDoc, deleteDoc, ref, uploadBytes, getDownloadURL};
