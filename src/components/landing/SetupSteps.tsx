// components/landing/SetupSteps.tsx
import React from 'react';
// import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const SetupSteps: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 font-display">Simple Setup</h2>
        <p className="text-center text-muted-foreground mb-12">
          Up and running in less than 15 minutes
        </p>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-12 md:left-1/2 h-full w-0.5 bg-primary/20 -ml-px md:block hidden" />
          
          <div className="space-y-12 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="rounded-full bg-primary h-24 w-24 flex items-center justify-center z-10">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 flex-1">
                <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
                <p className="text-muted-foreground mb-4">
                  Create your account with email. No credit card required to start.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="rounded-full bg-primary h-24 w-24 flex items-center justify-center z-10">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 flex-1">
                <h3 className="text-lg font-semibold mb-2">Connect GitHub</h3>
                <p className="text-muted-foreground mb-4">
                  Authorize our GitHub app to access your repositories.
                </p>
                <div className="flex items-center text-xs text-green-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>We only access PR metadata, never your code</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="rounded-full bg-primary h-24 w-24 flex items-center justify-center z-10">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 flex-1">
                <h3 className="text-lg font-semibold mb-2">Connect Slack</h3>
                <p className="text-muted-foreground mb-4">
                  Add the PingaPR app to your Slack workspace.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="rounded-full bg-primary h-24 w-24 flex items-center justify-center z-10">
                <span className="text-white text-3xl font-bold">4</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 flex-1">
                <h3 className="text-lg font-semibold mb-2">Ready to Go</h3>
                <p className="text-muted-foreground mb-4">
                  Map users and start collaborating. Your PRs are now in Slack!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetupSteps;