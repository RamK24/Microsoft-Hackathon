
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, History, Calendar } from 'lucide-react';
import { EmotionalToneTimeline } from '../dashboard/EmotionalToneTimeline';
import { WeeklySummary } from '../dashboard/WeeklySummary';
import { EmployeeMood } from '../dashboard/EmployeeMood';
import { JobRecommendations } from './JobRecommendations';

// Mock data for the charts
const MOCK_EMOTION_DATA = [
  { date: 'Jan 1', value: 25, rawEmotion: 'negative' as const },
  { date: 'Jan 8', value: 40, rawEmotion: 'negative' as const },
  { date: 'Jan 15', value: 50, rawEmotion: 'neutral' as const },
  { date: 'Jan 22', value: 75, rawEmotion: 'positive' as const },
  { date: 'Jan 29', value: 60, rawEmotion: 'neutral' as const },
  { date: 'Feb 5', value: 80, rawEmotion: 'positive' as const },
  { date: 'Feb 12', value: 90, rawEmotion: 'positive' as const },
];

interface EmployeeDetailTabsProps {
  employee: any;
}

export const EmployeeDetailTabs: React.FC<EmployeeDetailTabsProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="progress" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Progress Tracking</span>
            <span className="sm:hidden">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Meetup History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          {/* Emotional Timeline - Only display the card once */}
          <Card className="transition-all duration-500 ease-in-out hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Emotional Tone Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <EmotionalToneTimeline
                  emotionData={MOCK_EMOTION_DATA}
                  hideCard={true}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>

          <EmployeeMood employeeId='emp-1' />
          <Card className="transition-all duration-500 ease-in-out hover:shadow-md">
            <JobRecommendations employeeId='emp-1' />
          </Card>

        </TabsContent>

        {/* Meetup History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meetup History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Meetup Items */}
                  <div className="border-l-2 border-primary pl-4 py-2 hover:bg-muted/20 rounded-r transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Weekly Check-in</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>March 15, 2023</span>
                          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">30 minutes</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Discussed progress on inventory system training. {employee.name} is grasping the basics well but needs more practice with advanced features.
                    </p>
                  </div>

                  {/* Meetup Item */}
                  <div className="border-l-2 border-primary pl-4 py-2 hover:bg-muted/20 rounded-r transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Monthly Review</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>February 28, 2023</span>
                          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">45 minutes</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reviewed January performance metrics. {employee.name} exceeded customer satisfaction targets but struggled with time management during peak hours.
                    </p>
                  </div>

                  {/* Meetup Item */}
                  <div className="border-l-2 border-primary pl-4 py-2 hover:bg-muted/20 rounded-r transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Initial Assessment</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>January 10, 2023</span>
                          <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">60 minutes</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed initial assessment of support needs and established baseline goals. {employee.name} showed enthusiasm for the role and willingness to learn.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button className="text-sm text-primary font-medium hover:underline focus:outline-none">
                    Load More History
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Weekly Summary with coach's voice at the bottom */}
      <WeeklySummary
        summary="Alex has shown steady improvement in managing workplace anxiety this week. The implementation of regular scheduled breaks has proven effective in maintaining focus during busy periods."
        proudMoment="During a particularly busy shift, Alex demonstrated exceptional composure when assisting a frustrated customer with a complex return. Using the techniques we've been practicing, Alex maintained calm throughout the interaction and successfully processed the return without manager intervention. This represents significant progress in Alex's customer service skills and emotional regulation strategies."
      />
    </div>
  );
};
