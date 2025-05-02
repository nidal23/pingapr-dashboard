
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

interface ReviewRelationship {
  author: string;
  reviewer: string;
  review_count: number;
}

interface SankeyChartProps {
  reviewNetwork: ReviewRelationship[];
}

export const SankeyChart = ({ reviewNetwork }: SankeyChartProps) => {
  // Process data for visualization
  const { topReviewers, reviewPairs } = useMemo(() => {
    // Count total reviews per reviewer and per author
    const reviewerCounts = new Map();
    const authorCounts = new Map();
    const pairCounts = new Map();
    
    reviewNetwork.forEach(item => {
      // Use only first name for display
      const authorName = item.author.split(" ")[0];
      const reviewerName = item.reviewer.split(" ")[0];
      
      // Skip self-reviews
      if (authorName === reviewerName) return;
      
      // Count reviews by reviewer
      const reviewerCount = reviewerCounts.get(reviewerName) || 0;
      reviewerCounts.set(reviewerName, reviewerCount + item.review_count);
      
      // Count PRs by author that got reviewed
      const authorCount = authorCounts.get(authorName) || 0;
      authorCounts.set(authorName, authorCount + item.review_count);
      
      // Count review pairs
      const pairKey = `${authorName} → ${reviewerName}`;
      pairCounts.set(pairKey, (pairCounts.get(pairKey) || 0) + item.review_count);
    });
    
    // Get top 5 reviewers
    const topReviewers = Array.from(reviewerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    // Get top 5 authors
    const topAuthors = Array.from(authorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
      
    // Get top 10 review pairs
    const reviewPairs = Array.from(pairCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return { topReviewers, topAuthors, reviewPairs };
  }, [reviewNetwork]);

  // If we have no valid data, display a message
  if (reviewNetwork.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Not enough data to generate a review network visualization
      </div>
    );
  }

  // Chart data for top reviewers
  const reviewerChartData = {
    labels: topReviewers.map(([name]) => name),
    datasets: [
      {
        label: "Reviews Completed",
        data: topReviewers.map(([_, count]) => count),
        backgroundColor: "#14b8a6",
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Reviews: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(203, 213, 225, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Reviewers Chart */}
      <Card className="shadow-sm dark:glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Top Code Reviewers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Team members who reviewed the most PRs
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <Bar data={reviewerChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
      
      {/* Top Review Relationships */}
      <Card className="shadow-sm dark:glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Strongest Review Relationships</CardTitle>
          <p className="text-sm text-muted-foreground">
            Most active author-reviewer pairs
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {reviewPairs.map(([pair, count], index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                <div className="flex items-center gap-2">
                  <GitPullRequest size={16} className="text-cyan-500" />
                  <span>{pair}</span>
                </div>
                <Badge variant="secondary">{count} reviews</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
