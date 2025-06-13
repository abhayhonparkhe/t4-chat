import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

export const saveMessage = async (userId: string, message: { role: string; content: string }) => {
  try {
    const ref = collection(db, 'chats', userId, 'messages');
    await addDoc(ref, {
      ...message,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error saving message:', err);
  }
};

export const getMessages = async (userId: string) => {
  try {
    const ref = collection(db, 'chats', userId, 'messages');
    const q = query(ref, orderBy('createdAt'));
    console.log(q);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as { role: string; content: string });
  } catch (err) {
    console.error('Error loading messages:', err);
    return [];
  }
};
