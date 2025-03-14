import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { EmployeeDetailTabs } from '../components/employee/EmployeeDetailTabs';
import { Badge } from '../components/ui/badge';

const MOCK_EMPLOYEES = [
  {
    id: "emp-1",
    name: "Alex Johnson",
    role: "Retail Associate",
    department: "Customer Service",
    coachingSince: "March 2023",
    nextMeetup: "Tomorrow, 2:00 PM",
    strengths: ["Communication", "Attention to detail", "Adaptability"],
    disability: "Autism Spectrum Disorder",
    accommodations: ["Written instructions", "Quiet workspace", "Regular breaks"],
    photoUrl: "",
    notes: "Alex works best with clear, written instructions and minimal sensory distractions.",
    recentProgress: "Has shown improvement in handling customer inquiries without assistance.",
    goals: ["Master new inventory system", "Improve multi-tasking capabilities", "Develop conflict resolution skills"],
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567"
  },
  {
    id: "emp-2",
    name: "Jamie Smith",
    role: "Customer Service Rep",
    department: "Support",
    coachingSince: "January 2023",
    nextMeetup: "Friday, 10:30 AM",
    strengths: ["Problem-solving", "Technical knowledge", "Patience"],
    disability: "ADHD",
    accommodations: ["Task chunking", "Visual timers", "Noise-cancelling headphones"],
    photoUrl: "",
    notes: "Jamie excels when tasks are broken down into smaller, manageable pieces with clear deadlines.",
    recentProgress: "Successfully handled complex customer complaints with minimal supervision.",
    goals: ["Improve focus during team meetings", "Develop time management skills", "Complete advanced product training"],
    email: "jamie.smith@example.com",
    phone: "(555) 234-5678"
  },
  {
    id: "emp-3",
    name: "Taylor Wilson",
    role: "Sales Associate",
    department: "Retail",
    coachingSince: "April 2023",
    nextMeetup: null,
    strengths: ["Persuasion", "Product knowledge", "Goal-oriented"],
    disability: "Anxiety Disorder",
    accommodations: ["Flexible scheduling", "Written follow-ups", "Advance notice of changes"],
    photoUrl: "",
    notes: "Taylor needs advance notice of any changes to routine or expectations to prepare mentally.",
    recentProgress: "Has been consistently meeting sales targets for the past month.",
    goals: ["Build confidence in presenting to groups", "Develop strategies for managing workplace stress", "Mentor a new team member"],
    email: "taylor.wilson@example.com",
    phone: "(555) 345-6789"
  }
];

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
      return;
    }
    
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundEmployee = MOCK_EMPLOYEES.find(emp => emp.id === id);
        if (foundEmployee) {
          setEmployee(foundEmployee);
          console.log("Employee data loaded:", foundEmployee);
        } else {
          toast({
            title: "Employee not found",
            description: "The employee you're looking for doesn't exist",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading employee data:', error);
        toast({
          title: "Error",
          description: "Failed to load employee data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEmployeeData();
  }, [id, isAuthenticated, authLoading, navigate, toast]);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    toast({
      title: "Not implemented",
      description: "Delete functionality is not implemented yet",
      variant: "default"
    });
  };

  const handleEdit = () => {
    toast({
      title: "Not implemented",
      description: "Edit functionality is not implemented yet",
      variant: "default"
    });
  };

  const handleScheduleMeetup = () => {
    toast({
      title: "Not implemented",
      description: "Schedule meetup functionality is not implemented yet",
      variant: "default"
    });
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="p-4 md:p-6">
        <Button variant="outline" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Employee not found</h2>
          <p className="text-muted-foreground mb-6">The employee you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/employees')}>View All Employees</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <Button variant="outline" onClick={handleGoBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-xl">Employee Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {employee.photoUrl ? (
                  <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-primary font-bold text-3xl">{employee.name.charAt(0)}</span>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 size={14} />
                  <span className="sr-only md:not-sr-only">Delete</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleEdit}
                >
                  <Edit size={14} />
                  <span className="sr-only md:not-sr-only">Edit</span>
                </Button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                
                <div className="mt-1 space-y-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                    <p>{employee.role}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                    <p>{employee.department}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coaching Since</h3>
                    <p>{employee.coachingSince}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{employee.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>{employee.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Accommodations</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {employee.accommodations && employee.accommodations.map((accommodation, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5">
                        {accommodation}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmployeeDetailTabs employee={employee} />
    </div>
  );
};

export default EmployeeDetail;
