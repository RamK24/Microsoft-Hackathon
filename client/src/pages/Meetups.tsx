
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MessageSquare, Calendar, User, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { MeetupScheduler } from '@/components/meetup/MeetupScheduler';
import { MeetupChat } from '@/components/meetup/MeetupChat';
import { toast } from '@/components/ui/use-toast';
import { useChat } from '@/contexts/ChatContext';

// Mock upcoming meetups
const MOCK_INITIAL_UPCOMING_MEETUPS = [
  {
    id: "meet-1",
    employeeId: "emp-1",
    employeeName: "Alex Johnson",
    scheduledFor: "Tomorrow, 2:00 PM",
    scheduledDate: "2023-10-30",
    duration: "30 minutes",
    topics: ["Weekly progress", "New system training"],
    isPending: true
  },
  {
    id: "meet-2",
    employeeId: "emp-2",
    employeeName: "Jamie Smith",
    scheduledFor: "Friday, 10:30 AM",
    scheduledDate: "2023-11-03",
    duration: "45 minutes",
    topics: ["Monthly review", "Support challenges"],
    isPending: false
  },
  {
    id: "meet-3",
    employeeId: "emp-3",
    employeeName: "Taylor Wilson",
    scheduledFor: "Next Monday, 9:00 AM",
    scheduledDate: "2023-11-06",
    duration: "60 minutes",
    topics: ["Performance review", "Career development"],
    isPending: true
  }
];

// Mock past meetups
const MOCK_INITIAL_PAST_MEETUPS = [
  {
    id: "meet-past-1",
    employeeId: "emp-1",
    employeeName: "Alex Johnson",
    scheduledFor: "October 20, 2023",
    duration: "30 minutes",
    topics: ["Training progress", "Customer feedback"]
  },
  {
    id: "meet-past-2",
    employeeId: "emp-2",
    employeeName: "Jamie Smith",
    scheduledFor: "October 15, 2023",
    duration: "45 minutes",
    topics: ["Weekly review", "Technical issues"]
  }
];

const Meetups = () => {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [upcomingMeetups, setUpcomingMeetups] = useState(MOCK_INITIAL_UPCOMING_MEETUPS);
  const [pastMeetups, setPastMeetups] = useState(MOCK_INITIAL_PAST_MEETUPS);
  const { openChat } = useChat();
  
  // Listen for meetup completion events from the chat context
  useEffect(() => {
    const handleMeetupCompleted = (e: CustomEvent) => {
      const meetupId = e.detail?.meetupId;
      
      if (meetupId) {
        // Find the meetup that was completed
        const completedMeetup = upcomingMeetups.find(meetup => meetup.id === meetupId);
        
        if (completedMeetup) {
          // Remove from upcoming meetups
          setUpcomingMeetups(prevMeetups => 
            prevMeetups.filter(meetup => meetup.id !== meetupId)
          );
          
          // Add to past meetups
          setPastMeetups(prevMeetups => [
            {
              id: completedMeetup.id,
              employeeId: completedMeetup.employeeId,
              employeeName: completedMeetup.employeeName,
              scheduledFor: completedMeetup.scheduledFor,
              duration: completedMeetup.duration,
              topics: completedMeetup.topics || []
            },
            ...prevMeetups
          ]);
          
          toast({
            title: "Meetup moved to history",
            description: `Meetup about ${completedMeetup.employeeName} has been moved to your history.`,
          });
        }
      }
    };
    
    // Subscribe to the custom event
    window.addEventListener('meetup-completed', handleMeetupCompleted as EventListener);
    
    return () => {
      // Clean up the event listener
      window.removeEventListener('meetup-completed', handleMeetupCompleted as EventListener);
    };
  }, [upcomingMeetups]);
  
  const handleStartContinueMeetup = (meetupId: string, employeeName: string, isPending: boolean) => {
    openChat(meetupId, employeeName);
    
    toast({
      title: isPending ? "Starting Meetup" : "Continuing Meetup",
      description: `You are now ${isPending ? "starting" : "continuing"} a meetup about ${employeeName}`,
    });
  };
  
  const handleViewRecording = (employeeName: string) => {
    toast({
      title: "Viewing Recording",
      description: `Loading recording of your meetup about ${employeeName}`,
    });
  };
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meetups</h1>
        <Button onClick={() => setIsSchedulerOpen(true)} className="gap-1">
          <Calendar size={16} />
          <span>Schedule New Meetup</span>
        </Button>
      </div>
      
      <MeetupScheduler 
        open={isSchedulerOpen} 
        onOpenChange={setIsSchedulerOpen} 
      />
      
      <MeetupChat />
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming Meetups</TabsTrigger>
          <TabsTrigger value="past">Past Meetups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="space-y-4">
            {upcomingMeetups.length > 0 ? (
              upcomingMeetups.map((meetup) => (
                <Card key={meetup.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="font-semibold">{meetup.employeeName}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon size={14} className="mr-1 ml-2" />
                          <span>{meetup.scheduledFor}</span>
                          <span className="mx-2">•</span>
                          <Clock size={14} className="mr-1" />
                          <span>{meetup.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleStartContinueMeetup(meetup.id, meetup.employeeName, meetup.isPending)}
                        >
                          <div className="flex items-center gap-1">
                            <Mic size={14} />
                            <MessageSquare size={14} />
                          </div>
                          <span className="ml-1">{meetup.isPending ? "Start" : "Continue"}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg p-6">
                <Calendar size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No upcoming meetups</p>
                <Button onClick={() => setIsSchedulerOpen(true)}>Schedule a Meetup</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="space-y-4">
            {pastMeetups.length > 0 ? (
              pastMeetups.map((meetup) => (
                <Card key={meetup.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="font-semibold">{meetup.employeeName}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon size={14} className="mr-1 ml-2" />
                          <span>{meetup.scheduledFor}</span>
                          <span className="mx-2">•</span>
                          <Clock size={14} className="mr-1" />
                          <span>{meetup.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-1"
                          onClick={() => handleViewRecording(meetup.employeeName)}
                        >
                          View Recording
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg p-6">
                <Calendar size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No meetup history yet</p>
                <Button variant="outline" onClick={() => setIsSchedulerOpen(true)}>Schedule Your First Meetup</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Meetups;
