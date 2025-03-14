
import React, { useEffect, useState } from 'react';
import { EmployeeProfile } from '../components/dashboard/EmployeeProfile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Calendar, Clock, Mic, Bell, CalendarDays, BellOff, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Mock employee data
const MOCK_EMPLOYEE = {
  id: "emp-1",
  name: "Alex Johnson",
  role: "Retail Associate",
  department: "Customer Service",
  coachingSince: "March 2023",
  nextMeetup: "Tomorrow, 2:00 PM",
  strengths: ["Communication", "Attention to detail", "Adaptability"],
  photoUrl: ""
};

// Mock upcoming meetups with added type property
const MOCK_UPCOMING_MEETUPS = [
  {
    id: "meet-1",
    employeeId: "emp-1",
    employeeName: "Alex Johnson",
    scheduledFor: "Tomorrow, 2:00 PM",
    duration: "30 minutes",
    topics: ["Weekly progress", "New system training"],
    isPending: true,
    type: "both" // both voice and chat
  },
  {
    id: "meet-2",
    employeeId: "emp-2",
    employeeName: "Jamie Smith",
    scheduledFor: "Friday, 10:30 AM",
    duration: "45 minutes",
    topics: ["Monthly review", "Support challenges"],
    isPending: false,
    type: "voice" // voice only
  }
];

// Mock employees for the dashboard
const MOCK_EMPLOYEES = [
  {
    id: "emp-1",
    name: "Alex Johnson",
    role: "Retail Associate",
    department: "Customer Service",
    coachingSince: "March 2023",
    nextMeetup: "Tomorrow, 2:00 PM",
    strengths: ["Communication", "Attention to detail", "Adaptability"],
    photoUrl: ""
  },
  {
    id: "emp-2",
    name: "Jamie Smith",
    role: "Customer Service Rep",
    department: "Support",
    coachingSince: "January 2023",
    nextMeetup: "Friday, 10:30 AM",
    strengths: ["Problem-solving", "Technical knowledge", "Patience"],
    photoUrl: ""
  },
  {
    id: "emp-3",
    name: "Taylor Wilson",
    role: "Sales Associate",
    department: "Retail",
    coachingSince: "April 2023",
    nextMeetup: null,
    strengths: ["Persuasion", "Product knowledge", "Goal-oriented"],
    photoUrl: ""
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const scheduleNewMeetup = () => {
    navigate('/meetups');
  };
  
  const toggleNotification = (employeeName: string) => {
    toast({
      title: "Notification settings updated",
      description: `You'll no longer receive reminders for meetups with ${employeeName}`,
    });
  };
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Simulate data loading
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [isAuthenticated, authLoading, navigate]);
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Coach Dashboard</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Total Employees</span>
                <span className="text-2xl font-bold">{MOCK_EMPLOYEES.length}</span>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Upcoming Meetups</span>
                <span className="text-2xl font-bold">{MOCK_UPCOMING_MEETUPS.length}</span>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Meetups This Week</span>
                <span className="text-2xl font-bold">7</span>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Pending Actions</span>
                <span className="text-2xl font-bold">3</span>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Bell className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Employees List */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Employees</CardTitle>
            <Link to="/employees">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_EMPLOYEES.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {employee.photoUrl ? (
                        <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-primary font-bold">{employee.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <Link to={`/employee/${employee.id}`}>
                    <Button size="sm">View Profile</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Meetups - Combined Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle>Upcoming Meetups</CardTitle>
          <Button size="sm" variant="outline" onClick={scheduleNewMeetup} className="gap-1">
            <CalendarDays size={14} />
            <span>Schedule New</span>
          </Button>
        </CardHeader>
        <CardContent>
          {MOCK_UPCOMING_MEETUPS.length > 0 ? (
            <div className="space-y-4">
              {MOCK_UPCOMING_MEETUPS.map((meetup) => (
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
                      <Link to="/meetups">
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
              <Button className="mt-4" onClick={scheduleNewMeetup}>Schedule a Meetup</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
