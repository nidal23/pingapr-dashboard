// components/landing/KeyFeatures.tsx
import React from 'react';
import { MessageSquare, GitPullRequest, LayoutDashboard, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const KeyFeatures: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 font-display">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Two-Way Sync</h3>
                <p className="text-muted-foreground mb-2">
                  Comment on GitHub, it appears in Slack. Reply in Slack, it syncs to GitHub. Perfect two-way integration.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <GitPullRequest className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">PR Channels</h3>
                <p className="text-muted-foreground mb-2">
                  Each PR gets its own Slack channel, automatically archiving when the PR is merged or closed.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Dashboards</h3>
                <p className="text-muted-foreground mb-2">
                  Track PR activity, review status, and team performance with purpose-built dashboards.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Team Management</h3>
                <p className="text-muted-foreground mb-2">
                  Organize teams, filter dashboards by team, and track team-specific metrics.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="text-center">
          <Link to="/features">
            <Button variant="outline">
              Explore All Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;