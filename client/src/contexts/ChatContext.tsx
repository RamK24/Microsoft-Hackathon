import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach' | 'system';
}

interface ChatContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isListening: boolean;
  currentEmployeeName: string;
  currentMeetupId: string | null;
  sessionId: string | null;
  openChat: (employeeName: string, meetupId: string) => void;
  closeChat: () => void;
  toggleMute: () => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  sendMessage: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  markMeetupAsDone: (meetupId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentEmployeeName, setCurrentEmployeeName] = useState('Employee');
  const [currentMeetupId, setCurrentMeetupId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const openChat = (employeeName: string, meetupId: string) => {
    setCurrentEmployeeName(employeeName);
    setCurrentMeetupId(meetupId);
    setIsOpen(true);
    setMessages([]);
    setSessionId(null);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage = {
      ...message,
      id: uuidv4(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  };

  const sendMessage = async (text: string) => {
    if (text.trim() === '') return;

    // Add user message to chat
    addMessage({
      text,
      sender: 'user',
    });

    setIsLoading(true);

    try {
      const endpoint = 'http://127.0.0.1:8000/employee-chat/2';

      const payload = sessionId
        ? { message: text, session_id: sessionId }
        : { message: text };

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',  // Ensure it's JSON
        }
      });

      if (response.data.status === 'success') {
        // Save session ID for subsequent messages
        if (response.data.session_id) {
          setSessionId(response.data.session_id);
        }

        if (response.data.response) {
          // Add the coach's response to the chat
          addMessage({
            text: response.data.response,
            sender: 'coach',
          });
        }

        // Check if conversation has ended
        if (response.data.end) {
          addMessage({
            text: "Conversation has ended.",
            sender: 'system',
          });
        }
      } else {
        // Handle error response
        addMessage({
          text: "Sorry, there was an error processing your message.",
          sender: 'system',
        });
        toast({
          title: "Error",
          description: "Failed to get a response from the assistant.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        text: "Network error. Please check your connection and try again.",
        sender: 'system',
      });
      toast({
        title: "Connection Error",
        description: "Unable to reach the chat service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const markMeetupAsDone = (meetupId: string) => {
    // Implementation would depend on your backend
    closeChat();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        isMuted,
        isListening,
        currentEmployeeName,
        currentMeetupId,
        sessionId,
        openChat,
        closeChat,
        toggleMute,
        addMessage,
        sendMessage,
        startListening,
        stopListening,
        markMeetupAsDone,
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
