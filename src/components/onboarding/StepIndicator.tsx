//src/components/onboarding/StepIndicator.tsx
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
                className={`step-indicator ${
                  isActive
                    ? "step-indicator-active"
                    : isCompleted
                    ? "step-indicator-completed"
                    : "step-indicator-upcoming"
                }`}
              >
                {isCompleted ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium mt-2 ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`step-connector ${
                  currentIndex > i ? "step-connector-active" : ""
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;