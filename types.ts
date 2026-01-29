
export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type: 'text' | 'image';
  imageUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  online: boolean;
  unreadCount: number;
}

// Added missing CallStatus export
export enum CallStatus {
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  ENDED = 'ended'
}
