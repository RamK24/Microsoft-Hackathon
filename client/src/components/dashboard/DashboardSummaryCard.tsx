
import React, { ReactNode } from 'react';
import { Card, CardContent } from '../ui/card';

interface DashboardSummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
