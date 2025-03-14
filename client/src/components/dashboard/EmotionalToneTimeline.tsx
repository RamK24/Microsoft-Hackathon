
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EmotionDataPoint {
  date: string;
  value: number; // 0-100 scale where 0=negative, 50=neutral, 100=positive
  rawEmotion: 'negative' | 'neutral' | 'positive';
}

interface EmotionalToneTimelineProps {
  emotionData: EmotionDataPoint[];
  loading?: boolean;
  hideCard?: boolean;
  className?: string;
}

// Helper to get trend info
const getTrendInfo = (data: EmotionDataPoint[]) => {
  if (data.length < 2) return { icon: Minus, text: 'Neutral', color: 'text-gray-500' };
  
  const lastTwoPoints = [data[data.length - 2], data[data.length - 1]];
  const trend = lastTwoPoints[1].value - lastTwoPoints[0].value;
  
  if (trend > 5) return { icon: TrendingUp, text: 'Improving', color: 'text-green-500' };
  if (trend < -5) return { icon: TrendingDown, text: 'Declining', color: 'text-red-500' };
  return { icon: Minus, text: 'Stable', color: 'text-blue-500' };
};

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EmotionDataPoint;
    let bgColor = 'bg-blue-100 border-blue-300';
    let textColor = 'text-blue-800';
    
    if (data.rawEmotion === 'positive') {
      bgColor = 'bg-green-100 border-green-300';
      textColor = 'text-green-800';
    } else if (data.rawEmotion === 'negative') {
      bgColor = 'bg-red-100 border-red-300';
      textColor = 'text-red-800';
    }
    
    return (
      <div className={`p-2 rounded shadow-sm ${bgColor} border`}>
        <p className="text-sm font-medium">{label}</p>
        <p className={`text-sm ${textColor} font-semibold`}>
          {data.rawEmotion.charAt(0).toUpperCase() + data.rawEmotion.slice(1)}
        </p>
      </div>
    );
  }
  
  return null;
};

export const EmotionalToneTimeline: React.FC<EmotionalToneTimelineProps> = ({ 
  emotionData,
  loading = false,
  hideCard = false,
  className = ''
}) => {
  const trendInfo = getTrendInfo(emotionData);
  
  // Map raw emotions to values for the chart
  const chartData = emotionData.map(point => ({
    ...point,
    value: point.rawEmotion === 'positive' ? 100 : 
           point.rawEmotion === 'neutral' ? 50 : 0
  }));
  
  // Get color based on last emotion
  const getLineColor = () => {
    const lastEmotion = emotionData.length > 0 ? emotionData[emotionData.length - 1].rawEmotion : 'neutral';
    return lastEmotion === 'positive' ? '#22c55e' : 
           lastEmotion === 'negative' ? '#ef4444' : '#3b82f6';
  };
  
  const chartContent = (
    <>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                ticks={[0, 50, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value === 0) return 'Negative';
                  if (value === 50) return 'Neutral';
                  if (value === 100) return 'Positive';
                  return '';
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getLineColor()}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: getLineColor() }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
  
  if (hideCard) {
    return <div className={className}>{chartContent}</div>;
  }
  
  return (
    <Card className={`transition-all duration-500 ease-in-out hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Emotional Tone Timeline</CardTitle>
          <div className={`flex items-center ${trendInfo.color}`}>
            <trendInfo.icon size={16} className="mr-1" />
            <span className="text-sm font-medium">{trendInfo.text}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartContent}
      </CardContent>
    </Card>
  );
};
