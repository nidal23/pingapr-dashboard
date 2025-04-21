// src/components/onboarding/ConfigurationStep.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, Settings, Loader2 } from "lucide-react";
import { useOnboarding } from "@/lib/stores/onboardingStore";
import { toast } from "sonner";

interface ConfigurationStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  onNext,
  onPrev,
}) => {
  const { configSettings, updateConfig, completeOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize default settings
  const [localConfig, setLocalConfig] = useState<{
    prReminderHours: number;
    channelArchiveDays: number;
  }>({
    prReminderHours: configSettings?.prReminderHours || 24,
    channelArchiveDays: configSettings?.channelArchiveDays || 7,
  });

  // Update local config when store values change
  useEffect(() => {
    if (configSettings) {
      setLocalConfig({
        prReminderHours: configSettings.prReminderHours || 24,
        channelArchiveDays: configSettings.channelArchiveDays || 7,
      });
    }
  }, [configSettings]);

  const handleSliderChange = (key: keyof typeof localConfig, value: number[]) => {
    const updatedConfig = {
      ...localConfig,
      [key]: value[0]
    };
    setLocalConfig(updatedConfig);
    updateConfig(updatedConfig);
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await completeOnboarding();
      toast.success("Setup completed successfully! Invitations sent to team members.");
      onNext();
    } catch (error) {
      console.error('Error completing setup:', error);
      toast.error('Failed to complete setup. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Configure Settings</CardTitle>
          <CardDescription>
            Customize how PingaPR works with your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">PR Reminder Time</h3>
                <p className="text-sm text-muted-foreground">
                  When should we remind about pending reviews? (in hours)
                </p>
              </div>
              <div className="md:w-1/3">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[localConfig.prReminderHours]}
                    min={1}
                    max={72}
                    step={1}
                    onValueChange={(value) => handleSliderChange("prReminderHours", value)}
                    disabled={isSubmitting}
                  />
                  <span className="font-medium w-12 text-center">{localConfig.prReminderHours}h</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">Channel Archive Time</h3>
                <p className="text-sm text-muted-foreground">
                  When should we archive inactive PR channels? (in days)
                </p>
              </div>
              <div className="md:w-1/3">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[localConfig.channelArchiveDays]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) => handleSliderChange("channelArchiveDays", value)}
                    disabled={isSubmitting}
                  />
                  <span className="font-medium w-12 text-center">{localConfig.channelArchiveDays}d</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-md border">
            <div className="flex items-start gap-3">
              <Settings size={20} className="text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">
                  You can always adjust these settings later from the dashboard settings page.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2" disabled={isSubmitting}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={handleComplete} className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Completing Setup...
            </>
          ) : (
            <>
              Complete Setup
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationStep;