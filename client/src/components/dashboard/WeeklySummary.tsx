
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Award, Star, Trophy, Heart, ThumbsUp } from 'lucide-react';

interface WeeklySummaryProps {
  summary: string;
  proudMoment: string;
  loading?: boolean;
  date?: string;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  summary,
  proudMoment,
  loading = false,
  date = 'This week'
}) => {
  return (
    <Card className="transition-all duration-500 ease-in-out hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Weekly Insights</CardTitle>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-full min-h-[200px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Lightbulb size={18} className="text-amber-500 mr-2" />
                <h3 className="font-medium">Insightful Summary</h3>
              </div>
              <p className="text-muted-foreground pl-6">{summary}</p>
            </div>
            
            {/* Coach's Voice Proud Moment section with professional cheerful design */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Award size={18} className="text-blue-500 mr-2" />
                <h3 className="font-medium text-blue-700">Proud Moment Highlight</h3>
                <Heart size={16} className="text-blue-400 ml-2" />
              </div>
              <div className="pl-6 p-4 rounded-md border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <ThumbsUp size={20} className="text-blue-500" />
                </div>
                <div className="relative">
                  <p className="text-gray-700 italic leading-relaxed">
                    I'm particularly proud of Alex's progress this week. {proudMoment}
                  </p>
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Star size={12} className="mr-1" />
                    Notable Achievement
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
