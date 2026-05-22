import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2MA4KUs-FXtIs3nEHFvbWy8A2CjUox1g",
  authDomain: "smart-games-681a1.firebaseapp.com",
  projectId: "smart-games-681a1",
  storageBucket: "smart-games-681a1.firebasestorage.app",
  messagingSenderId: "179871764384",
  appId: "1:179871764384:web:2b51c6633b9ab041481ec5",
  measurementId: "G-8T81B016FG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
