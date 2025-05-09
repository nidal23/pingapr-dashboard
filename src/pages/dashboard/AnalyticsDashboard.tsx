// src/pages/dashboard/AnalyticsDashboard.tsx
import { useEffect } from "react";
import { useAnalyticsStore } from "@/lib/stores/analyticsStore";
import { useRepositoryStore } from "@/lib/stores/repositoryStore";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, GitMerge, GitPullRequest, Clock } from "lucide-react";
import { TimePeriod } from "@/types/dashboard";
import { useTeamsFilter } from '@/hooks/use-teams-filter';
import { Users } from 'lucide-react';

// Chart.js imports for visualizations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const COLORS = {
  opened: "#10b981", // green
  merged: "#6E41E2", // purple
  closed: "#94a3b8", // gray
  github: "#9a90b3", // purple for GitHub
  slack: "#bb3bbd", // darker purple for Slack
};

const AnalyticsDashboard = () => {
  const { 
    data, 
    isLoading, 
    error,
    selectedTimePeriod,
    selectedRepository,
    selectedTeamId,
    fetchAnalyticsData, 
    setTimePeriod, 
    setRepository,
    setTeamId
  } = useAnalyticsStore();


  const { 
  teams,
  isLoading: teamsLoading 
} = useTeamsFilter();

  const { 
    repositories, 
    isLoading: reposLoading, 
    fetchRepositories 
  } = useRepositoryStore();

  useEffect(() => {
    fetchAnalyticsData();
    fetchRepositories();
  }, [fetchAnalyticsData, fetchRepositories]);

  if (isLoading || reposLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-gray-500">Detailed metrics about PR activity and team performance</p>
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No data available. Please connect your repositories to get started.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  const { repositoryBreakdown, prActivity, platformEngagement, reviewFulfillment } = data;

  // Calculate merge rate (assuming we have the total counts)
  const total = repositoryBreakdown.reduce((sum, repo) => sum + repo.merged_prs + repo.closed_prs, 0);
  const mergedTotal = repositoryBreakdown.reduce((sum, repo) => sum + repo.merged_prs, 0);
  const mergeRate = total > 0 ? mergedTotal / total : 0;

  // Format weekly activity data for the chart
  const formattedPRActivity = prActivity.map(week => ({
    week: new Date(week.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    opened: week.opened,
    merged: week.merged,
    closed: week.closed
  }));

  // Format repository data for the chart
  const repositoryData = repositoryBreakdown.map(repo => ({
    name: repo.github_repo_name,
    open: repo.open_prs,
    merged: repo.merged_prs,
    closed: repo.closed_prs
  }));

  // Weekly activity line chart data
  const lineChartData = {
    labels: formattedPRActivity.map(item => item.week),
    datasets: [
      {
        label: 'Opened',
        data: formattedPRActivity.map(item => item.opened),
        borderColor: COLORS.opened,
        backgroundColor: `${COLORS.opened}1A`, // 10% opacity
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: COLORS.opened,
        fill: true,
      },
      {
        label: 'Merged',
        data: formattedPRActivity.map(item => item.merged),
        borderColor: COLORS.merged,
        backgroundColor: `${COLORS.merged}1A`, // 10% opacity
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: COLORS.merged,
        fill: true,
      },
      {
        label: 'Closed',
        data: formattedPRActivity.map(item => item.closed),
        borderColor: COLORS.closed,
        backgroundColor: `${COLORS.closed}1A`, // 10% opacity
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: COLORS.closed,
        fill: true,
      }
    ]
  };

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        bodySpacing: 4,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
        },
      },
    },
    elements: {
      line: {
        fill: true,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Repository bar chart data
  const barChartData = {
    labels: repositoryData.map(repo => repo.name),
    datasets: [
      {
        label: 'Open',
        data: repositoryData.map(repo => repo.open),
        backgroundColor: COLORS.opened,
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'Merged',
        data: repositoryData.map(repo => repo.merged),
        backgroundColor: COLORS.merged,
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'Closed',
        data: repositoryData.map(repo => repo.closed),
        backgroundColor: COLORS.closed,
        borderRadius: 4,
        barThickness: 16,
      }
    ]
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle',
          },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        bodySpacing: 4,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Platform engagement pie chart data
  const pieChartData = {
    labels: platformEngagement.map(platform => platform.source.charAt(0).toUpperCase() + platform.source.slice(1)),
    datasets: [
      {
        data: platformEngagement.map(platform => platform.comment_count),
        backgroundColor: [COLORS.github, COLORS.slack],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        bodySpacing: 4,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return ` ${context.parsed}: ${context.raw} comments`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-500">Detailed metrics about PR activity and team performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
          <Select 
            value={selectedTimePeriod} 
            onValueChange={(value) => setTimePeriod(value as TimePeriod)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={selectedRepository || "all"} 
            onValueChange={(value) => setRepository(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All repositories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All repositories</SelectItem>
              {repositories.map((repo) => (
                <SelectItem key={repo.id} value={repo.id}>
                  {repo.github_repo_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add team selector */}
          <Select 
            value={selectedTeamId || "all"} 
            onValueChange={(value) => setTeamId(value === "all" ? '' : value)}
            disabled={teamsLoading || teams.length === 0}
          >
            <SelectTrigger className="w-44">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <SelectValue placeholder="All teams" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Merge Rate"
            value={`${(mergeRate * 100).toFixed(1)}%`}
            description="Percentage of PRs that are merged"
            icon={<GitMerge className="h-5 w-5" />}
          />
          <StatCard
            title="Average Time to Review"
            value={`${reviewFulfillment.avg_completion_time.toFixed(1)} hours`}
            description="From creation to first review"
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Review Completion"
            value={`${reviewFulfillment.completed}/${reviewFulfillment.total}`}
            description={`${reviewFulfillment.pending} reviews pending`}
            icon={<GitPullRequest className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">PR Trend ({selectedTimePeriod})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Platform Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Repository Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;