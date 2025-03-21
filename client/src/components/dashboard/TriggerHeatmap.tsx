
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ZAxis 
} from 'recharts';
import { Zap } from 'lucide-react';

interface TriggerDataPoint {
  trigger: string;
  calmness: number; // 0-100 scale
  x: number; // Position on x-axis
  y: number; // Position on y-axis
  z: number; // Size of point (optional)
}

interface TriggerHeatmapProps {
  triggerData: TriggerDataPoint[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Determine color based on calmness value
    const getColorByValue = (value: number) => {
      if (value >= 75) return 'text-green-600';
      if (value >= 50) return 'text-blue-600';
      if (value >= 25) return 'text-orange-600';
      return 'text-red-600';
    };
    
    return (
      <div className="bg-white p-2 rounded shadow-sm border">
        <p className="font-medium">{data.trigger}</p>
        <p className={`font-semibold ${getColorByValue(data.calmness)}`}>
          Calmness: {data.calmness}%
        </p>
      </div>
    );
  }
  return null;
};

export const TriggerHeatmap: React.FC<TriggerHeatmapProps> = ({
  triggerData,
  loading = false
}) => {
  // Get average calmness score
  const avgCalmness = triggerData.reduce((sum, item) => sum + item.calmness, 0) / triggerData.length;
  
  // Map points to correct format for ScatterChart
  const chartData = triggerData.map(point => ({
    ...point,
    // Size is proportional to calmness (inverse - bigger points for lower calmness)
    z: (100 - point.calmness) / 4 + 10 // Scale for better visibility
  }));
  
  // Get color based on average calmness
  const getResilienceLevel = (avgCalmness: number) => {
    if (avgCalmness >= 75) return { text: 'High resilience', color: 'text-green-500' };
    if (avgCalmness >= 50) return { text: 'Moderate resilience', color: 'text-blue-500' };
    if (avgCalmness >= 25) return { text: 'Building resilience', color: 'text-orange-500' };
    return { text: 'Developing resilience', color: 'text-red-500' };
  };
  
  const resilienceLevel = getResilienceLevel(avgCalmness);
  
  return (
    <Card className="transition-all duration-500 ease-in-out hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Trigger Response Map</CardTitle>
          <div className={`flex items-center ${resilienceLevel.color}`}>
            <Zap size={16} className="mr-1" />
            <span className="text-sm font-medium">{resilienceLevel.text}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid opacity={0.1} />
                <XAxis
                  type="category"
                  dataKey="trigger"
                  name="Trigger"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="calmness"
                  name="Calmness"
                  unit="%"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="z" range={[10, 40]} />
                <Tooltip cursor={false} content={<CustomTooltip />} />
                <Scatter
                  name="Triggers"
                  data={chartData}
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
