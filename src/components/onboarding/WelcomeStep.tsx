//src/components/onboarding/WelcomeStep.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Github, Slack } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
      <Card className="border-2 border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to PingaPR Insight Bridge</CardTitle>
          <CardDescription className="text-lg">
            Let's set up your workspace to connect GitHub and Slack for seamless PR management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
              <Github size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
              <p className="text-center text-muted-foreground">
                Connect your repositories to track pull requests and review activity
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-secondary rounded-lg">
              <Slack size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Slack Connection</h3>
              <p className="text-center text-muted-foreground">
                Link conversations from Slack to keep all PR discussions in sync
              </p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">What you'll need:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>GitHub account with repository admin access</li>
              <li>Slack workspace admin permissions</li>
              <li>5-10 minutes to complete the setup process</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={onNext} className="group">
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeStep;