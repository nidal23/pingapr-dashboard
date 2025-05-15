// components/landing/ValueProposition.tsx
import React from 'react';
import { Coffee, Clock, Zap } from "lucide-react";

const ValueProposition: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6 font-display">Stop context switching between GitHub and Slack</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Context switching costs developers up to 30 minutes of productivity each time. 
          PingaPR eliminates this productivity drain by bringing GitHub right into Slack.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Coffee className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">Stay Focused</h3>
            <p className="text-center text-muted-foreground">
              Review PRs without leaving your team's conversation flow
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">Save Time</h3>
            <p className="text-center text-muted-foreground">
              Approve and comment on PRs directly from Slack
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">Perfect Sync</h3>
            <p className="text-center text-muted-foreground">
              All comments are synchronized between GitHub and Slack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;