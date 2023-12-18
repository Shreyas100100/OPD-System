import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9y7J4pPoFiThVm4ANU28IljeNrFiFKUA",
  authDomain: "opd-system-cd627.firebaseapp.com",
  projectId: "opd-system-cd627",
  storageBucket: "opd-system-cd627.appspot.com",
  messagingSenderId: "1076078044312",
  appId: "1:1076078044312:web:4bdcfbf476d0ce621f9ced"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;
