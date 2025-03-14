
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Calendar, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock employee data to select from
const MOCK_EMPLOYEES = [
  {
    id: "emp-1",
    name: "Alex Johnson",
    role: "Retail Associate"
  },
  {
    id: "emp-2",
    name: "Jamie Smith",
    role: "Customer Service Rep"
  },
  {
    id: "emp-3",
    name: "Taylor Wilson",
    role: "Sales Associate"
  }
];

// Duration options
const DURATION_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" }
];

const meetupSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee"
  }),
  scheduledDate: z.string().min(1, "Please select a date"),
  scheduledTime: z.string().min(1, "Please select a time"),
  duration: z.string({
    required_error: "Please select a duration"
  }),
});

type MeetupFormValues = z.infer<typeof meetupSchema>;

interface MeetupSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeetupScheduler: React.FC<MeetupSchedulerProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const form = useForm<MeetupFormValues>({
    resolver: zodResolver(meetupSchema),
    defaultValues: {
      scheduledDate: new Date().toISOString().split('T')[0], // Today's date as default
      scheduledTime: '09:00',
      duration: '30'
    }
  });

  const onSubmit = (data: MeetupFormValues) => {
    // In a real app, this would save to a database
    console.log('Meetup scheduled:', data);
    
    // Get the employee name for the toast
    const employee = MOCK_EMPLOYEES.find(emp => emp.id === data.employeeId);
    const durationLabel = DURATION_OPTIONS.find(d => d.value === data.duration)?.label;
    
    toast({
      title: "Meetup Scheduled",
      description: `Meetup with ${employee?.name} scheduled for ${data.scheduledDate} at ${data.scheduledTime} (${durationLabel})`,
    });
    
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a New Meetup</DialogTitle>
          <DialogDescription>
            Create a new meetup with your employee. Voice and chat will be available during the meetup.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_EMPLOYEES.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DURATION_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Schedule Meetup</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
