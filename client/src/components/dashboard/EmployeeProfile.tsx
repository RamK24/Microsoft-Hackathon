
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Mic, Calendar, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

interface EmployeeProfileProps {
  employee: {
    id: string;
    name: string;
    role: string;
    department: string;
    coachingSince: string;
    nextMeetup?: string;
    strengths: string[];
    disability?: string;
    accommodations?: string[];
    photoUrl?: string;
  };
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  const { toast } = useToast();

  const handleSchedule = () => {
    toast({
      title: "Not implemented",
      description: "Schedule functionality is not implemented yet",
      variant: "default"
    });
  };

  const handleStartMeetup = () => {
    toast({
      title: "Not implemented",
      description: "Start meetup functionality is not implemented yet",
      variant: "default"
    });
  };

  return (
    <Card className="transition-all duration-500 ease-in-out hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Employee Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {employee.photoUrl ? (
                <img 
                  src={employee.photoUrl} 
                  alt={employee.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-xl">
                  {employee.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-xl">{employee.name}</h3>
            <p className="text-muted-foreground">{employee.role}</p>
            <div className="flex flex-wrap gap-1 mt-2 justify-center sm:justify-start">
              <Badge variant="outline">{employee.department}</Badge>
              <Badge variant="secondary">Coaching since {employee.coachingSince}</Badge>
            </div>
            
            {employee.disability && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Disability:</h4>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{employee.disability}</Badge>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Key Strengths:</h4>
              <div className="flex flex-wrap gap-1">
                {employee.strengths.map((strength, i) => (
                  <Badge key={i} variant="outline" className="bg-primary/5">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            
            {employee.accommodations && employee.accommodations.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Key Accommodations:</h4>
                <div className="flex flex-wrap gap-1">
                  {employee.accommodations.slice(0, 2).map((accommodation, i) => (
                    <Badge key={i} variant="outline" className="bg-secondary/10">
                      {accommodation}
                    </Badge>
                  ))}
                  {employee.accommodations.length > 2 && (
                    <Badge variant="outline" className="bg-secondary/10">
                      +{employee.accommodations.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Next Voice Meetup:</h4>
              {employee.nextMeetup ? (
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Calendar size={14} className="mr-1" />
                  <span className="text-sm">{employee.nextMeetup}</span>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mt-1">No upcoming meetups</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1"
                onClick={handleSchedule}
              >
                <Clock size={14} />
                <span>Schedule</span>
              </Button>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={handleStartMeetup}
              >
                <div className="flex items-center gap-1">
                  <Mic size={14} />
                  <MessageSquare size={14} />
                </div>
                <span>Start Meetup</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-right">
          <Link to={`/employee/${employee.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <span>View Full Profile</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
