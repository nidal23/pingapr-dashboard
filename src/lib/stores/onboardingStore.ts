// src/stores/onboardingStore.ts
import { create } from 'zustand';
import { api } from '@/lib/api';
import { OnboardingState, OnboardingStep, UserMapping, ConfigSettings } from '@/types/onboarding';
import { DEFAULT_CONFIG } from '@/utils/onboarding';

interface OnboardingStore extends OnboardingState {
  setStep: (step: OnboardingStep) => void;
  connectGithub: () => Promise<void>;
  connectSlack: () => Promise<void>;
  toggleRepository: (repoId: string, isActive: boolean) => Promise<void>;
  updateRepositories: (repos: string[]) => void;
  updateUserMappings: (mappings: UserMapping[]) => Promise<void>;
  updateConfig: (config: ConfigSettings) => void;
  completeOnboarding: () => Promise<void>;
  fetchOnboardingStatus: () => Promise<void>;
  fetchGithubUsers: () => Promise<string[]>;
  fetchSlackUsers: () => Promise<string[]>;
  fetchGithubRepositories: () => Promise<string[]>;
}

export const useOnboarding = create<OnboardingStore>((set, get) => ({
  currentStep: "welcome",
  isGithubConnected: false,
  isSlackConnected: false,
  selectedRepositories: [],
  userMappings: [],
  configSettings: DEFAULT_CONFIG,
  
  setStep: (step) => set({ currentStep: step }),
  
  fetchOnboardingStatus: async () => {
    try {
      const { data } = await api.get('/onboarding/status');

      console.log('data in onboarding status: ', data);
      
      set({
        isGithubConnected: data.githubConnected,
        isSlackConnected: data.slackConnected,
        selectedRepositories: data.activeRepositories,
        userMappings: data.userMappings.map((mapping: UserMapping) => ({
          githubUsername: mapping.githubUsername,
          slackUserId: mapping.slackUserId,
          isAdmin: mapping.isAdmin
        })),
        configSettings: data.settings || DEFAULT_CONFIG
      });

      // Determine current step based on what's been completed
      if (!data.githubConnected) {
        set({ currentStep: "github" });
      } else if (!data.slackConnected) {
        set({ currentStep: "slack" });
      } else if (data.userMappings.length === 0) {
        set({ currentStep: "user-mapping" });
      } else if (!data.onboardingCompleted) {
        set({ currentStep: "configuration" });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      throw error;
    }
  },
  
  connectGithub: async () => {
    try {
      // Get GitHub auth URL
      const { data } = await api.get('/github/installation-url');
      
      // Redirect to GitHub for authorization
      window.location.href = data.url;
      
      // Note: This function won't complete here as we're redirecting away
      // The isGithubConnected state will be updated when we return and
      // fetch the onboarding status
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      throw error;
    }
  },
  
  connectSlack: async () => {
    try {
      // Get Slack auth URL
      const { data } = await api.get('/slack/auth-url');
      
      // Redirect to Slack for authorization
      window.location.href = data.url;
      
      // Note: This function won't complete here as we're redirecting away
      // The isSlackConnected state will be updated when we return and
      // fetch the onboarding status
    } catch (error) {
      console.error('Error connecting to Slack:', error);
      throw error;
    }
  },
  
  toggleRepository: async (repoId, isActive) => {
    try {
      await api.post('/github/repositories/toggle', {
        repoId,
        isActive
      });
      
      // Update repositories in state
      const { selectedRepositories } = get();
      if (isActive && !selectedRepositories.includes(repoId)) {
        set({ selectedRepositories: [...selectedRepositories, repoId] });
      } else if (!isActive && selectedRepositories.includes(repoId)) {
        set({ selectedRepositories: selectedRepositories.filter(id => id !== repoId) });
      }
    } catch (error) {
      console.error('Error toggling repository:', error);
      throw error;
    }
  },
  
  updateRepositories: (repos) => set({ selectedRepositories: repos }),
  
  updateUserMappings: async (mappings) => {
    try {
      await api.post('/onboarding/user-mappings', { mappings });
      set({ userMappings: mappings });
    } catch (error) {
      console.error('Error updating user mappings:', error);
      throw error;
    }
  },
  
  updateConfig: (config) => set({ configSettings: config }),
  
  completeOnboarding: async () => {
    try {
      const { configSettings } = get();
      
      // Complete onboarding
      await api.post('/onboarding/complete', { settings: configSettings });
      
      // Send invitations to team members
      await api.post('/slack/send-invitations');
      
      set({ currentStep: "completed" });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },
  
  fetchGithubUsers: async () => {
    try {
      const { data } = await api.get('/github/users');
      return data;
    } catch (error) {
      console.error('Error fetching GitHub users:', error);
      throw error;
    }
  },
  
  fetchSlackUsers: async () => {
    try {
      const { data } = await api.get('/slack/users');
      return data;
    } catch (error) {
      console.error('Error fetching Slack users:', error);
      throw error;
    }
  },
  
  fetchGithubRepositories: async () => {
    try {
      const { data } = await api.get('/github/repositories');
      return data;
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      throw error;
    }
  }
}));