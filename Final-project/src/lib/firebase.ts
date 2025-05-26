import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA6CRcgA91iTYwjJqV3U7CDzPNj-N4UhN0",
  authDomain: "faculty-portal-21d22.firebaseapp.com",
  projectId: "faculty-portal-21d22",
  storageBucket: "faculty-portal-21d22.firebasestorage.app",
  messagingSenderId: "955258413468",
  appId: "1:955258413468:web:299c52d8172521d5432859"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);