// app/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7JwsXae2ph78AwwKDifHz8KWiMfC77As",
  authDomain: "persona-forger.firebaseapp.com",
  projectId: "persona-forger",
  storageBucket: "persona-forger.firebasestorage.app",
  messagingSenderId: "595840949471",
  appId: "1:595840949471:web:77b7f1fa0b87910ad79d6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export { auth, provider, db };

export const createPersona = async (
  userId: string,
  name: string,
  description: string,
  systemPrompt: string,
  avatarUrl = ''
) => {
  const personasRef = collection(db, 'users', userId, 'personas');
  return await addDoc(personasRef, {
    name,
    description,
    systemPrompt,
    avatarUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    public: false,
  });
};
