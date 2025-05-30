// lib/firestore.ts

import { db } from '../app/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';

/** Create a new persona (with systemPrompt) */
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
    systemPrompt,
    avatarUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    public: false,
  });
  return docRef.id;
};

/** List all personas for a user */
export const getPersonas = async (userId: string) => {
  const personasRef = collection(db, 'users', userId, 'personas');
  const snapshot = await getDocs(personasRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** Fetch a single persona (including its systemPrompt) */
export const getPersonaById = async (
  userId: string,
  personaId: string
): Promise<any> => {
  const ref = doc(db, 'users', userId, 'personas', personaId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Persona not found');
  return { id: snap.id, ...snap.data() };
};

/** Add a chat message (role: 'user' | 'assistant') */
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

/** List chat messages for a persona, ordered by timestamp */
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
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
