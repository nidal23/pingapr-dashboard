// src/components/pricing/UsageBanner.tsx
import { useEffect } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUsageStore } from '@/lib/stores/usageStore';
import { AlertTriangle, Zap, X } from 'lucide-react';
import { useState } from 'react';

const UsageBanner = () => {
  const { usage, userCount, needsUpgrade, fetchUsage, upgrade } = useUsageStore();
  const [isDismissed, setIsDismissed] = useState(false);
  
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);
  
  // Don't show for professional users
  if (!usage || usage.tier === 'PROFESSIONAL') return null;
  
  // Don't show if dismissed and usage is low
  if (isDismissed && !needsUpgrade) return null;
  
  const usagePercent = usage.limit ? (usage.prCount / usage.limit) * 100 : 0;
  const isNearLimit = usagePercent >= 80;
  const isOverUserLimit = userCount > 5;
  
  // Only show if there's something worth showing
  if (!isNearLimit && !isOverUserLimit && !needsUpgrade) return null;
  
  const getAlertVariant = () => {
    if (usagePercent >= 95 || isOverUserLimit) return 'destructive';
    if (isNearLimit) return 'default';
    return 'default';
  };
  
  const getMessage = () => {
    if (usagePercent >= 100) {
      return {
        title: "PR limit reached",
        description: "You've reached your monthly limit. New PRs won't create Slack channels until you upgrade."
      };
    }
    if (isNearLimit) {
      return {
        title: `${usage.prCount}/${usage.limit} PRs used this month`,
        description: "You're approaching your monthly limit. Upgrade for unlimited PRs."
      };
    }
    if (isOverUserLimit) {
      return {
        title: `${userCount} team members`,
        description: "Free tier supports up to 5 members. Upgrade to add unlimited team members."
      };
    }
    return {
      title: "Unlock advanced features",
      description: "Upgrade to Professional for analytics, team insights, and unlimited PRs."
    };
  };
  
  const { title, description } = getMessage();
  
  return (
    <Alert className={`mb-6 relative ${getAlertVariant() === 'destructive' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{title}</span>
            <Badge variant="outline" className="text-xs">
              Free Plan
            </Badge>
          </div>
          
          {usage.limit && usagePercent > 0 && (
            <Progress 
              value={Math.min(usagePercent, 100)} 
              className="w-full max-w-xs mb-2 h-2" 
            />
          )}
          
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
          
          <div className="flex items-center gap-2">
            <Button onClick={upgrade} size="sm" className="gap-2">
              <Zap className="h-3 w-3" />
              Upgrade to Professional
            </Button>
            {!needsUpgrade && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDismissed(true)}
                className="text-xs"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
        
        {!needsUpgrade && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="p-1 h-auto w-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default UsageBanner;
