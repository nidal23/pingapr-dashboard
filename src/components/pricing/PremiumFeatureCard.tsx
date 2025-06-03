// src/components/pricing/PremiumFeatureCard.tsx - For partial restrictions
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsageStore } from '@/lib/stores/usageStore';
import { Lock, Zap } from 'lucide-react';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  isPremium?: boolean;
}

const PremiumFeatureCard = ({ 
  title, 
  description, 
  children, 
  isPremium = true 
}: PremiumFeatureCardProps) => {
  const { upgrade } = useUsageStore();
  
  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-dashed border-2 border-primary/30 mb-2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
            PRO
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Available in Professional plan
          </p>
          <Button onClick={upgrade} size="sm" className="gap-2">
            <Zap className="h-3 w-3" />
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatureCard;