// src/hooks/use-usage-warnings.ts - Additional hook for warning logic
import { useMemo } from 'react';
import { useFeatureAccess } from './use-feature-access';

export interface UsageWarning {
  type: 'pr_limit' | 'user_limit' | 'feature_locked' | 'general_upgrade';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  action: string;
  dismissible: boolean;
}

export const useUsageWarnings = () => {
  const {
    usage,
    userCount,
    usagePercentage,
    isOverUserLimit,
    canCreatePR,
    isProfessional
  } = useFeatureAccess();
  
  const warnings = useMemo((): UsageWarning[] => {
    if (isProfessional) return [];
    
    const warningList: UsageWarning[] = [];
    
    // Critical: PR limit reached
    if (usage && !canCreatePR) {
      warningList.push({
        type: 'pr_limit',
        severity: 'critical',
        title: 'PR limit reached',
        message: "You've reached your monthly PR limit. New PRs won't create Slack channels until you upgrade.",
        action: 'Upgrade Now',
        dismissible: false
      });
    }
    // Warning: Near PR limit  
    else if (usage && usagePercentage >= 80) {
      warningList.push({
        type: 'pr_limit',
        severity: 'warning',
        title: `${usage.prCount}/${usage.limit} PRs used this month`,
        message: "You're approaching your monthly limit. Upgrade for unlimited PRs.",
        action: 'Upgrade to Professional',
        dismissible: true
      });
    }
    
    // User limit exceeded
    if (isOverUserLimit) {
      warningList.push({
        type: 'user_limit',
        severity: 'warning',
        title: `${userCount} team members`,
        message: 'Free tier supports up to 5 members. Upgrade to add unlimited team members.',
        action: 'Upgrade Now',
        dismissible: false
      });
    }
    
    // General upgrade prompt (only if no other warnings)
    if (warningList.length === 0 && usage && (usagePercentage > 50 || userCount > 3)) {
      warningList.push({
        type: 'general_upgrade',
        severity: 'info',
        title: 'Unlock advanced features',
        message: 'Get analytics, team insights, and unlimited PRs with Professional.',
        action: 'Upgrade to Professional',
        dismissible: true
      });
    }
    
    return warningList;
  }, [usage, userCount, usagePercentage, isOverUserLimit, canCreatePR, isProfessional]);
  
  return {
    warnings,
    hasWarnings: warnings.length > 0,
    hasCriticalWarnings: warnings.some(w => w.severity === 'critical'),
    hasNonDismissibleWarnings: warnings.some(w => !w.dismissible)
  };
};