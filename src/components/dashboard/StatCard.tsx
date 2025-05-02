
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {typeof value === "number" && value % 1 === 0
                ? value
                : typeof value === "number"
                ? value.toFixed(1)
                : value}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center text-xs font-medium",
                trend.direction === "up" ? "text-success" : "",
                trend.direction === "down" ? "text-danger" : "",
                trend.direction === "neutral" ? "text-neutral" : ""
              )}
            >
              {trend.direction === "up" && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-4.293-4.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
              )}
              {trend.direction === "down" && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M12 13a1 1 0 100-2H6.414l4.293-4.293a1 1 0 00-1.414-1.414l-6 6a1 1 0 000 1.414l6 6a1 1 0 001.414-1.414L6.414 13H12z" clipRule="evenodd" />
                </svg>
              )}
              {trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;