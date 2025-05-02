// src/pages/dashboard/CollaborationDashboard.tsx
import { useEffect, useState } from "react";
import { useCollaborationStore } from "@/lib/stores/collaborationStore";
import { useRepositoryStore } from "@/lib/stores/repositoryStore";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TimePeriod } from "@/types/dashboard";
import { cn } from "@/lib/utils";

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
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

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
  Legend
);

const COLORS = {
  github: '#24292e',
  slack: '#4A154B',
  primary: '#06b6d4',
  secondary: '#14b8a6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

const CollaborationDashboard = () => {
  const { 
    data, 
    isLoading, 
    error,
    selectedTimePeriod,
    selectedRepository,
    fetchCollaborationData, 
    setTimePeriod, 
    setRepository
  } = useCollaborationStore();

  const { 
    repositories, 
    isLoading: reposLoading, 
    fetchRepositories 
  } = useRepositoryStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const membersPerPage = 6;

  useEffect(() => {
    fetchCollaborationData();
    fetchRepositories();
  }, [fetchCollaborationData, fetchRepositories]);

  if (isLoading || reposLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Team Collaboration</h1>
              <p className="text-gray-500">Understand how your team works together</p>
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
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

  const { reviewerNetwork, teamMembers, teamEngagement } = data;

  // Filter members by search query
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.github_username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Paginate filtered members
  const paginatedMembers = filteredMembers.slice(
    currentPage * membersPerPage, 
    (currentPage + 1) * membersPerPage
  );

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  // Format team member activity data for visualization
  const teamActivityData = {
    labels: teamMembers.slice(0, 10).map(member => member.name.split(" ")[0]),
    datasets: [
      {
        label: "PRs Authored",
        data: teamMembers.slice(0, 10).map(member => member.authored_prs),
        backgroundColor: COLORS.primary,
        borderRadius: 4,
      },
      {
        label: "PRs Reviewed",
        data: teamMembers.slice(0, 10).map(member => member.reviews_completed),
        backgroundColor: COLORS.secondary,
        borderRadius: 4,
      }
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(203, 213, 225, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Team engagement data for bar chart
  const teamEngagementData = {
    labels: teamEngagement.slice(0, 10).map(member => member.name.split(" ")[0]),
    datasets: [
      {
        label: "GitHub Comments",
        data: teamEngagement.slice(0, 10).map(member => member.github_comments),
        backgroundColor: COLORS.github,
        borderRadius: 4,
      },
      {
        label: "Slack Messages",
        data: teamEngagement.slice(0, 10).map(member => member.slack_comments),
        backgroundColor: COLORS.slack,
        borderRadius: 4,
      }
    ],
  };

  // Calculate review balance categories
  const reviewMoreCount = teamMembers.filter(m => m.reviews_completed > m.authored_prs).length;
  const balancedCount = teamMembers.filter(m => 
    m.reviews_completed >= m.authored_prs * 0.8 && 
    m.reviews_completed <= m.authored_prs * 1.2
  ).length;
  const authorMoreCount = teamMembers.filter(m => m.authored_prs > m.reviews_completed * 1.2).length;

  // Format data for code review balance chart
  const codeReviewBalanceData = {
    labels: ["Review more", "Balanced", "Author more"],
    datasets: [
      {
        data: [reviewMoreCount, balancedCount, authorMoreCount],
        backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.github],
        borderWidth: 0,
      }
    ],
  };

  // Calculate average reviewers per PR
  const totalReviewers = teamMembers.reduce((sum, member) => sum + member.reviews_assigned, 0);
  const totalPRs = teamMembers.reduce((sum, member) => sum + member.authored_prs, 0);
  const avgReviewers = totalPRs > 0 ? totalReviewers / totalPRs : 0;

  // Format reviewer connections for a visualization
  // Group by author to show who reviews whose code
  const networkByAuthor = reviewerNetwork.reduce((acc, item) => {
    if (!acc[item.author]) {
      acc[item.author] = [];
    }
    acc[item.author].push(item);
    return acc;
  }, {} as Record<string, typeof reviewerNetwork>);

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  // Find the member with the most authored PRs and reviews for chart scaling
  const maxAuthoredPRs = Math.max(...teamMembers.map(m => m.authored_prs), 1);
  const maxReviewedPRs = Math.max(...teamMembers.map(m => m.reviews_completed), 1);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Collaboration</h1>
            <p className="text-gray-500">Analysis of team dynamics and review patterns</p>
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
          </div>
        </div>

        <Tabs defaultValue="team-activity">
          <TabsList className="mb-4">
            <TabsTrigger value="team-activity">Team Activity</TabsTrigger>
            <TabsTrigger value="review-network">Review Network</TabsTrigger>
            <TabsTrigger value="platform-usage">Platform Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team-activity">
            <div className="grid grid-cols-1 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">PR Creation vs Review Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar data={teamActivityData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name..."
                      className="pl-10 pr-4"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(0); // Reset to first page when searching
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground px-2">
                      {currentPage + 1} / {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedMembers.length > 0 ? (
                    paginatedMembers.map((member) => (
                      <Card key={member.github_username} className="shadow-sm overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-4">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-sm font-semibold">{member.name}</h3>
                              <p className="text-xs text-muted-foreground">@{member.github_username}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">Created {member.authored_prs} PRs</span>
                                <span className="text-xs text-muted-foreground">
                                  {member.open_prs} open / {member.merged_prs} merged
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="bg-primary h-full" 
                                  style={{ width: `${(member.authored_prs / maxAuthoredPRs) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">Reviewed {member.reviews_completed} PRs</span>
                                <span className="text-xs text-muted-foreground">
                                  {member.reviews_assigned > 0 
                                    ? ((member.reviews_completed / member.reviews_assigned) * 100).toFixed(0) 
                                    : 0}% completion rate
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="bg-secondary h-full" 
                                  style={{ width: `${(member.reviews_completed / maxReviewedPRs) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">Avg. review time</span>
                                <span className="text-xs text-muted-foreground">
                                  {member.avg_review_time_hours.toFixed(1)} hours
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full",
                                    member.avg_review_time_hours < 12 ? "bg-success" : 
                                    member.avg_review_time_hours < 24 ? "bg-warning" : "bg-danger"
                                  )}
                                  style={{ 
                                    width: `${Math.min((member.avg_review_time_hours / 48) * 100, 100)}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No team members match your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review-network">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Review Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(networkByAuthor).map(([author, connections]) => (
                      <div key={author} className="space-y-2">
                        <div className="font-medium">{author}'s code is reviewed by:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {connections
                            .sort((a, b) => b.review_count - a.review_count)
                            .map((connection) => (
                              <div 
                                key={`${connection.author}-${connection.reviewer}`}
                                className="flex items-center justify-between border rounded-md p-2"
                              >
                                <span>{connection.reviewer}</span>
                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                  {connection.review_count} reviews
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Code Review Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <Pie data={codeReviewBalanceData} options={pieChartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Collaboration Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Average Reviewers per PR</h3>
                      <div className="flex items-center">
                        <div className="w-full mr-4">
                          <Progress value={avgReviewers * 20} className="h-2" />
                        </div>
                        <span className="text-xl font-bold">{avgReviewers.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {avgReviewers < 2 
                          ? "Consider adding more reviewers to PRs for better coverage" 
                          : avgReviewers > 4 
                            ? "There might be too many reviewers per PR" 
                            : "Good distribution of reviewers per PR"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Knowledge Sharing</h3>
                      <div className="bg-muted/30 p-4 rounded-md">
                        <p className="text-sm">
                          Based on the review patterns, the team has a 
                          <span className="mx-1 bg-cyan-50 text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300 border border-cyan-900/50 rounded-md px-1.5 py-0.5 text-xs font-medium">
                            {reviewerNetwork.length > 15 ? "Distributed" : "Centralized"}
                          </span> 
                          knowledge sharing pattern.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {reviewerNetwork.length > 15 
                            ? "Good job! Knowledge is widely shared across the team." 
                            : "Consider rotating reviewers more to spread knowledge."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platform-usage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Platform Engagement by Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar 
                      data={teamEngagementData} 
                      options={{
                        ...chartOptions,
                        indexAxis: 'y' as const,
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Communication Channel Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {teamEngagement.map((member) => {
                      const totalComments = member.github_comments + member.slack_comments;
                      const githubPercentage = totalComments ? (member.github_comments / totalComments) * 100 : 0;
                      const slackPercentage = totalComments ? (member.slack_comments / totalComments) * 100 : 0;
                      
                      return (
                        <div key={member.name} className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{member.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {totalComments} comments
                            </span>
                          </div>
                          
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                            <div 
                              className="h-full"
                              style={{ width: `${githubPercentage}%`, backgroundColor: COLORS.github }}
                            ></div>
                            <div 
                              className="h-full"
                              style={{ width: `${slackPercentage}%`, backgroundColor: COLORS.slack }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between mt-1">
                            <span className="text-xs">
                              GitHub: {githubPercentage.toFixed(0)}%
                            </span>
                            <span className="text-xs">
                              Slack: {slackPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-8 bg-muted/30 p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Platform Usage Insights</h3>
                      <ul className="text-xs text-muted-foreground space-y-2">
                        <li className="flex items-start">
                          <div className="h-4 w-4 rounded-full mr-2 flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS.github }}></div>
                          <span>GitHub is primarily used for technical discussions and code reviews.</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-4 w-4 rounded-full mr-2 flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS.slack }}></div>
                          <span>Slack is used for quick feedback and non-technical discussions about PRs.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CollaborationDashboard;