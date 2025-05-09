// src/lib/stores/standupStore.ts
import { create } from 'zustand';
import { dashboardApi } from '@/lib/api/dashboard';
import { 
  StandupDashboardData, 
  TimePeriod, 
  RepositoryFilter,
  TeamId,
  DiscussionPoint
} from '@/types/dashboard';

interface StandupStore {
  // State
  isLoading: boolean;
  error: string | null;
  data: StandupDashboardData | null;
  selectedTimePeriod: TimePeriod;
  selectedTeamId: TeamId;
  selectedRepository: RepositoryFilter;
  focusMode: boolean;
  
  // Actions
  fetchStandupData: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  setRepository: (repoId: RepositoryFilter) => void;
  setTeamId: (teamId: TeamId) => void;
  toggleFocusMode: () => void;
  addDiscussionPoint: (point: Omit<DiscussionPoint, 'id' | 'created_at'>) => Promise<void>;
  removeDiscussionPoint: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useStandupStore = create<StandupStore>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,
  data: null,
  selectedTimePeriod: 'daily',
  selectedTeamId: '',
  selectedRepository: null,
  focusMode: false,
  
  // Actions
  fetchStandupData: async () => {
    const { selectedTimePeriod, selectedRepository, selectedTeamId } = get();
    set({ isLoading: true, error: null });
    
    try {
      const data = await dashboardApi.fetchStandupData(selectedTimePeriod, selectedRepository, selectedTeamId);
      set({ data, isLoading: false });
    } catch (err) {
      console.error('Error fetching standup data:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch standup data',
        isLoading: false 
      });
    }
  },
  
  setTimePeriod: (period) => {
    set({ selectedTimePeriod: period });
    get().fetchStandupData();
  },


  setTeamId: (teamId) => {
    set({ selectedTeamId: teamId });
    get().fetchStandupData();
  },
  
  setRepository: (repoId) => {
    set({ selectedRepository: repoId });
    get().fetchStandupData();
  },
  
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  
  addDiscussionPoint: async (point) => {
    try {
      const newPoint = await dashboardApi.saveDiscussionPoint(point);
      set((state) => ({
        data: state.data ? {
          ...state.data,
          discussionPoints: [...state.data.discussionPoints, newPoint]
        } : null
      }));
    } catch (err) {
      console.error('Error adding discussion point:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to add discussion point'
      });
    }
  },
  
  removeDiscussionPoint: async (id) => {
    try {
      await dashboardApi.deleteDiscussionPoint(id);
      set((state) => ({
        data: state.data ? {
          ...state.data,
          discussionPoints: state.data.discussionPoints.filter(point => point.id !== id)
        } : null
      }));
    } catch (err) {
      console.error('Error removing discussion point:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to remove discussion point'
      });
    }
  },
  
  clearError: () => set({ error: null })
}));