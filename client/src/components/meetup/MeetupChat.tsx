
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { VolumeX, Volume2, X, Send, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const MeetupChat: React.FC = () => {
  const { messages, isOpen, isMuted, currentEmployeeName, closeChat, toggleMute, addMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (!isOpen) return null;
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    addMessage({
      text: inputValue,
      sender: 'user',
    });
    
    // Mock response from the system
    setTimeout(() => {
      addMessage({
        text: `Response to your message: "${inputValue}"`,
        sender: 'coach',
      });
    }, 1000);
    
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getSenderName = (sender: string) => {
    if (sender === 'user') return 'You';
    if (sender === 'coach') return 'Coach';
    return 'System';
  };
  
  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 z-50 shadow-xl">
      <Card className="border border-border">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-md font-semibold">
            Meetup with {currentEmployeeName}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={closeChat}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.sender === 'coach'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-xs font-medium mb-1">
                    {getSenderName(message.sender)}
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="min-h-[40px] max-h-[120px] resize-none"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
                className="h-10 w-10 shrink-0"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
