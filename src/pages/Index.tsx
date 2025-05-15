import { useRef, useState, useEffect, RefObject } from 'react';
import { Link } from "react-router-dom";
import { 
  Bell, 
  MessageSquare, 
  Zap, 
  Slack, 
  Check,
  Clock,
  Moon,
  Sun,
  LucideIcon,
  Lock,
  Users,
  Shield,
  GitPullRequest,
  GitMerge,
  AlertCircle,
  Coffee,
  Rocket,
  Calendar,
  Activity,
  Compass,
  LayoutDashboard,
  TimerReset,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Type for scroll animation hook
type UseScrollAnimationReturn = [RefObject<HTMLDivElement>, boolean];

// Simple animation hook for scrolling into view
const useScrollAnimation = (): UseScrollAnimationReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible];
};

// Solution Card Component Props
interface SolutionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  benefits?: string[];
}

// Solution Card Component
const SolutionCard: React.FC<SolutionCardProps> = ({ title, description, icon: Icon, benefits = [] }) => (
  <Card className="group p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary/30 h-full">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 opacity-0 group-hover:opacity-20 transition-all duration-500 pointer-events-none" />

    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 mx-auto">
        <Icon className="w-6 h-6 text-primary dark:text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary font-display text-center">
        {title}
      </h3>
      <p className="text-muted-foreground text-center mb-4 font-body">
        {description}
      </p>
      {benefits.length > 0 && (
        <ul className="space-y-1">
          {benefits.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-body">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </Card>
);

// Toggle Component Props
interface ThemeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Toggle Component for Dark/Light mode
const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
  >
    {darkMode ? 
      <Sun className="w-5 h-5" /> : 
      <Moon className="w-5 h-5" />
    }
  </button>
);

const Index: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
  };
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [ solutionsRef ] = useScrollAnimation();
  const [ problemRef ] = useScrollAnimation();
  const [ metricsRef ] = useScrollAnimation();
  const [ pricingRef ] = useScrollAnimation();
  const [ setupRef ] = useScrollAnimation();

  // Scroll to section function
  const scrollToSection = (elementRef: RefObject<HTMLDivElement>): void => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-gray-900 dark:to-gray-800 text-foreground dark:text-slate-100 font-body`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600 rounded-md flex items-center justify-center">
                <GitPullRequest size={22} className="text-white" />
              </div>
              <div className="font-display font-bold text-xl">PingaPR</div>
              <Badge variant="outline" className="hidden md:inline-flex text-xs">Beta</Badge>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection(solutionsRef)} className="text-sm hover:text-primary font-medium">Solutions</button>
              <button onClick={() => scrollToSection(metricsRef)} className="text-sm hover:text-primary font-medium">Metrics</button>
              <button onClick={() => scrollToSection(problemRef)} className="text-sm hover:text-primary font-medium">Why PingaPR?</button>
              <button onClick={() => scrollToSection(setupRef)} className="text-sm hover:text-primary font-medium">Setup</button>
              <button onClick={() => scrollToSection(pricingRef)} className="text-sm hover:text-primary font-medium">Pricing</button>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90" size="sm">Sign Up</Button>
              </Link>
            </div>
            
            <div className="md:hidden flex items-center">
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <Link to="/login" className="ml-4">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 py-1.5 px-3 bg-primary/10 text-primary rounded-full">
            Code Reviews Without Context Switching
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 font-display tracking-tight">
            Turn PR Friction into PR Flow
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-medium font-display">
            GitHub in Slack. Slack in GitHub. One unified workflow.
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
            Review, comment, and approve PRs directly from Slack. Get insights into team performance and keep your development flowing without constant app switching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 font-display" size="lg">
                <span className="flex items-center gap-2">
                  Get Early Access <Rocket size={18} />
                </span>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="font-display">Watch Demo</Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center">
              <Check size={20} className="text-green-500 mr-2" />
              <span className="text-sm">Free trial available</span>
            </div>
            <div className="flex items-center">
              <Check size={20} className="text-green-500 mr-2" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center">
              <Shield size={20} className="text-green-500 mr-2" />
              <span className="text-sm">Your code stays private</span>
            </div>
          </div>
        </div>

        {/* Key Value Props Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 shadow-md border-l-4 border-l-primary">
              <div className="font-semibold mb-1">Eliminate Context Switching</div>
              <p className="text-sm text-muted-foreground">Stay in your workflow without jumping between apps</p>
            </Card>
            <Card className="p-5 shadow-md border-l-4 border-l-primary">
              <div className="font-semibold mb-1">Accelerate Review Cycles</div>
              <p className="text-sm text-muted-foreground">Make PR reviews a seamless part of team communication</p>
            </Card>
            <Card className="p-5 shadow-md border-l-4 border-l-primary">
              <div className="font-semibold mb-1">Improve Team Collaboration</div>
              <p className="text-sm text-muted-foreground">Bring everyone into the conversation where it happens</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section ref={solutionsRef} className='py-16 md:py-24'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Solutions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display">Solutions that transform your PR workflow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SolutionCard 
              title="End Context Switching" 
              description="Stop jumping between GitHub and Slack. Manage PR workflows right from your team's communication hub."
              icon={Zap}
              benefits={[
                "Stay in your team's conversation flow",
                "Maintain focus during code reviews",
                "Boost productivity by 27% with less app switching"
              ]}
            />
            <SolutionCard 
              title="Two-Way Synchronization" 
              description="Reply to code comments and approve PRs without leaving Slack, with perfect bidirectional sync."
              icon={MessageSquare}
              benefits={[
                "Comments sync in real-time between platforms",
                "Reply directly in Slack threads",
                "Add code suggestions from within Slack"
              ]}
            />
            <SolutionCard 
              title="Powerful Dashboards" 
              description="Get insights into PR progress, team productivity, and collaboration patterns."
              icon={LayoutDashboard}
              benefits={[
                "Main, Standup, Analytics, and Collaboration views",
                "Track PR velocity and review quality",
                "Make data-driven team decisions"
              ]}
            />
            <SolutionCard 
              title="Streamlined Standups" 
              description="Run effective daily standups with real-time PR status, blockers, and discussion points all in one place."
              icon={Calendar}
              benefits={[
                "Focus on what's important in standups",
                "Visualize PR progress across the team",
                "Track blockers and discussion points"
              ]}
            />
            <SolutionCard 
              title="Smart Notifications" 
              description="Ensure the right people are notified about important PR events at the right time."
              icon={Bell}
              benefits={[
                "Keep important PRs from being forgotten",
                "Customizable reminder frequency",
                "Automatic notifications for relevant team members"
              ]}
            />
            <SolutionCard 
              title="Team Organization" 
              description="Create custom teams to filter dashboards and analyze team-specific performance metrics."
              icon={Users}
              benefits={[
                "Create teams based on projects or departments",
                "Filter dashboards by team",
                "Understand team-specific performance"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section ref={metricsRef} className='py-16 md:py-24'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Key Metrics
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Track what matters to your team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gain visibility into metrics that directly impact your development velocity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                  <TimerReset className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold">Time to First Review</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Track how quickly PRs receive their first review, a critical metric for maintaining developer flow.
              </p>
            </Card>

            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <GitMerge className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">Merge Rate</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Monitor the percentage of PRs that get merged vs. abandoned, indicating code quality and review effectiveness.
              </p>
            </Card>

            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold">Team Velocity</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Measure PR creation, review, and merge rates over time to understand your team's development pace.
              </p>
            </Card>

            <Card className="p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Compass className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold">Knowledge Sharing</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Visualize review patterns to identify knowledge silos and encourage better knowledge distribution.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Improvement Section */}
      <section ref={problemRef} className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                The Context-Switching Problem
              </Badge>
              <h2 className="text-3xl font-bold mb-4 font-display">Reclaim your developer flow state</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Studies show developers lose up to 30 minutes of productive time each time they switch contexts. PingaPR eliminates this productivity drain by bringing GitHub workflows directly into Slack.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Coffee className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Context Switching Hurts Productivity</h3>
                    <p className="text-muted-foreground text-sm">
                      Every time you switch between apps, it takes up to 23 minutes to regain complete focus. PingaPR keeps you in your chat tool.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">More Efficient Reviews</h3>
                    <p className="text-muted-foreground text-sm">
                      Teams using PingaPR complete reviews 32% faster and with higher quality feedback.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Streamlined Communication</h3>
                    <p className="text-muted-foreground text-sm">
                      Keep technical discussions right where your team already communicates, enhancing collaboration and transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium font-display">Admin Dashboard</h3>
                <div className="bg-primary/10 p-1.5 rounded">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                      <GitPullRequest className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">Active PRs</span>
                  </div>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                      <GitMerge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm">Merged PRs</span>
                  </div>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full">
                      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm">Awaiting Review</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm">Blockers</span>
                  </div>
                  <span className="font-medium">2</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">Standup Overview</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Visual representation of PR progress for standups
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Use Cases
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">How teams use PingaPR</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real problems solved by our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-md border-t-4 border-t-cyan-500">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mr-4">
                  <GitMerge size={24} />
                </div>
                <div>
                  <h4 className="font-medium">Development Teams</h4>
                  <p className="text-xs text-muted-foreground">Streamlined review process</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Development teams use PingaPR to keep their code review process flowing smoothly. By handling PR discussions directly in Slack, teams maintain momentum and avoid constant context switching between apps.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Primary benefits:</p>
                <p className="text-xs text-muted-foreground mt-1">Faster reviews, better focus, improved team communication</p>
              </div>
            </Card>
            
            <Card className="p-6 shadow-md border-t-4 border-t-purple-500">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-medium">Remote Teams</h4>
                  <p className="text-xs text-muted-foreground">Enhanced collaboration</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Remote and distributed teams rely on PingaPR to keep everyone in sync. The dashboards provide visibility into team activity, while the Slack integration ensures no comments or requests fall through the cracks.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Primary benefits:</p>
                <p className="text-xs text-muted-foreground mt-1">Team visibility, improved coordination, seamless communication</p>
              </div>
            </Card>
            
            <Card className="p-6 shadow-md border-t-4 border-t-emerald-500">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mr-4">
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <h4 className="font-medium">Team Leaders</h4>
                  <p className="text-xs text-muted-foreground">Visibility and insights</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Engineering managers and team leads use PingaPR's dashboards to get visibility into team performance. The standup dashboard helps run more focused daily meetings, while the analytics views help identify process bottlenecks.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Primary benefits:</p>
                <p className="text-xs text-muted-foreground mt-1">Effective standups, process insights, team productivity oversight</p>
              </div>
            </Card>
          </div>
        </div>
      </section>


      {/* Setup Steps */}
      <section ref={setupRef} className='py-16 md:py-24'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Getting Started
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Four steps to PR happiness</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our guided onboarding gets you up and running in under 15 minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <div className="pl-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center mr-3">1</div>
                    <h3 className="text-xl font-bold font-display">Sign Up</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 pl-11">
                    Create your PingaPR account. No credit card needed for the trial period.
                  </p>
                  <div className="pl-11">
                    <Link to="/register">
                      <Button size="sm">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                <div className="pl-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 text-white h-8 w-8 rounded-full flex items-center justify-center mr-3">2</div>
                    <h3 className="text-xl font-bold font-display">Connect GitHub</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 pl-11">
                    Authorize our GitHub app with just a few clicks. We only access PR metadata, not your code.
                  </p>
                  <div className="pl-11 flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-xs text-green-600">Only PR metadata, never your code</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#4A154B]"></div>
                <div className="pl-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#4A154B] text-white h-8 w-8 rounded-full flex items-center justify-center mr-3">3</div>
                    <h3 className="text-xl font-bold font-display">Add to Slack</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 pl-11">
                    Install our Slack app and link it to your GitHub repositories with our guided setup.
                  </p>
                  <div className="pl-11 flex items-center">
                    <Slack className="h-4 w-4 text-[#36C5F0] mr-2" />
                    <span className="text-xs">Simple installation process</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                <div className="pl-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500 text-white h-8 w-8 rounded-full flex items-center justify-center mr-3">4</div>
                    <h3 className="text-xl font-bold font-display">Map Users & Go!</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 pl-11">
                    Connect GitHub users to Slack accounts, customize your settings, and start improving your workflow.
                  </p>
                  <div className="pl-11 flex items-center">
                    <Rocket className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="text-xs">Invite team members easily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block rounded-xl p-8 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center">
                <Lock className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-xl font-bold">Your Code Stays Private and Secure</h3>
              </div>
              <p className="text-muted-foreground my-4">
                PingaPR never accesses your source code. We only access PR metadata like titles, reviewers, and statuses.
                All communications between our service and GitHub are securely encrypted.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 py-2">Secure OAuth2 authorization</Badge>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 py-2">Data encrypted in transit</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section ref={pricingRef} className='py-16 md:py-24'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Early Access Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, straightforward pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Early adopters get special pricing and help shape the product.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary shadow-lg p-8">
              <Badge className="bg-primary text-white mb-2">Limited Time Offer</Badge>
              <h3 className="text-2xl font-bold">Early Adopter Plan</h3>
              <div className="mt-2 mb-6">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-muted-foreground">/user/month</span>
                <p className="text-sm text-muted-foreground mt-1">Billed annually</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Complete PR Integration</p>
                    <p className="text-sm text-muted-foreground">Create dedicated PR channels in Slack</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Two-way sync with GitHub</p>
                    <p className="text-sm text-muted-foreground">Reply to comments from Slack</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">PR Dashboard</p>
                    <p className="text-sm text-muted-foreground">Track progress and stay informed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">PR Reminders</p>
                    <p className="text-sm text-muted-foreground">Keep PRs moving forward</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Product Input</p>
                    <p className="text-sm text-muted-foreground">Help shape our roadmap</p>
                  </div>
                </div>
              </div>
              <Link to="/register" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                  Get Started
                </Button>
              </Link>
              <p className="text-center text-sm text-muted-foreground mt-4">Free trial available, no credit card required</p>
            </Card>
            
            <p className="text-center text-muted-foreground mt-6">
              Need a custom plan or have questions? <a href="mailto:hello@pingapr.com" className="text-primary hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl p-10 md:p-14 shadow-xl overflow-hidden relative">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your PR workflow?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join our early access program and experience how PingaPR can streamline your development process.
              </p>
              <Link to="/register">
                <Button variant="secondary" size="lg" className="font-medium">
                  <span className="flex items-center gap-2">
                    Start Your Free Trial <Sparkles size={18} />
                  </span>
                </Button>
              </Link>
              <p className="mt-4 text-sm opacity-80">14-day free trial • No credit card required • Your code stays private</p>
            </div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Common Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">Can PingaPR access my source code?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>Absolutely not. PingaPR only accesses PR metadata like titles, reviewers, and statuses. We never access, store, or process your source code. Your intellectual property remains completely private and secure.</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">How long does setup take?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>Our guided 4-step onboarding process typically takes less than 15 minutes. We walk you through GitHub and Slack authorization, repository selection, user mapping, and configuration with a simple, intuitive interface. Most teams are fully operational within an hour of signing up.</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">What integrations do you support?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>We currently offer deep integration with GitHub and Slack. Microsoft Teams integration is on our roadmap for Q3 2025. We're also exploring integrations with JIRA, Linear, and other project management tools based on customer feedback. If there's a specific integration you need, please let us know!</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">What makes your dashboards special?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>Unlike generic project management tools, our dashboards are purpose-built for developer workflows. The Standup Dashboard streamlines daily meetings with actionable PR status and discussion points. The Analytics Dashboard provides insights into team velocity and review patterns. The Collaboration Dashboard visualizes knowledge sharing across your team. Each view is designed to solve specific pain points in the development process.</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">How does team organization work?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>PingaPR allows you to create custom teams that can be used to filter dashboard views. This is particularly useful for larger organizations with multiple teams working across different repositories. You can organize teams by project, function, or any other structure that makes sense for your workflow. Each team gets their own filtered views of PR activity, making it easier to focus on what matters to them.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
<footer className="py-12 border-t border-slate-200 dark:border-slate-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600 rounded flex items-center justify-center">
            <GitPullRequest size={22} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-lg">PingaPR</span>
            <Badge variant="outline" className="ml-1 text-xs">Beta</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Seamless GitHub-Slack integration for development teams
        </p>
      </div>
      
      
      <div>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    
    <div className="border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between">
      <p className="text-sm text-muted-foreground mb-4 md:mb-0">
        &copy; {new Date().getFullYear()} PingaPR. All rights reserved.
      </p>
      <div className="flex items-center space-x-4">
        <a href="#" className="text-muted-foreground hover:text-primary">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
        <a href="#" className="text-muted-foreground hover:text-primary">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
        <a href="#" className="text-muted-foreground hover:text-primary">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>
</div>
  );
};

export default Index;