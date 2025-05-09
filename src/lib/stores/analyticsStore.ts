// src/lib/stores/analyticsStore.ts
import { create } from 'zustand';
import { dashboardApi } from '@/lib/api/dashboard';
import { 
  AnalyticsDashboardData,
  TimePeriod, 
  TeamId,
  RepositoryFilter
} from '@/types/dashboard';

interface AnalyticsStore {
  // State
  isLoading: boolean;
  error: string | null;
  data: AnalyticsDashboardData | null;
  selectedTimePeriod: TimePeriod;
  selectedTeamId: TeamId;
  selectedRepository: RepositoryFilter;
  
  // Actions
  fetchAnalyticsData: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  setRepository: (repoId: RepositoryFilter) => void;
  setTeamId: (teamId: TeamId) => void;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,
  data: null,
  selectedTimePeriod: 'monthly',
  selectedTeamId: '',
  selectedRepository: null,
  
  // Actions
  fetchAnalyticsData: async () => {
  const { selectedTimePeriod, selectedRepository, selectedTeamId } = get();
  set({ isLoading: true, error: null });
  
  try {
    // Build query parameters for the API request
    const params = new URLSearchParams();
    params.append('period', selectedTimePeriod);
    if (selectedRepository) params.append('repoId', selectedRepository);
    if (selectedTeamId) params.append('teamId', selectedTeamId);
    
    const data = await dashboardApi.fetchAnalyticsData(
      selectedTimePeriod, 
      selectedRepository,
      selectedTeamId
    );
    set({ data, isLoading: false });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    set({ 
      error: err instanceof Error ? err.message : 'Failed to fetch analytics data',
      isLoading: false 
    });
  }
},
  
  setTimePeriod: (period) => {
    set({ selectedTimePeriod: period });
    get().fetchAnalyticsData();
  },

  setTeamId: (teamId) => {
    set({ selectedTeamId: teamId });
    get().fetchAnalyticsData();
  },
  
  setRepository: (repoId) => {
    set({ selectedRepository: repoId });
    get().fetchAnalyticsData();
  },
  
  clearError: () => set({ error: null })
}));