import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Settings, Loader2, Clock, Archive, Sparkles } from "lucide-react";
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
      <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Configure Settings</CardTitle>
          <CardDescription>
            Customize how PingaPR works with your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-8">
            <div className="p-6 rounded-lg border bg-gradient-to-b from-primary/5 to-transparent">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    <h3 className="font-medium">PR Reminder Time</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When should we remind about pending reviews?
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
                      className="w-full"
                    />
                    <span className="font-medium w-16 text-center px-2 py-1 bg-primary/10 rounded-md text-primary">
                      {localConfig.prReminderHours}h
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-gradient-to-b from-purple-500/5 to-transparent">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Archive size={20} className="text-purple-600" />
                    <h3 className="font-medium">Channel Archive Time</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When should we archive inactive PR channels?
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
                      className="w-full"
                    />
                    <span className="font-medium w-16 text-center px-2 py-1 bg-purple-500/10 rounded-md text-purple-600">
                      {localConfig.channelArchiveDays}d
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg border border-muted/50">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-primary/10 text-primary">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="font-medium mb-2">All Set to Go!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You can always adjust these settings later from the dashboard settings page. 
                  Once you complete setup, we'll send invitations to your team members.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-900/30">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      <span className="font-medium">GitHub</span>: Connected
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-900/30">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      <span className="font-medium">Slack</span>: Connected
                    </p>
                  </div>
                </div>
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
        <Button 
          onClick={handleComplete} 
          className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Completing Setup...
            </>
          ) : (
            <>
              Complete Setup
              <Sparkles size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationStep;