// components/landing/DashboardPreview.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardPreviewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode; // This will contain the actual dashboard component
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}) => {
  return (
    <Card className="shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex-grow">
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden shadow-sm h-full">
          {/* Dashboard preview with scaled-down version of the actual component */}
          <div className="transform scale-[0.65] origin-top-left h-[460px] w-[153.8%] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardPreview;