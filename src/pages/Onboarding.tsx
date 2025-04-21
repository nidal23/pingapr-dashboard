// src/pages/Onboarding.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import GithubStep from "@/components/onboarding/GithubStep";
import SlackStep from "@/components/onboarding/SlackStep";
import UserMappingStep from "@/components/onboarding/UserMappingStep";
import ConfigurationStep from "@/components/onboarding/ConfigurationStep";
import { useOnboarding } from "@/lib/stores/onboardingStore";
import { toast } from "sonner";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    currentStep, 
    setStep, 
    fetchOnboardingStatus 
  } = useOnboarding();

  // Check for URL parameters (for OAuth callbacks)
  useEffect(() => {
    const step = searchParams.get("step");
    const error = searchParams.get("error");
    
    // Handle errors
    if (error) {
      toast.error(`Error during setup: ${error.replace(/_/g, ' ')}`);
    }
    
    // Set step from URL if present
    if (step) {
      setStep(step as any);
    }
    
    // Always fetch the latest status
    fetchOnboardingStatus().catch(err => {
      console.error("Failed to fetch onboarding status:", err);
      toast.error("Failed to load your setup progress");
    });
  }, [searchParams]);

  const handleNext = () => {
    if (currentStep === "welcome") setStep("github");
    else if (currentStep === "github") setStep("slack");
    else if (currentStep === "slack") setStep("user-mapping");
    else if (currentStep === "user-mapping") setStep("configuration");
    else if (currentStep === "configuration") navigate("/dashboard");
  };

  const handlePrev = () => {
    if (currentStep === "github") setStep("welcome");
    else if (currentStep === "slack") setStep("github");
    else if (currentStep === "user-mapping") setStep("slack");
    else if (currentStep === "configuration") setStep("user-mapping");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep onNext={handleNext} />;
      case "github":
        return (
          <GithubStep
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case "slack":
        return (
          <SlackStep
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case "user-mapping":
        return (
          <UserMappingStep
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case "configuration":
        return (
          <ConfigurationStep
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      {renderStep()}
    </OnboardingLayout>
  );
};

export default Onboarding;