// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GitPullRequest, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/stores/authStore";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkOnboardingStatus = async () => {
    try {
      const { data } = await api.get('/onboarding/status');
      
      // Direct to dashboard if onboarding is complete
      if (data.onboardingCompleted) {
        navigate("/dashboard");
        return;
      }
      
      // Determine which onboarding step to show based on what's completed
      if (!data.githubConnected) {
        navigate("/onboarding");
      } else if (!data.slackConnected) {
        navigate("/onboarding");
      } else if (data.userMappings.length === 0) {
        navigate("/onboarding");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
      // Default to onboarding start if we can't determine status
      navigate("/onboarding");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful!");
      
      // Check onboarding status to determine where to navigate
      await checkOnboardingStatus();
    } catch (error) {
      toast.error("Login failed. Please try again.", { description: `${error}`});
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-slate-50 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-md flex items-center justify-center">
              <GitPullRequest size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">PingaPR</h1>
          <Badge variant="outline" className="mt-2">Beta</Badge>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        
        <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-display text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@company.com"
                  required 
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 font-display" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
      
      {/* Decorative elements contained within the viewport */}
      <div className="fixed top-[5%] left-[5%] w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[5%] right-[5%] w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Login;