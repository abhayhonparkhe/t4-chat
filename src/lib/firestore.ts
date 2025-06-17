import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  getDoc, // Add this import
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp, 
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Message, Chat } from '@/types/chat';

export const saveMessage = async (userId: string, chatId: string, message: Message) => {
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      // Create chat if it doesn't exist
      await setDoc(chatRef, {
        id: chatId,
        title: message.content.slice(0, 30) + (message.content.length > 30 ? '...' : ''),
        lastMessage: message.content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Save the message in the messages subcollection
    const messageRef = doc(collection(db, 'users', userId, 'chats', chatId, 'messages'));
    await setDoc(messageRef, {
      ...message,
      id: messageRef.id,
      createdAt: serverTimestamp()
    });

    // Update chat's last message
    await updateDoc(chatRef, {
      lastMessage: message.content,
      updatedAt: serverTimestamp()
    });

    console.log('Message saved successfully:', message); // Add this log
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const createNewChat = async (userId: string, chatId: string, initialMessage: string): Promise<string> => {
  try {
    // Create the chat document first
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    const chatData = {
      id: chatId,
      title: initialMessage.slice(0, 30) + (initialMessage.length > 30 ? '...' : ''),
      lastMessage: initialMessage,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Use merge option to ensure no conflicts
    await setDoc(chatRef, chatData, { merge: true });

    // Save initial message
    const messageRef = doc(collection(db, 'users', userId, 'chats', chatId, 'messages'));
    await setDoc(messageRef, {
      id: messageRef.id,
      role: 'user',
      content: initialMessage,
      createdAt: serverTimestamp()
    });

    return chatId;
  } catch (error) {
    console.error('Error creating new chat:', error);
    throw error;
  }
};

export const getMessages = async (userId: string, chatId: string): Promise<Message[]> => {
  if (!userId || !chatId) return [];

  try {
    const messagesRef = collection(db, 'users', userId, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => doc.data() as Message);
    console.log('Retrieved messages:', messages); // Add this log
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  if (!userId) return [];

  try {
    const chatsRef = collection(db, 'users', userId, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Chat[];
  } catch (error) {
    console.error('Error getting chats:', error);
    return [];
  }
};

// Update the delete function to use the correct writeBatch
export const deleteChat = async (userId: string, chatId: string) => {
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    await deleteDoc(chatRef);
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

export const updateChatTitle = async (userId: string, chatId: string, title: string) => {
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    await updateDoc(chatRef, {
      title,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating chat title:', error);
    throw error;
  }
};
