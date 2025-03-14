import React, { createContext, useContext, useState, ReactNode, useRef, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

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
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  openChat: (meetupId: string, employeeName: string) => void;
  closeChat: () => void;
  toggleMute: () => void;
  clearMessages: () => void;
  markMeetupAsDone: (meetupId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMeetupId, setCurrentMeetupId] = useState<string | null>(null);
  const [currentEmployeeName, setCurrentEmployeeName] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const interimTranscriptRef = useRef('');

  const initSpeechRecognition = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      interimTranscriptRef.current = interimTranscript;

      if (finalTranscript) {
        addMessage({
          text: finalTranscript,
          sender: 'coach',
        });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  useEffect(() => {
    initSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [initSpeechRecognition]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        addMessage({
          text: 'Coach voice transcription activated',
          sender: 'system',
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      initSpeechRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          addMessage({
            text: 'Coach voice transcription activated',
            sender: 'system',
          });
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      addMessage({
        text: 'Coach voice transcription deactivated',
        sender: 'system',
      });
    }
  };

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
    addMessage({
      text: `Meetup about ${employeeName} started. You can use voice or text to communicate.`,
      sender: 'system',
    });
  };

  const closeChat = () => {
    if (isListening) {
      stopListening();
    }
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

  const markMeetupAsDone = (meetupId: string) => {
    addMessage({
      text: `Meetup about ${currentEmployeeName} marked as complete and moved to history.`,
      sender: 'system',
    });
    
    const meetupCompletedEvent = new CustomEvent('meetup-completed', {
      detail: {
        meetupId: meetupId
      }
    });
    window.dispatchEvent(meetupCompletedEvent);
    
    setTimeout(() => {
      closeChat();
    }, 2000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isMuted,
        currentMeetupId,
        currentEmployeeName,
        isListening,
        startListening,
        stopListening,
        addMessage,
        openChat,
        closeChat,
        toggleMute,
        clearMessages,
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

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
