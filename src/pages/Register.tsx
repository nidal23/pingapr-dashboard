// src/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, GitPullRequest, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/stores/authStore";
import { Badge } from "@/components/ui/badge";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      toast.success("Registration successful! Please log in with your new credentials.");
      
      // Logout after registration to enforce explicit login
      useAuth.getState().logout();
      
      // Redirect to login page instead of onboarding
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.", {description: `${error}`});
    } finally {
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
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>
        
        <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-display text-center">Join PingaPR</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Smith"
                  required 
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
              
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
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6 border-t">
            <div className="flex items-center text-xs text-muted-foreground text-center gap-2 justify-center">
              <Shield size={14} className="text-green-500" />
              <span>By signing up, you agree to our Terms of Service and Privacy Policy.</span>
            </div>
            <div className="flex items-center justify-center text-sm">
              <span className="mr-1">Already have an account?</span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="flex justify-center mt-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-500" />
              <span className="text-xs text-muted-foreground">Your code stays private</span>
            </div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements contained within the viewport */}
      <div className="fixed top-[5%] right-[5%] w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[5%] left-[5%] w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Register;