
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  photoUrl: string;
  coachingSince: string;
  nextMeetup: string | null;
  strengths: string[];
}

interface EmployeesListProps {
  employees: Employee[];
}

export const EmployeesList: React.FC<EmployeesListProps> = ({ employees }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Employees</CardTitle>
        <Link to="/employees">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
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
  );
};
