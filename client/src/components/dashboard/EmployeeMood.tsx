
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, AlertTriangle, Info } from 'lucide-react';

interface EmployeeMoodProps {
  employeeId: string;
}

interface MoodData {
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'frustrated';
  intensity: number;
  reason: string;
  date: string;
}

export const EmployeeMood: React.FC<EmployeeMoodProps> = ({ employeeId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<MoodData | null>(null);

  useEffect(() => {
    // Function to fetch mood data from the API
    const fetchMoodData = async () => {
      setLoading(true);
      try {
        // This would be your actual API call
        // const response = await fetch(`/api/employees/${employeeId}/mood`);
        // if (!response.ok) throw new Error('Failed to fetch mood data');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData: MoodData = {
          mood: ['happy', 'neutral', 'sad', 'anxious', 'frustrated'][Math.floor(Math.random() * 5)] as MoodData['mood'],
          intensity: Math.random() * 0.7 + 0.3, // Random between 0.3 and 1.0
          reason: [
            "Recent project success and positive feedback from manager",
            "Workload concerns and deadline pressure",
            "Challenges with work-life balance",
            "Team communication issues",
            "Feeling supported by the team and making good progress"
          ][Math.floor(Math.random() * 5)],
          date: new Date().toISOString().split('T')[0]
        };

        // Simulate API delay
        setTimeout(() => {
          setMoodData(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [employeeId]);

  // Function to get mood icon based on the mood
  const getMoodIcon = () => {
    if (!moodData) return <Meh className="h-8 w-8 text-muted-foreground" />;

    switch (moodData.mood) {
      case 'happy':
        return <Smile className="h-8 w-8 text-green-500" />;
      case 'sad':
        return <Frown className="h-8 w-8 text-blue-500" />;
      case 'anxious':
      case 'frustrated':
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case 'neutral':
      default:
        return <Meh className="h-8 w-8 text-slate-500" />;
    }
  };

  // Function to get mood badge color
  const getMoodBadge = () => {
    if (!moodData) return <Badge variant="outline">Unknown</Badge>;

    switch (moodData.mood) {
      case 'happy':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">{moodData.mood}</Badge>;
      case 'sad':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">{moodData.mood}</Badge>;
      case 'anxious':
      case 'frustrated':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">{moodData.mood}</Badge>;
      case 'neutral':
      default:
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200">{moodData.mood}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Current Mood</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive flex flex-col items-center p-4">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {getMoodIcon()}
              <div>
                <div className="font-medium flex items-center gap-2">
                  Current mood: {getMoodBadge()}
                </div>
                <div className="text-sm text-muted-foreground">
                  As of {moodData?.date}
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Info size={14} />
                Reason
              </h4>
              <p className="text-sm text-muted-foreground">{moodData?.reason}</p>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-1">Intensity</h4>
              <div className="w-full bg-secondary/20 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(moodData?.intensity || 0) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};