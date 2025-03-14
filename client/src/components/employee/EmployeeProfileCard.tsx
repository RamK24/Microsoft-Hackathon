
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  photoUrl: string;
  coachingSince: string;
  email: string;
  phone: string;
  accommodations?: string[];
}

interface EmployeeProfileCardProps {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({
  employee,
  onEdit,
  onDelete
}) => {
  return (
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
                onClick={onDelete}
              >
                <Trash2 size={14} />
                <span className="sr-only md:not-sr-only">Delete</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={onEdit}
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
              
              {employee.accommodations && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Accommodations</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {employee.accommodations.map((accommodation, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5">
                        {accommodation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
