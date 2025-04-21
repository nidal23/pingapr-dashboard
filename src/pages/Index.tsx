
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Github, Slack, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div className="font-bold text-xl">PingaPR</div>
            <div className="text-xs bg-muted px-2 py-0.5 rounded">Insight Bridge</div>
          </div>
          <div>
            <Button asChild variant="outline">
              <Link to="/onboarding">Login</Link>
            </Button>
          </div>
        </header>

        {/* Hero */}
        <div className="py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold">
              Turn Pull Requests into Actionable Insights
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              PingaPR Insight Bridge connects GitHub and Slack to streamline code reviews,
              capture valuable analytics, and help your team deliver better software, faster.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
                <Link to="/register" className="gap-2">
                Get Started
                <ArrowRight size={18} />
                </Link>
            </Button>
            <Button variant="outline" size="lg">
                View Demo
            </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-12 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to optimize your PR workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-5">
                <Github size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">GitHub Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly connect to your GitHub repositories and track all pull request activity
                with real-time synchronization and analytics.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-5">
                <Slack size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Slack Connection</h3>
              <p className="text-muted-foreground">
                Create dedicated Slack channels for each PR, unifying discussions and ensuring
                everyone stays in the loop on important code changes.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-5">
                <Zap size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Actionable Insights</h3>
              <p className="text-muted-foreground">
                Powerful analytics dashboard highlights bottlenecks, recognizes top contributors,
                and guides teams toward more efficient development workflows.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-12 md:py-24">
          <div className="bg-primary-600 text-primary-foreground rounded-xl p-8 md:p-12 shadow-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to optimize your PR workflow?</h2>
              <p className="text-lg mb-8 opacity-90">
                Get started today and see how PingaPR Insight Bridge can transform your team's collaboration.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/onboarding">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-10 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-6 w-6 bg-primary-600 rounded flex items-center justify-center">
                <BarChart3 size={16} className="text-white" />
              </div>
              <span className="font-medium">PingaPR</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; 2025 PingaPR Insight Bridge. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;