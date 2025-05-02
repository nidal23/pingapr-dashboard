// src/lib/stores/collaborationStore.ts
import { create } from 'zustand';
import { dashboardApi } from '@/lib/api/dashboard';
import { 
  CollaborationDashboardData,
  TimePeriod, 
  RepositoryFilter
} from '@/types/dashboard';

interface CollaborationStore {
  // State
  isLoading: boolean;
  error: string | null;
  data: CollaborationDashboardData | null;
  selectedTimePeriod: TimePeriod;
  selectedRepository: RepositoryFilter;
  
  // Actions
  fetchCollaborationData: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  setRepository: (repoId: RepositoryFilter) => void;
  clearError: () => void;
}

export const useCollaborationStore = create<CollaborationStore>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,
  data: null,
  selectedTimePeriod: 'monthly',
  selectedRepository: null,
  
  // Actions
  fetchCollaborationData: async () => {
    const { selectedTimePeriod, selectedRepository } = get();
    set({ isLoading: true, error: null });
    
    try {
      const data = await dashboardApi.fetchCollaborationData(selectedTimePeriod, selectedRepository);
      set({ data, isLoading: false });
    } catch (err) {
      console.error('Error fetching collaboration data:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch collaboration data',
        isLoading: false 
      });
    }
  },
  
  setTimePeriod: (period) => {
    set({ selectedTimePeriod: period });
    get().fetchCollaborationData();
  },
  
  setRepository: (repoId) => {
    set({ selectedRepository: repoId });
    get().fetchCollaborationData();
  },
  
  clearError: () => set({ error: null })
}));