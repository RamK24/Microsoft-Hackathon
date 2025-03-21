import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const sampleEmotions: EmotionData[] = [
    { user_id: 1, reason: "Achieved a goal", emotion: "excited", created_date: "2025-03-20T10:30:00Z" },
    { user_id: 2, reason: "Had a normal day", emotion: "neutral", created_date: "2025-04-19T14:45:00Z" },
    { user_id: 3, reason: "Lost an important document", emotion: "sad", created_date: "2025-05-18T08:15:00Z" }
];

export const EmotionsList: React.FC = () => {
    const [emotions, setEmotions] = useState<EmotionData[]>(sampleEmotions);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<'timeline' | 'summary'>('timeline');
    const { toast } = useToast();

    const fetchEmotions = async () => {
        try {
            const cachedData = localStorage.getItem('emotionsData');
            const cachedTimestamp = localStorage.getItem('emotionsTimestamp');
            const currentTimestamp = new Date().getTime();

            // Check if the data is cached and still valid (e.g., within 5 minutes)
            if (cachedData && cachedTimestamp && currentTimestamp - parseInt(cachedTimestamp) < 5 * 60 * 1000) {
                setEmotions(JSON.parse(cachedData));  // Use cached data if available
                setLoading(false);
                return;
            }

            const response = await axios.get<EmotionResponse>('http://127.0.0.1:8000/emotions');
            if (response.data.status === 'success') {
                setEmotions(response.data.data);
                localStorage.setItem('emotionsData', JSON.stringify(response.data.data));  // Cache the data
                localStorage.setItem('emotionsTimestamp', currentTimestamp.toString());  // Cache the timestamp
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch emotions data",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error fetching emotions:', error);
            toast({
                title: "Connection Error",
                description: "Unable to reach the emotions API",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmotions();
    }, []);

    const getEmotionColor = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case 'excited':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'neutral':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'negative':
            case 'sad':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEmotionScore = (emotion: string): number => {
        switch (emotion.toLowerCase()) {
            case 'excited':
                return 1;
            case 'neutral':
                return 0;
            case 'negative':
            case 'sad':
                return -1;
            default:
                return 0;
        }
    };

    const getEmotionLineColor = (emotion: string): string => {
        switch (emotion.toLowerCase()) {
            case 'excited':
                return '#22c55e'; // green-500
            case 'neutral':
                return '#3b82f6'; // blue-500 
            case 'negative':
            case 'sad':
                return '#ef4444'; // red-500
            default:
                return '#8884d8'; // default purple
        }
    };

    const formatDateForDisplay = (date: Date, allDates: Date[]): string => {
        // Check if all dates are in the same week
        const allInSameWeek = allDates.every(d => isSameWeek(d, date));

        // Check if all dates are in the same month but different weeks
        const allInSameMonth = allDates.every(d => isSameMonth(d, date) && isSameYear(d, date));

        // Format based on timeframe context
        if (allInSameWeek) {
            // If all dates are in the same week, show day names
            return format(date, 'EEEE'); // Monday, Tuesday, etc.
        } else if (allInSameMonth) {
            // If all dates are in the same month but different weeks, show day and date
            return format(date, 'MMM d'); // Jan 15, etc.
        } else {
            // Different months, show month and year
            return format(date, 'MMM yyyy'); // Jan 2025, etc.
        }
    };

    const prepareTimelineData = () => {
        if (!emotions.length) return [];

        // First, convert all emotions to data points with dates and scores
        const dataPoints = emotions.map(emotion => ({
            date: parseISO(emotion.created_date),
            score: getEmotionScore(emotion.emotion),
            emotion: emotion.emotion,
            reason: emotion.reason,
            originalDate: emotion.created_date,
            formattedDate: ''
        })).sort((a, b) => a.date.getTime() - b.date.getTime());

        // Extract all dates for context-aware formatting
        const allDates = dataPoints.map(point => point.date);

        // Format dates based on context
        dataPoints.forEach(point => {
            point.formattedDate = formatDateForDisplay(point.date, allDates);
        });

        return dataPoints;
    };

    const getUniqueEmotions = () => {
        if (!emotions.length) return [];

        const uniqueMap = new Map();
        emotions.forEach(emotion => {
            if (!uniqueMap.has(emotion.emotion)) {
                uniqueMap.set(emotion.emotion, {
                    emotion: emotion.emotion,
                    reason: emotion.reason,
                    created_date: emotion.created_date
                });
            }
        });

        return Array.from(uniqueMap.values());
    };

    const chartData = prepareTimelineData();
    const uniqueEmotions = getUniqueEmotions();

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border rounded shadow-md">
                    <p className="font-medium">{format(data.date, 'MMMM d, yyyy')}</p>
                    <p className="text-sm font-medium capitalize">{data.emotion}</p>
                    <p className="text-xs mt-1 max-w-[200px] text-muted-foreground">{data.reason}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="shadow-md overflow-hidden border border-border/40 bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-2 border-b border-border/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Emotion Analysis
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <Tabs
                            defaultValue="timeline"
                            onValueChange={(value) => setSelectedView(value as 'timeline' | 'summary')}
                        >
                            <TabsList className="bg-muted/50 p-1 rounded-lg">
                                <TabsTrigger
                                    value="timeline"
                                    className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-md transition-all duration-200"
                                >
                                    Timeline
                                </TabsTrigger>
                                <TabsTrigger
                                    value="summary"
                                    className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-md transition-all duration-200"
                                >
                                    Summary
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : emotions.length === 0 ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <p className="text-muted-foreground">No emotion data available</p>
                    </div>
                ) : (
                    <>
                        {selectedView === 'timeline' && (
                            <div className="h-[350px] mt-4 transition-all duration-500 animate-fade-in">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis
                                            dataKey="formattedDate"
                                            type="category"
                                            tick={{ fill: '#888', fontSize: 12 }}
                                            tickLine={{ stroke: '#888' }}
                                            axisLine={{ stroke: '#888', strokeWidth: 1 }}
                                            padding={{ left: 10, right: 10 }}
                                        />
                                        <YAxis
                                            domain={[-1, 1]}
                                            ticks={[-1, 0, 1]}
                                            tickFormatter={(value) => {
                                                if (value === 1) return 'Excited';
                                                if (value === 0) return 'Neutral';
                                                if (value === -1) return 'Negative';
                                                return '';
                                            }}
                                            tick={{ fill: '#888', fontSize: 12 }}
                                            tickLine={{ stroke: '#888' }}
                                            axisLine={{ stroke: '#888', strokeWidth: 1 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            dot={({ cx, cy, payload }) => (
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={5}
                                                    fill={getEmotionLineColor(payload.emotion)}
                                                />
                                            )}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {selectedView === 'summary' && (
                            <div className="h-[350px] mt-4 transition-all duration-500 animate-fade-in">
                                <div className="space-y-4">
                                    {uniqueEmotions.map((emotion, index) => (
                                        <div
                                            key={index}
                                            className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:bg-accent/10"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                                animation: 'fade-in 0.5s ease-out forwards'
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-muted-foreground mb-2">{emotion.reason}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        First recorded: {format(parseISO(emotion.created_date), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                                <Badge className={getEmotionColor(emotion.emotion)}>
                                                    {emotion.emotion}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
