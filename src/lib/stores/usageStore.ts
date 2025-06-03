// src/lib/stores/usageStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface Usage {
  prCount: number;
  subscription_tier: 'FREE' | 'PROFESSIONAL';
  limit: number | null;
  resetDate?: string;
}

interface UsageStore {
  // State
  usage: Usage | null;
  userCount: number;
  needsUpgrade: boolean;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  fetchUsage: () => Promise<void>;
  upgrade: () => Promise<void>;
  clearError: () => void;
  
  // Helpers
  getUsagePercentage: () => number;
  isNearLimit: (threshold?: number) => boolean;
  canCreatePR: () => boolean;
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      // Initial state
      usage: null,
      userCount: 0,
      needsUpgrade: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      
      // Actions
      fetchUsage: async () => {
        const state = get();
        
        // Avoid excessive API calls - cache for 5 minutes
        const now = Date.now();
        if (state.lastFetched && (now - state.lastFetched) < 5 * 60 * 1000) {
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const { data } = await api.get('/billing/info');
          
          set({
            usage: data.usage,
            userCount: data.userCount,
            needsUpgrade: data.needsUpgrade,
            isLoading: false,
            error: null,
            lastFetched: now
          });
        } catch (error) {
          console.error('Error fetching usage:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch usage data',
            isLoading: false
          });
        }
      },
      
      upgrade: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.post('/billing/checkout');
          
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } catch (error) {
          console.error('Error creating checkout session:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to create checkout session',
            isLoading: false
          });
        }
      },
      
      clearError: () => set({ error: null }),
      
      // Helper methods
      getUsagePercentage: () => {
        const { usage } = get();
        if (!usage || !usage.limit) return 0;
        return Math.min((usage.prCount / usage.limit) * 100, 100);
      },
      
      isNearLimit: (threshold = 80) => {
        const { usage } = get();
        if (!usage || usage.subscription_tier === 'PROFESSIONAL') return false;
        return get().getUsagePercentage() >= threshold;
      },
      
      canCreatePR: () => {
        const { usage } = get();
        if (!usage) return true; // Fail open if no usage data
        if (usage.subscription_tier === 'PROFESSIONAL') return true;
        return usage.prCount < (usage.limit || 50);
      }
    }),
    {
      name: 'usage-storage',
      partialize: (state) => ({
        usage: state.usage,
        userCount: state.userCount,
        needsUpgrade: state.needsUpgrade,
        lastFetched: state.lastFetched
      }),
    }
  )
);