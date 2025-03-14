
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  BellOff, 
  CalendarDays, 
  Mic, 
  MessageSquare,
  Bell
} from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/components/ui/use-toast';

interface Meetup {
  id: string;
  employeeId: string;
  employeeName: string;
  scheduledFor: string;
  duration: string;
  topics: string[];
  isPending: boolean;
  type: "voice" | "chat" | "both";
}

interface UpcomingMeetupsProps {
  meetups: Meetup[];
  onScheduleNew: () => void;
}

export const UpcomingMeetups: React.FC<UpcomingMeetupsProps> = ({ 
  meetups: initialMeetups, 
  onScheduleNew 
}) => {
  const [meetups, setMeetups] = useState(initialMeetups);
  const { openChat } = useChat();
  
  // Listen for meetup completion events
  useEffect(() => {
    const handleMeetupCompleted = (e: CustomEvent) => {
      const completedMeetupId = e.detail?.meetupId;
      if (completedMeetupId) {
        setMeetups(prevMeetups => 
          prevMeetups.filter(meetup => meetup.id !== completedMeetupId)
        );
      }
    };
    
    window.addEventListener('meetup-completed', handleMeetupCompleted as EventListener);
    
    return () => {
      window.removeEventListener('meetup-completed', handleMeetupCompleted as EventListener);
    };
  }, []);
  
  // Update meetups if props change
  useEffect(() => {
    setMeetups(initialMeetups);
  }, [initialMeetups]);
  
  const toggleNotification = (employeeName: string) => {
    toast({
      title: "Notification settings updated",
      description: `You'll no longer receive reminders for meetups about ${employeeName}`,
    });
  };
  
  const handleOpenMeetup = (meetup: Meetup) => {
    // Open the chat when a meetup is started or continued
    openChat(meetup.id, meetup.employeeName);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Upcoming Meetups</CardTitle>
        <Button size="sm" variant="outline" onClick={onScheduleNew} className="gap-1">
          <CalendarDays size={14} />
          <span>Schedule New</span>
        </Button>
      </CardHeader>
      <CardContent>
        {meetups.length > 0 ? (
          <div className="space-y-4">
            {meetups.map((meetup) => (
              <div key={meetup.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="font-medium">{meetup.employeeName}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={14} className="mr-1 ml-2" />
                      <span>{meetup.scheduledFor}</span>
                      <span className="mx-2">•</span>
                      <Clock size={14} className="mr-1" />
                      <span>{meetup.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => toggleNotification(meetup.employeeName)}
                      className="text-muted-foreground"
                    >
                      <BellOff size={16} />
                    </Button>
                    <Link to="/meetups" onClick={() => handleOpenMeetup(meetup)}>
                      <Button size="sm" className="gap-1">
                        <div className="flex items-center gap-1">
                          <Mic size={14} />
                          <MessageSquare size={14} />
                        </div>
                        <span className="ml-1">{meetup.isPending ? "Start" : "Continue"}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No upcoming meetups</p>
            <Button className="mt-4" onClick={onScheduleNew}>Schedule a Meetup</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
