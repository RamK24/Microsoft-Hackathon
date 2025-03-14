
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, CalendarDays, Clock, Bell, BellOff, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useChat } from '@/contexts/ChatContext';

interface MeetupReminder {
  employeeId: string;
  employeeName: string;
  scheduledFor: string;
  isPending: boolean;
}

interface VoiceMeetupReminderProps {
  reminders: MeetupReminder[];
  loading?: boolean;
}

export const VoiceMeetupReminder: React.FC<VoiceMeetupReminderProps> = ({
  reminders,
  loading = false
}) => {
  const { openChat } = useChat();
  
  const toggleNotification = (employeeName: string) => {
    // Mock function to toggle notification
    toast({
      title: "Notification settings updated",
      description: `You'll no longer receive reminders for meetups with ${employeeName}`,
    });
  };
  
  const scheduleNew = () => {
    // Mock function to schedule new meetup
    toast({
      title: "Schedule a new meetup",
      description: "The scheduler interface would open here",
    });
  };
  
  const handleStartContinueMeetup = (employeeId: string, employeeName: string, isPending: boolean) => {
    // Open the chat interface
    openChat(employeeId, employeeName);
    
    toast({
      title: isPending ? "Starting Meetup" : "Continuing Meetup",
      description: `You are now ${isPending ? "starting" : "continuing"} a meetup with ${employeeName}`,
    });
  };
  
  return (
    <Card className="transition-all duration-500 ease-in-out hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold">Meetup Reminders</CardTitle>
          <Button size="sm" variant="outline" onClick={scheduleNew} className="gap-1">
            <CalendarDays size={14} />
            <span>Schedule New</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div 
                key={reminder.employeeId}
                className="p-3 rounded-md border flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{reminder.employeeName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>{reminder.scheduledFor}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => toggleNotification(reminder.employeeName)}
                    className="text-muted-foreground"
                  >
                    <BellOff size={16} />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleStartContinueMeetup(
                      reminder.employeeId, 
                      reminder.employeeName, 
                      reminder.isPending
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <Mic size={14} />
                      <MessageSquare size={14} />
                    </div>
                    <span className="ml-1">{reminder.isPending ? "Start" : "Continue"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-center p-4">
            <Bell size={24} className="text-muted-foreground mb-2" />
            <h3 className="font-medium">No upcoming meetups</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Schedule a new meetup to track your employees' progress
            </p>
            <Button className="mt-4 gap-1" onClick={scheduleNew}>
              <CalendarDays size={14} />
              <span>Schedule Now</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
