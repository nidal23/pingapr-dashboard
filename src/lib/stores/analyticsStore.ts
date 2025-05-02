// src/lib/stores/analyticsStore.ts
import { create } from 'zustand';
import { dashboardApi } from '@/lib/api/dashboard';
import { 
  AnalyticsDashboardData,
  TimePeriod, 
  RepositoryFilter
} from '@/types/dashboard';

interface AnalyticsStore {
  // State
  isLoading: boolean;
  error: string | null;
  data: AnalyticsDashboardData | null;
  selectedTimePeriod: TimePeriod;
  selectedRepository: RepositoryFilter;
  
  // Actions
  fetchAnalyticsData: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  setRepository: (repoId: RepositoryFilter) => void;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,
  data: null,
  selectedTimePeriod: 'monthly',
  selectedRepository: null,
  
  // Actions
  fetchAnalyticsData: async () => {
    const { selectedTimePeriod, selectedRepository } = get();
    set({ isLoading: true, error: null });
    
    try {
      const data = await dashboardApi.fetchAnalyticsData(selectedTimePeriod, selectedRepository);
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
  
  setRepository: (repoId) => {
    set({ selectedRepository: repoId });
    get().fetchAnalyticsData();
  },
  
  clearError: () => set({ error: null })
}));