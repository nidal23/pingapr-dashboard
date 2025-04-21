// src/components/onboarding/SlackStep.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import { Slack } from "lucide-react";
import { useOnboarding } from "@/lib/stores/onboardingStore";

interface SlackStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const SlackStep: React.FC<SlackStepProps> = ({
  onNext,
  onPrev,
}) => {
  const [loading, setLoading] = useState(false);
  const { isSlackConnected, connectSlack } = useOnboarding();

  const handleConnect = async () => {
    try {
      setLoading(true);
      await connectSlack();
      // Note: We're redirected to Slack, so this won't continue execution
    } catch (error) {
      console.error('Error connecting to Slack:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connect to Slack</CardTitle>
          <CardDescription>
            Link your Slack workspace to sync PR discussions and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isSlackConnected ? (
            <div className="text-center py-8">
              <Slack size={64} className="mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-medium mb-4">Connect your Slack workspace</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                PingaPR needs permission to create channels, send messages, and access user profiles.
                We'll only post PR-related messages.
              </p>
              <Button size="lg" onClick={handleConnect} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Slack size={20} />
                    Connect Slack
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-accent/10 text-accent rounded-md">
                <Check size={20} className="text-accent" />
                <span>Successfully connected to Slack</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Permissions granted</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Create and archive channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Post messages and reply in threads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-accent mt-1 flex-shrink-0" />
                    <span>Access user information</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-md bg-muted/30">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Next: User Mapping</h4>
                    <p className="text-sm text-muted-foreground">
                      In the next step, you'll match GitHub users to their Slack accounts
                      to ensure proper notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isSlackConnected}
          className="gap-2"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SlackStep;