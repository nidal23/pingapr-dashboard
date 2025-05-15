// components/landing/Footer.tsx
import React from 'react';
import { Link } from "react-router-dom";
import { GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              GitHub PR discussions in Slack
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PingaPR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;