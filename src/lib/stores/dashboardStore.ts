// src/lib/stores/dashboardStore.ts
import { create } from 'zustand';
import { dashboardApi } from '@/lib/api/dashboard';
import { DashboardData } from '@/types/dashboard';

// RepositoryActivity, RecentPR, WeeklyActivity

interface DashboardStore {
  // State
  isLoading: boolean;
  error: string | null;
  data: DashboardData | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  data: null,
  
  // Actions
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dashboardApi.fetchDashboardData();
      set({ data, isLoading: false });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch dashboard data',
        isLoading: false 
      });
    }
  },
  
  clearError: () => set({ error: null })
}));