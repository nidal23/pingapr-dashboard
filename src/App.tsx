import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/stores/authStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GitHubAuthSuccess from "./pages/auth/GitHubAuthSuccess";
import SlackAuthSuccess from "./pages/auth/SlackAuthSuccess";
import StandupDashboard from "./pages/dashboard/StandupDashboard";
import AnalyticsDashboard from "./pages/dashboard/AnalyticsDashboard";
import CollaborationDashboard from "./pages/dashboard/CollaborationDashboard";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="pingapr-theme">
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth-success/github" element={<GitHubAuthSuccess />} />
          <Route path="/auth-success/slack" element={<SlackAuthSuccess />} />          

          {/* Protected routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
          <Route path="/standup" element={<StandupDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/collaboration" element={<CollaborationDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;