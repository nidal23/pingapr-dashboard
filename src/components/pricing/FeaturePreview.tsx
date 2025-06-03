// src/components/pricing/FeaturePreview.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsageStore } from '@/lib/stores/usageStore';
import { Lock, Zap, ArrowRight } from 'lucide-react';

interface FeaturePreviewProps {
  title: string;
  description: string;
  features: string[];
  previewImage?: string;
  onUpgrade?: () => void;
}

const FeaturePreview = ({ 
  title, 
  description, 
  features, 
  previewImage,
  onUpgrade 
}: FeaturePreviewProps) => {
  const { upgrade } = useUsageStore();
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      upgrade();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 relative">
            <Lock className="w-8 h-8 text-primary" />
            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs px-2 py-1">
              PRO
            </Badge>
          </div>
          <CardTitle className="text-2xl mb-2">{title}</CardTitle>
          <p className="text-muted-foreground text-lg">{description}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {previewImage && (
            <div className="relative">
              <img 
                src={previewImage} 
                alt={`${title} preview`}
                className="w-full rounded-lg border shadow-sm opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg flex items-center justify-center">
                <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                  Preview
                </Badge>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center space-y-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Unlock this feature and all advanced capabilities with Professional
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleUpgrade} className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Zap className="h-4 w-4" />
                Upgrade to Professional
              </Button>
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturePreview;