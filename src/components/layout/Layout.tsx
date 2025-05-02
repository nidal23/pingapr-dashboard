// src/components/layout/Layout.tsx
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  LayoutDashboard,
  GitPullRequest,
  BarChart,
  Network,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close the mobile menu when the location changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />
    },
    {
      name: 'Standup',
      path: '/standup',
      icon: <GitPullRequest className="w-5 h-5 mr-3" />
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart className="w-5 h-5 mr-3" />
    },
    {
      name: 'Collaboration',
      path: '/collaboration',
      icon: <Network className="w-5 h-5 mr-3" />
    },
    {
      name: 'Team',
      path: '/team',
      icon: <Users className="w-5 h-5 mr-3" />
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="w-5 h-5 mr-3" />
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <Link to="/dashboard" className="flex items-center">
              <GitPullRequest className="w-6 h-6 text-primary mr-2" />
              <span className="text-xl font-bold">PingaPR</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${location.pathname === item.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User profile */}
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center text-xs text-muted-foreground px-0">
                    <LogOut className="w-3 h-3 mr-1" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <div className="border-b h-16 flex items-center justify-between px-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile logo */}
          <div className="md:hidden flex items-center">
            <GitPullRequest className="w-6 h-6 text-primary mr-2" />
            <span className="text-xl font-bold">PingaPR</span>
          </div>

          {/* Theme toggle & user menu (mobile) */}
          <div className="flex items-center">
            <ThemeToggle />
            <div className="ml-4 md:hidden">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />

            {/* Menu */}
            <div className="relative flex flex-col w-full max-w-xs bg-background pt-5 pb-4 overflow-y-auto">
              <div className="px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 text-base font-medium rounded-md
                      ${location.pathname === item.path 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}

                {/* Mobile logout */}
                <button
                  className="w-full flex items-center px-3 py-2 text-base font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;