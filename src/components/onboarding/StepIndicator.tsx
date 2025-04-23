import React from "react";
import { Check } from "lucide-react";
import { OnboardingStep } from "@/types/onboarding";

interface StepIndicatorProps {
  steps: { id: OnboardingStep; label: string }[];
  currentStep: OnboardingStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex items-center w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, i) => {
        const isActive = step.id === currentStep;
        const isCompleted = steps.findIndex((s) => s.id === currentStep) > i;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${isActive 
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-md" 
                    : isCompleted 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-muted text-muted-foreground"}
                `}
              >
                {isCompleted ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium mt-2 ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div 
                className={`
                  h-1 flex-1 mx-2
                  ${currentIndex > i 
                    ? "bg-gradient-to-r from-primary to-purple-600" 
                    : "bg-muted"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;