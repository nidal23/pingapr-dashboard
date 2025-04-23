// src/pages/Onboarding.tsx
import React, { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    currentStep, 
    setStep, 
    fetchOnboardingStatus,
    isGithubConnected,
    isSlackConnected
  } = useOnboarding();

  // Check for URL parameters and initialize onboarding
  useEffect(() => {
    const initializeOnboarding = async () => {
      setIsLoading(true);
      try {
        const step = searchParams.get("step");
        const error = searchParams.get("error");
        const installation_id = searchParams.get("installation_id");
        const code = searchParams.get("code");
        
        // Handle errors
        if (error) {
          toast.error(`Error during setup: ${error.replace(/_/g, ' ')}`);
        }
        
        // Fetch the latest status
        await fetchOnboardingStatus();
        
        // Set appropriate step based on search parameters or OAuth callbacks
        if (step) {
          // If a specific step is requested in the URL, use that
          setStep(step as any);
        } else if (installation_id) {
          // If we're returning from GitHub OAuth flow
          setStep("github");
          if (isGithubConnected) {
            toast.success("GitHub connected successfully!");
          }
        } else if (code) {
          // If we're returning from Slack OAuth flow
          setStep("slack");
          if (isSlackConnected) {
            toast.success("Slack connected successfully!");
          }
        } else if (currentStep === "welcome") {
          // If no specific parameters and we're at welcome,
          // determine initial step based on progress
          determineInitialStep();
        }
      } catch (err) {
        console.error("Failed to initialize onboarding:", err);
        toast.error("Failed to load your setup progress");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeOnboarding();
  }, [searchParams]);

  // Helper function to determine initial step based on onboarding progress
  const determineInitialStep = () => {
    if (!isGithubConnected) {
      setStep("github");
    } else if (!isSlackConnected) {
      setStep("slack");
    } else if (useOnboarding.getState().userMappings.length === 0) {
      setStep("user-mapping");
    } else {
      setStep("configuration");
    }
  };

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
    // Show loading state while fetching onboarding status
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
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