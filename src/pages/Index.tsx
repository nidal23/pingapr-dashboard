import { useRef, useState, useEffect, RefObject } from 'react';
import { Link } from "react-router-dom";
import { 
  Bell, 
  MessageSquare, 
  Zap, 
  Slack, 
  Terminal, 
  ArrowRight, 
  Check, 
  BarChart3,
  Code,
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
  Rocket
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

  const [solutionsRef, solutionsVisible] = useScrollAnimation();
  const [problemRef, problemVisible] = useScrollAnimation();
  const [pricingRef, pricingVisible] = useScrollAnimation();
  const [setupRef, setupVisible] = useScrollAnimation();

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
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <Badge className="mb-4 py-1.5 px-3 bg-primary/10 text-primary rounded-full">
    Ping Your PRs, Not Your Colleagues!
  </Badge>
  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 font-display tracking-tight">
    Ping-a-PR
  </h1>
  <p className="text-xl md:text-2xl mb-4 font-medium font-display">
    When a PR's ready, just ping-a-PR!
  </p>
  <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
    Bring GitHub pull requests directly into Slack. Reply to comments, approve PRs, and track progress without leaving your team's chat platform.
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
</section>


      {/* Solutions Section */}
      <section ref={solutionsRef} className={`py-16 md:py-24 transition-all duration-700 transform ${solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Solutions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display">Solutions that make PR workflows go "ping!"</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SolutionCard 
              title="End Context Switching" 
              description="Stop jumping between GitHub and Slack. Manage PR workflows right from your team's communication hub."
              icon={Slack}
              benefits={[
                "Stay in your team's conversation flow",
                "Maintain focus during code reviews",
                "Keep discussions together with code changes"
              ]}
            />
            <SolutionCard 
              title="Simplify Collaboration" 
              description="Reply to code comments and approve PRs without leaving Slack."
              icon={MessageSquare}
              benefits={[
                "Two-way sync with GitHub",
                "Reply directly in threads",
                "Add code suggestions from Slack"
              ]}
            />
            <SolutionCard 
              title="Admin Dashboard & Standup Tool" 
              description="Give admins easy insight into PR status, blockers, and team progress for standups."
              icon={Users}
              benefits={[
                "Up to 2 admins per organization",
                "Track PR progress for daily or weekly standups",
                "Monitor overall PR activity and bottlenecks"
              ]}
            />
            <SolutionCard 
              title="Streamline Workflows" 
              description="Simplify PR workflows with intuitive Slack commands that handle GitHub actions."
              icon={Terminal}
              benefits={[
                "Quick access to PR information",
                "Approve PRs with simple commands",
                "Find and organize your team's open PRs"
              ]}
            />
            <SolutionCard 
              title="Smart Notifications" 
              description="Ensure the right people are notified about important PR events at the right time."
              icon={Bell}
              benefits={[
                "Keep important PRs from being forgotten",
                "Notify relevant team members automatically",
                "Stay informed about status changes"
              ]}
            />
            <SolutionCard 
              title="Bulletproof Security" 
              description="Maintain security with a system designed to respect your codebase's privacy."
              icon={Shield}
              benefits={[
                "No access to your source code",
                "Only PR metadata is processed",
                "Secure connections to GitHub and Slack"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Workflow Improvement Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                Maintain Flow State
              </Badge>
              <h2 className="text-3xl font-bold mb-4 font-display">Don't let PRs go cold, just give them a ping!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                When you constantly switch between GitHub and Slack, your productivity suffers. PingaPR brings these workflows together so you can stay in your flow state.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Coffee className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Context Switching Hurts Productivity</h3>
                    <p className="text-muted-foreground text-sm">
                      Every time you switch between apps, it takes significant time to regain focus. PingaPR keeps you in your chat tool.
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
                      When reviews are easier to complete, they happen more quickly and more often.
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
                      Keep technical discussions right where your team already communicates.
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

      {/* The Problem Section */}
      <section ref={problemRef} className={`py-16 md:py-24 transition-all duration-700 transform ${problemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              The Origin Story
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display">Why Ping-a-PR exists</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  It all started with the constant back-and-forth. We found ourselves toggling between GitHub and Slack throughout the day. "Can you review my PR?" messages would get buried, reviews delayed, and our momentum suffered.
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Each context switch cost us focus time. Opening GitHub, finding the right PR, 
                  looking at the code, leaving comments, then notifying the author separately in Slack... 
                  it was a cycle of interruptions that broke our concentration.
                </p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  So we built PingaPR - the tool we wished we had. A bridge that brings your GitHub workflow
                  right into your team's chat platform. No more context switching, no more forgotten PRs, 
                  no more workflow bottlenecks. Just smoother, more efficient development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section ref={setupRef} className={`py-16 md:py-24 bg-slate-50 dark:bg-slate-800/30 transition-all duration-700 transform ${setupVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              Getting Started
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Four steps to PR happiness</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our guided onboarding gets you up and running quickly
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
      <section ref={pricingRef} className={`py-16 md:py-24 border-t border-slate-200 dark:border-slate-800 transition-all duration-700 transform ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                    Get Early Access
                    <ArrowRight size={18} />
                  </span>
                </Button>
              </Link>
              <p className="mt-4 text-sm opacity-80">No credit card required • Free trial available • No access to your code</p>
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
                  <p>No. PingaPR only accesses PR metadata like titles, reviewers, and statuses. We never access, store, or process your source code.</p>
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
                  <p>Our guided onboarding process walks you through GitHub and Slack authorization, user mapping, and configuration to get you started quickly.</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">Do you support Microsoft Teams?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>Microsoft Teams integration is on our roadmap. We're currently focused on perfecting our Slack integration, but Teams support is a priority for future development.</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">How does the dashboard feature work?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>Our dashboard provides a summary of PR activity that you can configure to your preferences. It shows active PRs, merged PRs, those awaiting review, and potential blockers to help your team stay informed and coordinated.</p>
                </div>
              </details>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <h3 className="text-xl font-bold">Does PingaPR work with private repositories?</h3>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground">
                  <p>Yes, PingaPR works with both public and private GitHub repositories. Our secure OAuth integration respects all permission settings established in GitHub.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-purple-600 rounded flex items-center justify-center">
                <BarChart3 size={18} className="text-white" />
              </div>
              <span className="font-medium">PingaPR</span>
              <Badge variant="outline" className="text-xs">Beta</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PingaPR. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;