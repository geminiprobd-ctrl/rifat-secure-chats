
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, serverTimestamp, off } from "firebase/database";

// Temporary demo config. In a real app, use your own Firebase project credentials.
const firebaseConfig = {
  databaseURL: "https://gemini-apps-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const subscribeToRoom = (roomCode: string, callback: (messages: any[]) => void) => {
  if (!roomCode) return () => {};
  const roomRef = ref(db, `rooms/${roomCode}/messages`);
  
  const unsubscribe = onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messageList = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(messageList);
    } else {
      callback([]);
    }
  });

  return () => off(roomRef, 'value', unsubscribe);
};

export const sendMessageToRoom = async (roomCode: string, message: any) => {
  if (!roomCode) return;
  const roomRef = ref(db, `rooms/${roomCode}/messages`);
  const newMessageRef = push(roomRef);
  await set(newMessageRef, {
    ...message,
    timestamp: serverTimestamp()
  });
};
