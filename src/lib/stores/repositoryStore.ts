// src/lib/stores/repositoryStore.ts
import { create } from 'zustand';
import { dashboardApi } from '@/lib/api/dashboard';

interface Repository {
  id: string;
  github_repo_id: number;
  github_repo_name: string;
  is_active: boolean;
}

interface RepositoryStore {
  // State
  isLoading: boolean;
  error: string | null;
  repositories: Repository[];
  
  // Actions
  fetchRepositories: () => Promise<void>;
  clearError: () => void;
}

export const useRepositoryStore = create<RepositoryStore>((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  repositories: [],
  
  // Actions
  fetchRepositories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const repositories = await dashboardApi.fetchRepositories();
      set({ repositories, isLoading: false });
    } catch (err) {
      console.error('Error fetching repositories:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch repositories',
        isLoading: false 
      });
    }
  },
  
  clearError: () => set({ error: null })
}));