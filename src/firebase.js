import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8f_kaSktCBjJ9yGfo6NQ3vyUlAWwuUmo",
  authDomain: "opd-sys.firebaseapp.com",
  projectId: "opd-sys",
  storageBucket: "opd-sys.appspot.com",
  messagingSenderId: "322384430345",
  appId: "1:322384430345:web:8db41493e6a68d1f1cbfd8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;
