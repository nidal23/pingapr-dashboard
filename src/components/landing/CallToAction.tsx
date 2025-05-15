// components/landing/CallToAction.tsx
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const CallToAction: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl p-10 md:p-14 shadow-xl overflow-hidden relative">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your PR workflow?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our early access program and streamline your development process.
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
  );
};

export default CallToAction;