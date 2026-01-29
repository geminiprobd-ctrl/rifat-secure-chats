
import React, { useState, useEffect, useMemo } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import SplashScreen from './components/SplashScreen';
import NewContactModal from './components/NewContactModal';
import { Contact, Message } from './types';
import { subscribeToRoom, sendMessageToRoom } from './services/firebaseService';

// Generate or get a persistent user ID for this device
const getMyUserId = () => {
  let id = localStorage.getItem('chat_user_id');
  if (!id) {
    id = 'node_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_user_id', id);
  }
  return id;
};

const INITIAL_CONTACTS: Contact[] = [
  { id: 'global', name: 'MAIN_FRAME', username: 'global_node', avatar: 'https://picsum.photos/100/100?random=matrix', lastMessage: 'Waiting for packets...', online: true, unreadCount: 0 },
];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [roomCode, setRoomCode] = useState('ROOT_NODE');
  const [messages, setMessages] = useState<Message[]>([]);
  const [myUserId] = useState(getMyUserId());
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string | null>('global');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Sync messages with Firebase when roomCode changes
  useEffect(() => {
    if (!roomCode) return;
    
    const unsubscribe = subscribeToRoom(roomCode, (syncedMessages) => {
      const formatted = syncedMessages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp || Date.now()).getTime()
      }));
      setMessages(formatted as any);
    });

    return () => unsubscribe();
  }, [roomCode]);

  const activeContact = useMemo(() => {
    return contacts.find(c => c.id === selectedContactId) || INITIAL_CONTACTS[0];
  }, [selectedContactId, contacts]);

  const handleSendMessage = async (text: string) => {
    if (!roomCode) return;

    const messageData = {
      text,
      senderId: myUserId,
      senderName: 'OPERATOR', 
      type: 'text'
    };

    await sendMessageToRoom(roomCode, messageData);
  };

  const handleAddContact = (name: string, username: string) => {
    const cleanUsername = username.toUpperCase();
    setRoomCode(cleanUsername);
    setSelectedContactId(cleanUsername);
    
    if (!contacts.find(c => c.username === cleanUsername)) {
      const newContact: Contact = {
        id: cleanUsername,
        name: name.toUpperCase(),
        username: cleanUsername,
        avatar: `https://picsum.photos/100/100?random=${cleanUsername}`,
        lastMessage: 'LINK_ESTABLISHED',
        online: true,
        unreadCount: 0
      };
      setContacts(prev => [newContact, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050505] relative font-mono">
      {showSplash && <SplashScreen />}
      {isModalOpen && (
        <NewContactModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddContact} 
        />
      )}
      
      <div className={`flex h-full w-full transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex w-full h-full">
          <div className="flex w-full h-full bg-transparent overflow-hidden relative">
            
            {/* Sidebar */}
            <div className={`${selectedContactId && window.innerWidth < 768 ? 'hidden' : 'flex'} w-full md:w-[320px] lg:w-[380px] shrink-0 z-20`}>
              <ChatSidebar 
                contacts={contacts} 
                selectedContactId={selectedContactId} 
                onSelectContact={(id) => {
                  setSelectedContactId(id);
                  const c = contacts.find(x => x.id === id);
                  if (c) setRoomCode(c.username);
                }} 
                onNewChatClick={() => setIsModalOpen(true)} 
                onAddByUsername={handleAddContact}
              />
            </div>
            
            {/* Chat View */}
            <div className={`${!selectedContactId && window.innerWidth < 768 ? 'hidden' : 'flex'} flex-1 flex-col h-full relative`}>
              <ChatWindow 
                contact={activeContact} 
                messages={messages} 
                onSendMessage={handleSendMessage}
                onBack={() => setSelectedContactId(null)}
                roomCode={roomCode}
                onRoomCodeChange={setRoomCode}
                myUserId={myUserId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
