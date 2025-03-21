import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Pencil, Trash2, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';

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
    disability: "ADHD",
    accommodations: ["Task chunking", "Visual timers", "Noise-cancelling headphones"],
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
    disability: "Anxiety Disorder",
    accommodations: ["Flexible scheduling", "Written follow-ups", "Advance notice of changes"],
    photoUrl: ""
  }
];

const employeeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  disability: z.string().min(2, {
    message: "Disability information must be at least 2 characters.",
  }),
  accommodations: z.string().min(2, {
    message: "Accommodations must be at least 2 characters.",
  }),
});

const Employees = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      role: "",
      department: "",
      disability: "",
      accommodations: "",
    },
  });
  
  const editForm = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      role: "",
      department: "",
      disability: "",
      accommodations: "",
    },
  });
  
  useEffect(() => {
    if (selectedEmployee && isEditDialogOpen) {
      editForm.reset({
        name: selectedEmployee.name,
        role: selectedEmployee.role,
        department: selectedEmployee.department,
        disability: selectedEmployee.disability,
        accommodations: selectedEmployee.accommodations.join(", "),
      });
    }
  }, [selectedEmployee, isEditDialogOpen, editForm]);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
      return;
    }
    
    const loadEmployeesData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmployees(MOCK_EMPLOYEES);
      } catch (error) {
        console.error('Error loading employees data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEmployeesData();
  }, [isAuthenticated, authLoading, navigate]);
  
  const onSubmit = (values: z.infer<typeof employeeFormSchema>) => {
    const newEmployee = {
      id: `emp-${employees.length + 1}`,
      name: values.name,
      role: values.role,
      department: values.department,
      coachingSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      nextMeetup: null,
      strengths: [],
      disability: values.disability,
      accommodations: values.accommodations.split(",").map(item => item.trim()),
      photoUrl: ""
    };
    
    setEmployees([...employees, newEmployee]);
    form.reset();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Employee added",
      description: `${values.name} has been added to your employees.`,
    });
  };
  
  const onEdit = (values: z.infer<typeof employeeFormSchema>) => {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          name: values.name,
          role: values.role,
          department: values.department,
          disability: values.disability,
          accommodations: values.accommodations.split(",").map(item => item.trim()),
        };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Employee updated",
      description: `${values.name}'s information has been updated.`,
    });
  };
  
  const onDelete = () => {
    if (!selectedEmployee) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Employee removed",
      description: `${selectedEmployee.name} has been removed from your employees.`,
    });
  };
  
  const handleEditClick = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manage Employees</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1">
          <Plus size={16} />
          <span>Add Employee</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex flex-row md:flex-col items-center md:items-start md:w-64 bg-muted/30">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4 md:mr-0 md:mb-4">
                    {employee.photoUrl ? (
                      <img src={employee.photoUrl} alt={employee.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-primary font-bold text-xl">{employee.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Disability</h4>
                    <p>{employee.disability}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Accommodations</h4>
                    <div className="flex flex-wrap gap-1">
                      {employee.accommodations.map((accommodation, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/5">
                          {accommodation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {employee.strengths && employee.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {employee.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(employee)}
                      className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(employee)}
                      className="gap-1"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </Button>
                    <Link to={`/employee/${employee.id}`}>
                      <Button size="sm" className="gap-1">
                        <Info size={14} />
                        <span>View Profile</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter the details for the new employee.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Retail Associate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer Service" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ADHD, Autism, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accommodations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodations</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Flexible hours, quiet space, etc. (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Employee</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update the employee's information.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="disability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disability</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="accommodations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodations</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma-separated list" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedEmployee?.name} from your employees? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
