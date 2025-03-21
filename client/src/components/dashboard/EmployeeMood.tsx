import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, AlertTriangle, Info } from 'lucide-react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface EmployeeMoodProps {
  employeeId?: string;
}

interface EmotionData {
  user_id: number;
  reason: string;
  emotion: string;
  created_date: string;
}

interface EmotionResponse {
  status: string;
  data: EmotionData[];
  message?: string;
}

export const EmployeeMood: React.FC<EmployeeMoodProps> = ({ employeeId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<EmotionData | null>(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      setLoading(true);
      try {
        // Try to get from cache first
        const cachedData = localStorage.getItem('emotionsData');
        const cachedTimestamp = localStorage.getItem('emotionsTimestamp');
        const currentTimestamp = new Date().getTime();

        // Use cached data if it's less than 5 minutes old
        if (cachedData && cachedTimestamp && currentTimestamp - parseInt(cachedTimestamp) < 5 * 60 * 1000) {
          const emotions: EmotionData[] = JSON.parse(cachedData);
          if (emotions.length > 0) {
            // Get the latest emotion by created_date
            const sortedEmotions = [...emotions].sort((a, b) =>
              new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
            );
            setMoodData(sortedEmotions[0]);
            setLoading(false);
            return;
          }
        }

        // Otherwise fetch from API with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await axios.get<EmotionResponse>('http://127.0.0.1:8000/emotions', {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.data.status === 'success' && response.data.data.length > 0) {
          // Sort by date to get the latest
          const sortedEmotions = [...response.data.data].sort((a, b) =>
            new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
          );
          setMoodData(sortedEmotions[0]);

          // Cache the data
          localStorage.setItem('emotionsData', JSON.stringify(response.data.data));
          localStorage.setItem('emotionsTimestamp', currentTimestamp.toString());
        } else {
          setError('No mood data available');
        }
      } catch (err) {
        console.error('Error fetching emotions:', err);
        if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
          setError('Request timeout - API may be unavailable');
          toast({
            title: "API Timeout",
            description: "The emotions API is taking too long to respond. Using cached data if available.",
            variant: "destructive",
          });
        } else {
          setError('Failed to fetch mood data');
        }

        // Try to use cached data even if it's older as a fallback
        const cachedData = localStorage.getItem('emotionsData');
        if (cachedData) {
          const emotions: EmotionData[] = JSON.parse(cachedData);
          if (emotions.length > 0) {
            const sortedEmotions = [...emotions].sort((a, b) =>
              new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
            );
            setMoodData(sortedEmotions[0]);
            toast({
              title: "Using cached data",
              description: "Displaying the last available mood data from cache.",
              variant: "default",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [employeeId]);

  // Convert emotion string to standardized mood
  const getStandardizedMood = (emotion: string | undefined) => {
    if (!emotion) return 'neutral';

    switch (emotion.toLowerCase()) {
      case 'excited':
        return 'happy';
      case 'negative':
      case 'sad':
        return 'sad';
      case 'neutral':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  // Function to get mood intensity based on emotion
  const getMoodIntensity = (emotion: string | undefined) => {
    if (!emotion) return 0.5;

    switch (emotion.toLowerCase()) {
      case 'excited':
        return 0.9;
      case 'sad':
        return 0.7;
      case 'negative':
        return 0.8;
      case 'neutral':
        return 0.5;
      default:
        return 0.5;
    }
  };

  // Function to get mood icon based on the mood
  const getMoodIcon = () => {
    if (!moodData) return <Meh className="h-10 w-10 text-muted-foreground" />;

    const mood = getStandardizedMood(moodData.emotion);

    switch (mood) {
      case 'happy':
        return <Smile className="h-10 w-10 text-emerald-500" />;
      case 'sad':
        return <Frown className="h-10 w-10 text-rose-500" />;
      case 'neutral':
      default:
        return <Meh className="h-10 w-10 text-blue-500" />;
    }
  };

  // Function to get mood badge color
  const getMoodBadge = () => {
    if (!moodData) return <Badge variant="outline">Unknown</Badge>;

    const mood = getStandardizedMood(moodData.emotion);

    switch (mood) {
      case 'happy':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 capitalize">
            {moodData.emotion}
          </Badge>
        );
      case 'sad':
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 capitalize">
            {moodData.emotion}
          </Badge>
        );
      case 'neutral':
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 capitalize">
            {moodData.emotion}
          </Badge>
        );
    }
  };

  // Function to format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="shadow-lg overflow-hidden border-border/40 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/10">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Current Mood
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error && !moodData ? (
          <div className="text-center text-destructive flex flex-col items-center p-4">
            <AlertTriangle className="h-10 w-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-5">
              <div className="bg-primary/10 p-3 rounded-full">
                {getMoodIcon()}
              </div>
              <div>
                <div className="font-medium flex items-center gap-2 mb-1">
                  Current mood: {getMoodBadge()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Recorded at {formatDate(moodData?.created_date)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-primary/80">
                <Info size={16} />
                Reason
              </h4>
              <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-md">
                {moodData?.reason || "No reason provided"}
              </p>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium mb-2 text-primary/80">Intensity Level</h4>
              <div className="w-full bg-secondary/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary/70 to-primary h-3 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${getMoodIntensity(moodData?.emotion) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/20">
              {moodData?.user_id ? `User ID: ${moodData.user_id}` : 'Anonymous User'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
