import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Slack, Rocket } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
      <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold">Welcome to PingaPR</CardTitle>
          <CardDescription className="text-lg">
            Let's set up your workspace to connect GitHub and Slack for seamless PR management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-6 bg-gradient-to-b from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg border border-primary/20 shadow-sm">
              <Github size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
              <p className="text-center text-muted-foreground">
                Connect your repositories to track pull requests and review activity
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gradient-to-b from-purple-500/5 to-purple-500/10 dark:from-purple-500/10 dark:to-purple-500/20 rounded-lg border border-purple-500/20 shadow-sm">
              <Slack size={48} className="text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Slack Connection</h3>
              <p className="text-center text-muted-foreground">
                Link conversations from Slack to keep all PR discussions in sync
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/10">
            <h3 className="font-medium mb-2">What you'll need:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>GitHub account with repository admin access</li>
              <li>Slack workspace admin permissions</li>
              <li>5-10 minutes to complete the setup process</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              onClick={onNext} 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group font-display"
            >
              Get Started
              <Rocket className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeStep;