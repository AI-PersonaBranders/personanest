// lib/firestore.ts
import { db } from '../app/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

export const createPersona = async (
  userId: string,
  name: string,
  description: string,
  systemPrompt: string,
  avatarUrl = ''
) => {
  const personasRef = collection(db, 'users', userId, 'personas');
  const docRef = await addDoc(personasRef, {
    name,
    description,
    systemPrompt,           // ← we store the system prompt here
    avatarUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    public: false,
  });
  return docRef.id;
};

export const getPersonas = async (userId: string) => {
  const personasRef = collection(db, 'users', userId, 'personas');
  const snapshot = await getDocs(personasRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addMessage = async (
  userId: string,
  personaId: string,
  role: string,
  text: string
) => {
  const messagesRef = collection(
    db,
    'users',
    userId,
    'personas',
    personaId,
    'messages'
  );
  return await addDoc(messagesRef, {
    role,
    text,
    timestamp: serverTimestamp(),
  });
};

export const getMessages = async (userId: string, personaId: string) => {
  const messagesRef = collection(
    db,
    'users',
    userId,
    'personas',
    personaId,
    'messages'
  );
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
