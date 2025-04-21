
import React from "react";
import { OnboardingStep } from "@/types/onboarding";
import StepIndicator from "@/components/onboarding/StepIndicator";

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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">PingaPR Insight Bridge</h1>
          <p className="text-muted-foreground">Setup Wizard</p>
        </div>
        
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;