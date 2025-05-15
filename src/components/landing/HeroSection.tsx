// components/landing/HeroSection.tsx
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-4 py-1.5 px-3 bg-primary/10 text-primary rounded-full">
          Beta Access Now Available
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 font-display tracking-tight">
          GitHub PR Discussions in Slack
        </h1>
        <p className="text-xl md:text-2xl mb-6 font-medium font-display">
          Review and approve PRs without ever leaving Slack
        </p>
        <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
          PingaPR brings your GitHub pull request workflow directly into Slack with two-way synchronization, keeping all discussions in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90 font-display" size="lg">
              <span className="flex items-center gap-2">
                Start Free Trial <Rocket size={18} />
              </span>
            </Button>
          </Link>
          <Link to="/product">
            <Button variant="outline" size="lg" className="font-display">See How It Works</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;