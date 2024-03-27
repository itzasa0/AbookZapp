import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getAuth, signInWithEmailAndPassword, getReactNativePersistence, ReactNativeAsyncStorage} from '@firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXJxCxWWJb7nChDY_BGXHiHKcvPwk2MnI",
  authDomain: "books-app-67be5.firebaseapp.com",
  databaseURL: "https://books-app-67be5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "books-app-67be5",
  storageBucket: "books-app-67be5.appspot.com",
  messagingSenderId: "540568436482",
  appId: "1:540568436482:web:cbf887d61e688ea77acc1b"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// com.bookapp
const database = getDatabase(firebaseApp);

const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export default {firebaseApp, database};
