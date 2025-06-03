// src/hooks/use-feature-access.ts
import { useEffect } from 'react';
import { useUsageStore } from '@/lib/stores/usageStore';

export interface FeatureAccess {
  // Full access features (completely locked for free users)
  canAccessAnalytics: boolean;
  canAccessCollaboration: boolean;
  
  // Always available features
  canAccessDashboard: boolean;
  canAccessStandup: boolean;
  
  // Partial access features (limited functionality for free users)
  canViewTeams: boolean;
  canCreateTeams: boolean;
  canManageTeams: boolean;
  
  // Plan information
  isProfessional: boolean;
  isFree: boolean;
  currentTier: 'FREE' | 'PROFESSIONAL';
  
  // Usage information
  usage: {
    prCount: number;
    limit: number | null;
    subscription_tier: 'FREE' | 'PROFESSIONAL';
    resetDate?: string;
  } | null;
  userCount: number;
  
  // Usage helpers
  usagePercentage: number;
  isNearLimit: boolean;
  isOverUserLimit: boolean;
  canCreatePR: boolean;
  needsUpgrade: boolean;
  
  // Actions
  fetchUsage: () => Promise<void>;
  upgrade: () => Promise<void>;
}

export const useFeatureAccess = (): FeatureAccess => {
  const {
    usage,
    userCount,
    needsUpgrade,
    fetchUsage,
    upgrade,
    getUsagePercentage,
    isNearLimit,
    canCreatePR
  } = useUsageStore();

  console.log('usage: ', usage)
  
  // Auto-fetch usage data when hook is used
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);
  
  // Determine plan status
  const isProfessional = usage?.subscription_tier === 'PROFESSIONAL';
  const isFree = usage?.subscription_tier === 'FREE' || !usage;
  const currentTier = usage?.subscription_tier || 'FREE';

  console.log('isProfessional: ', isProfessional)
  
  // Feature access rules
  const canAccessAnalytics = isProfessional;
  const canAccessCollaboration = isProfessional;
  const canViewTeams = true; // Everyone can view teams and members
  const canCreateTeams = isProfessional;
  const canManageTeams = isProfessional;
  
  // Always available features
  const canAccessDashboard = true;
  const canAccessStandup = true;
  
  // Usage calculations
  const usagePercentage = getUsagePercentage();
  const isOverUserLimit = userCount > 5 && isFree;
  
  return {
    // Feature access
    canAccessAnalytics,
    canAccessCollaboration,
    canAccessDashboard,
    canAccessStandup,
    canViewTeams,
    canCreateTeams,
    canManageTeams,
    
    // Plan info
    isProfessional,
    isFree,
    currentTier,
    
    // Usage info
    usage,
    userCount,
    usagePercentage,
    isNearLimit: isNearLimit(),
    isOverUserLimit,
    canCreatePR: canCreatePR(),
    needsUpgrade,
    
    // Actions
    fetchUsage,
    upgrade
  };
};
