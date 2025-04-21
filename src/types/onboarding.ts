//src/types/onboarding.ts
export type OnboardingStep = 
  | "welcome" 
  | "github"
  | "slack" 
  | "user-mapping" 
  | "configuration" 
  | "completed";

export interface OnboardingState {
  currentStep: OnboardingStep;
  isGithubConnected: boolean;
  isSlackConnected: boolean;
  selectedRepositories: string[];
  userMappings: UserMapping[];
  configSettings: ConfigSettings;
}

export interface UserMapping {
  githubUsername: string;
  slackUserId: string;
  isAdmin: boolean;
  avatarUrl?: string;
}

export interface ConfigSettings {
  prReminderHours: number;
  channelArchiveDays: number;
}