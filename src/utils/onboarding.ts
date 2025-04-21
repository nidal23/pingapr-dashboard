//src/utils/onboarding.ts

import { OnboardingState, OnboardingStep, ConfigSettings } from "@/types/onboarding";

export const DEFAULT_CONFIG: ConfigSettings = {
  prReminderHours: 24,
  channelArchiveDays: 7,
};

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStep: "welcome",
  isGithubConnected: false,
  isSlackConnected: false,
  selectedRepositories: [],
  userMappings: [],
  configSettings: DEFAULT_CONFIG,
};

export function nextStep(currentStep: OnboardingStep): OnboardingStep {
  switch (currentStep) {
    case "welcome":
      return "github";
    case "github":
      return "slack";
    case "slack":
      return "user-mapping";
    case "user-mapping":
      return "configuration";
    case "configuration":
      return "completed";
    default:
      return "welcome";
  }
}

export function previousStep(currentStep: OnboardingStep): OnboardingStep {
  switch (currentStep) {
    case "github":
      return "welcome";
    case "slack":
      return "github";
    case "user-mapping":
      return "slack";
    case "configuration":
      return "user-mapping";
    case "completed":
      return "configuration";
    default:
      return "welcome";
  }
}

export function canProceed(state: OnboardingState): boolean {
  switch (state.currentStep) {
    case "welcome":
      return true;
    case "github":
      return state.isGithubConnected && state.selectedRepositories.length > 0;
    case "slack":
      return state.isSlackConnected;
    case "user-mapping":
      return state.userMappings.length > 0;
    case "configuration":
      return true;
    default:
      return false;
  }
}