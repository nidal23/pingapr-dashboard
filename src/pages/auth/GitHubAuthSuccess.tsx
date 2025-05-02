// src/pages/AuthSuccess.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, GitPullRequest, Slack, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const GitHubAuthSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-slate-50 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      {/* Decorative elements contained within the viewport */}
      <div className="fixed top-[5%] left-[5%] w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[5%] right-[5%] w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-md flex items-center justify-center">
              <GitPullRequest size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">PingaPR</h1>
          <Badge variant="outline" className="mt-2">Beta</Badge>
        </div>
        
        <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">Authorization Successful!</CardTitle>
            <CardDescription className="text-base">
              Your GitHub account has been connected to PingaPR
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                You can now enjoy seamless integration between GitHub and Slack for your pull request workflow.
              </p>
              
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#24292e] dark:bg-[#24292e]/80">
                    <GitPullRequest size={28} className="text-white" />
                  </div>
                  <ArrowRightLeft size={24} className="text-primary" />
                  <div className="p-2 rounded-lg bg-[#4A154B] dark:bg-[#4A154B]/80">
                    <Slack size={28} className="text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="font-medium font-display">What you can do now:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="min-w-5 mt-0.5">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <span className="text-muted-foreground">Reply to GitHub comments directly from Slack</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-5 mt-0.5">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <span className="text-muted-foreground">Approve pull requests with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono">/lgtm</code> command</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-5 mt-0.5">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <span className="text-muted-foreground">Stay notified about PRs that need your attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-5 mt-0.5">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <span className="text-muted-foreground">Manage your PRs with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono">/pingapr</code> commands</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center text-muted-foreground pt-2">
                <p>You can close this window and return to Slack.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GitHubAuthSuccess;