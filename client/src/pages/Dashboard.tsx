
import React, { useEffect, useState } from 'react';
import { EmployeeProfile } from '../components/dashboard/EmployeeProfile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, Clock, Bell } from 'lucide-react';
import { DashboardSummaryCard } from '@/components/dashboard/DashboardSummaryCard';
import { EmployeesList } from '@/components/dashboard/EmployeesList';
import { UpcomingMeetups } from '@/components/dashboard/UpcomingMeetups';

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
        <DashboardSummaryCard 
          title="Total Employees" 
          value={MOCK_EMPLOYEES.length} 
          icon={<Users className="h-6 w-6 text-primary" />} 
        />
        
        <DashboardSummaryCard 
          title="Upcoming Meetups" 
          value={MOCK_UPCOMING_MEETUPS.length} 
          icon={<Calendar className="h-6 w-6 text-primary" />} 
        />
        
        <DashboardSummaryCard 
          title="Meetups This Week" 
          value={7} 
          icon={<Clock className="h-6 w-6 text-primary" />} 
        />
        
        <DashboardSummaryCard 
          title="Pending Actions" 
          value={3} 
          icon={<Bell className="h-6 w-6 text-primary" />} 
        />
      </div>
      
      {/* Employees List */}
      <div className="grid grid-cols-1 gap-6">
        <EmployeesList employees={MOCK_EMPLOYEES} />
      </div>
      
      {/* Upcoming Meetups */}
      <UpcomingMeetups 
        meetups={MOCK_UPCOMING_MEETUPS} 
        onScheduleNew={scheduleNewMeetup} 
      />
    </div>
  );
};

export default Dashboard;
