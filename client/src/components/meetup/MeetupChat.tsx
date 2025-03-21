import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { VolumeX, Volume2, X, Send, Mic, MicOff, Archive, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const MeetupChat: React.FC = () => {
  const {
    messages,
    isOpen,
    isLoading,
    isMuted,
    isListening,
    currentEmployeeName,
    currentMeetupId,
    closeChat,
    toggleMute,
    sendMessage,
    startListening,
    stopListening,
    markMeetupAsDone
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isSubmitting) return;

    setIsSubmitting(true);
    const message = inputValue;
    setInputValue(''); // Clear input immediately for better UX

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSenderName = (sender: string) => {
    if (sender === 'user') return 'You';
    if (sender === 'coach') return 'Assistant';
    return 'System';
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      toast({
        title: "Voice transcription stopped",
        description: "Assistant's voice will no longer be transcribed to the chat",
      });
    } else {
      startListening();
      toast({
        title: "Voice transcription started",
        description: "Assistant's voice will be transcribed to the chat",
      });
    }
  };

  const handleMarkAsDone = () => {
    if (currentMeetupId) {
      markMeetupAsDone(currentMeetupId);
      toast({
        title: "Meetup Completed",
        description: `The meetup about ${currentEmployeeName} has been marked as done and moved to history.`,
      });
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${isMaximized
      ? 'inset-0 p-2 md:p-2 lg:p-4'
      : 'bottom-4 right-4 w-80 md:w-96'
      }`}>
      <Card className="border border-border overflow-hidden shadow-xl h-full flex flex-col">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-background shrink-0">
          <CardTitle className="text-md font-semibold">
            Meetup about {currentEmployeeName}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMaximize}
              className="h-8 w-8"
              title={isMaximized ? "Minimize chat" : "Maximize chat"}
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleMarkAsDone}
              className="h-8 w-8"
              title="Mark meetup as done"
            >
              <Archive size={16} />
            </Button>
            <Button
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={toggleListening}
              className="h-8 w-8"
              title={isListening ? "Stop voice transcription" : "Start voice transcription"}
            >
              {isListening ? <Mic size={16} className="text-primary-foreground" /> : <MicOff size={16} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="h-8 w-8"
              title={isMuted ? "Unmute system voice" : "Mute system voice"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={closeChat}
              className="h-8 w-8"
              title="Close chat"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-background/5 max-h-[calc(100vh-200px)]">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm h-full flex items-center justify-center">
                <p>Start a conversation with the assistant</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.sender === 'coach'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-muted-foreground'
                      } animate-in fade-in slide-in-from-bottom-5 duration-300`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {getSenderName(message.sender)}
                    </div>
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                  </div>
                </div>
              ))
            )}
            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 max-w-[80%] animate-in fade-in slide-in-from-bottom-5 duration-300">
                  <div className="text-xs font-medium mb-1">
                    {getSenderName('coach')}
                  </div>
                  <div className="flex space-x-1 items-center h-5">
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-background shrink-0">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="min-h-[40px] max-h-[120px] resize-none"
                disabled={isSubmitting}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isSubmitting}
                className="h-10 w-10 shrink-0"
              >
                <Send size={16} className={isSubmitting ? "animate-pulse" : ""} />
              </Button>
            </div>
          </div>
        </CardContent>

      </Card>
    </div>
  );
};