import React from "react";
import { OnboardingStep } from "@/types/onboarding";
import StepIndicator from "@/components/onboarding/StepIndicator";
import { GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: OnboardingStep;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, currentStep }) => {
  // Fix: Explicitly type the steps array to ensure ids match the OnboardingStep type
  const steps: { id: OnboardingStep; label: string }[] = [
    { id: "welcome", label: "Welcome" },
    { id: "github", label: "GitHub" },
    { id: "slack", label: "Slack" },
    { id: "user-mapping", label: "Users" },
    { id: "configuration", label: "Config" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements contained within the viewport */}
      <div className="fixed top-[5%] left-[5%] w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[5%] right-[5%] w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-md flex items-center justify-center">
              <GitPullRequest size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">PingaPR</h1>
          <Badge variant="outline" className="mt-2">Beta</Badge>
          <p className="text-muted-foreground mt-2">Setup Wizard</p>
        </div>
        
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;