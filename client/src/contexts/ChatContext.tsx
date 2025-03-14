
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'system' | 'user' | 'coach';
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  isOpen: boolean;
  isMuted: boolean;
  currentMeetupId: string | null;
  currentEmployeeName: string | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  openChat: (meetupId: string, employeeName: string) => void;
  closeChat: () => void;
  toggleMute: () => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMeetupId, setCurrentMeetupId] = useState<string | null>(null);
  const [currentEmployeeName, setCurrentEmployeeName] = useState<string | null>(null);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const openChat = (meetupId: string, employeeName: string) => {
    if (currentMeetupId !== meetupId) {
      clearMessages();
    }
    setCurrentMeetupId(meetupId);
    setCurrentEmployeeName(employeeName);
    setIsOpen(true);
    
    // Add a welcome message
    addMessage({
      text: `Meetup with ${employeeName} started. You can use voice or text to communicate.`,
      sender: 'system',
    });
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    addMessage({
      text: `System voice ${!isMuted ? 'muted' : 'unmuted'}.`,
      sender: 'system',
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isMuted,
        currentMeetupId,
        currentEmployeeName,
        addMessage,
        openChat,
        closeChat,
        toggleMute,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
