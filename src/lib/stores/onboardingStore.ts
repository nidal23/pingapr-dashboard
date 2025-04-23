// src/lib/stores/onboardingStore.ts
import { create } from 'zustand';
import { api } from '@/lib/api';
import { 
  UserMapping, 
  OnboardingStore, 
  GitHubUser,
  SlackUser
} from '@/types/onboarding';
import { Repository, User } from '@/types/database';
import { DEFAULT_CONFIG } from '@/utils/onboarding';

export const useOnboarding = create<OnboardingStore>((set, get) => ({
  currentStep: "welcome",
  isGithubConnected: false,
  isSlackConnected: false,
  selectedRepositories: [],
  userMappings: [],
  configSettings: DEFAULT_CONFIG,
  
  setStep: (step) => set({ currentStep: step }),
  
  fetchCurrentUser: async () => {
    try {
      const { data } = await api.get<User>('/auth/me');
      set({ currentUser: data });
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  fetchOnboardingStatus: async () => {
    try {
      const { data } = await api.get('/onboarding/status');
      
      // Also fetch current user
      let currentUser: User | undefined;
      try {
        currentUser = await get().fetchCurrentUser();
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
      
      // Update the store with the current status
      set({
        isGithubConnected: data.githubConnected,
        isSlackConnected: data.slackConnected,
        selectedRepositories: data.activeRepositories,
        userMappings: data.userMappings.map((mapping: UserMapping) => ({
          githubUsername: mapping.githubUsername,
          slackUserId: mapping.slackUserId,
          isAdmin: mapping.isAdmin,
          avatarUrl: mapping.avatarUrl
        })),
        configSettings: data.settings || DEFAULT_CONFIG,
        currentUser
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      throw error;
    }
  },
  
  connectGithub: async () => {
    try {
      // Get GitHub auth URL
      const { data } = await api.get<{ url: string }>('/github/installation-url');
      
      // Redirect to GitHub for authorization
      window.location.href = data.url;
      
      // Note: This function won't complete here as we're redirecting away
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      throw error;
    }
  },
  
  connectSlack: async () => {
    try {
      // Get Slack auth URL
      const { data } = await api.get<{ url: string }>('/slack/auth-url');
      
      // Redirect to Slack for authorization
      window.location.href = data.url;
      
      // Note: This function won't complete here as we're redirecting away
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
      const { data } = await api.get<GitHubUser[]>('/github/users');
      return data;
    } catch (error) {
      console.error('Error fetching GitHub users:', error);
      throw error;
    }
  },
  
  fetchSlackUsers: async () => {
    try {
      const { data } = await api.get<SlackUser[]>('/slack/users');
      return data;
    } catch (error) {
      console.error('Error fetching Slack users:', error);
      throw error;
    }
  },
  
  fetchGithubRepositories: async () => {
    try {
      const { data } = await api.get<Repository[]>('/github/repositories');
      return data;
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      throw error;
    }
  }
}));