
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RelationshipMetric {
  name: string;
  value: number;
  color: string;
}

interface RelationshipTrustStrengthProps {
  metrics: RelationshipMetric[];
  loading?: boolean;
}

export const RelationshipTrustStrength: React.FC<RelationshipTrustStrengthProps> = ({
  metrics,
  loading = false
}) => {
  const isMobile = useIsMobile();
  
  // Calculate overall average to show summary
  const overallScore = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  
  // Get text description based on overall score
  const getRelationshipDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Developing';
    return 'Needs attention';
  };
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow-sm border text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="font-semibold" style={{ color: data.color }}>
            {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="h-full transition-all duration-500 ease-in-out hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Relationship & Trust</CardTitle>
          <div className="flex items-center text-pink-500">
            <Heart size={16} className="mr-1 fill-pink-500" />
            <span className="text-sm font-medium">
              {getRelationshipDescription(overallScore)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={metrics}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 55}
                    outerRadius={isMobile ? 60 : 75}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="rgba(255, 255, 255, 0.5)"
                  >
                    {metrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend as horizontal list below the chart */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: metric.color }}
                  />
                  <span className="text-xs">
                    {metric.name}: <strong>{metric.value}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
