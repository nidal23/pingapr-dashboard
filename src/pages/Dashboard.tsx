// src/pages/Dashboard.tsx
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import PullRequestTable from "@/components/dashboard/PullRequestTable";
import RepoActivityCard from "@/components/dashboard/RepoActivityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboardStore } from "@/lib/stores/dashboardStore";
import { 
  GitPullRequest, 
  GitMerge, 
  XCircle, 
  Clock, 
  Calendar,
  AlertCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import UsageBanner from "@/components/pricing/UsageBanner";

const Dashboard = () => {
  const { data, isLoading, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <Layout>
        <UsageBanner />
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Overview of your pull request activity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2.5 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Pull Requests</h2>
            <Card>
              <CardContent className="p-0">
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          </div>
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

  const { prStatusCounts, timeMetrics, repositoryActivity, recentPRs, weeklyActivity } = data;

  // Last 4 weeks of weekly activity for the chart
  const chartData = weeklyActivity.slice(-4).map(week => ({
    name: new Date(week.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    opened: week.opened,
    merged: week.merged,
    closed: week.closed
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Overview of your pull request activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pull Requests"
            value={prStatusCounts.total_prs}
            description="All-time pull requests"
            icon={<GitPullRequest className="h-5 w-5" />}
          />
          <StatCard
            title="Open PRs"
            value={prStatusCounts.open_prs}
            description="Awaiting review or merge"
            icon={<GitPullRequest className="h-5 w-5" />}
            // trend={{ direction: "up", value: "12% from last week" }}
          />
          <StatCard
            title="Merged PRs"
            value={prStatusCounts.merged_prs}
            description="Successfully merged code"
            icon={<GitMerge className="h-5 w-5" />}
          />
          <StatCard
            title="Closed PRs"
            value={prStatusCounts.closed_prs}
            description="Closed without merging"
            icon={<XCircle className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">PR Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="opened" 
                      name="Opened" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="merged" 
                      name="Merged" 
                      stroke="#6E41E2" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="closed" 
                      name="Closed" 
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <RepoActivityCard repositories={repositoryActivity} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatCard
            title="Avg. Time to First Review"
            value={`${timeMetrics.avg_hours_to_first_review.toFixed(1)} hours`}
            description="Average time from PR creation to first review"
            icon={<Clock className="h-5 w-5" />}
            className="h-32"
          />
          <StatCard
            title="Avg. Time to Merge"
            value={`${timeMetrics.avg_hours_to_merge.toFixed(1)} hours`}
            description="Average time from PR creation to merge"
            icon={<Calendar className="h-5 w-5" />}
            className="h-32"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Pull Requests</h2>
          <PullRequestTable pullRequests={recentPRs} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;