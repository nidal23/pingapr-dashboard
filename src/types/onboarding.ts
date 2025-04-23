// src/types/onboarding.ts

import { User, Repository } from './database';

export type OnboardingStep = 'welcome' | 'github' | 'slack' | 'user-mapping' | 'configuration' | 'completed';

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

export interface GitHubUser {
  username?: string;
  login?: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  avatarUrl?: string;
}

export interface SlackUser {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  isGithubConnected: boolean;
  isSlackConnected: boolean;
  selectedRepositories: string[];
  userMappings: UserMapping[];
  configSettings: ConfigSettings;
  currentUser?: User; // Reference to the logged-in user
}

export interface OnboardingStore extends OnboardingState {
  setStep: (step: OnboardingStep) => void;
  fetchCurrentUser: () => Promise<User>;
  connectGithub: () => Promise<void>;
  connectSlack: () => Promise<void>;
  toggleRepository: (repoId: string, isActive: boolean) => Promise<void>;
  updateRepositories: (repos: string[]) => void;
  updateUserMappings: (mappings: UserMapping[]) => Promise<void>;
  updateConfig: (config: ConfigSettings) => void;
  completeOnboarding: () => Promise<void>;
  fetchOnboardingStatus: () => Promise<string>;
  fetchGithubUsers: () => Promise<GitHubUser[]>;
  fetchSlackUsers: () => Promise<SlackUser[]>;
  fetchGithubRepositories: () => Promise<Repository[]>;
}