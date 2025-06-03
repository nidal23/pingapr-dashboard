// src/pages/dashboard/StandupDashboard.tsx
import { useEffect } from "react";
import { useStandupStore } from "@/lib/stores/standupStore";
import { useRepositoryStore } from "@/lib/stores/repositoryStore";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, GitMerge, GitPullRequest } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import PullRequestTable from "@/components/dashboard/PullRequestTable";
import StatCard from "@/components/dashboard/StatCard";
import { TimePeriod } from "@/types/dashboard";
import { useTeamsFilter } from '@/hooks/use-teams-filter';
import { Users } from 'lucide-react';
import FeaturePreview from "@/components/pricing/FeaturePreview";
import UsageBanner from "@/components/pricing/UsageBanner";
import { useFeatureAccess } from "@/hooks/use-feature-access";

const StandupDashboard = () => {
  const { 
    data, 
    isLoading, 
    error,
    selectedTimePeriod,
    selectedRepository,
    selectedTeamId,
    focusMode,
    fetchStandupData, 
    setTimePeriod, 
    setRepository,
    setTeamId,
    toggleFocusMode,
    // addDiscussionPoint,
    // removeDiscussionPoint
  } = useStandupStore();

  const { canAccessStandup } = useFeatureAccess();



  const { 
  teams,
  isLoading: teamsLoading 
} = useTeamsFilter();

  const { 
    repositories, 
    isLoading: reposLoading, 
    fetchRepositories 
  } = useRepositoryStore();

  // const [newPoint, setNewPoint] = useState({ text: "", type: "discussion" as const });

  useEffect(() => {
    fetchStandupData();
    fetchRepositories();
  }, [fetchStandupData, fetchRepositories]);

  // const handleAddDiscussionPoint = () => {
  //   if (newPoint.text.trim()) {
  //     addDiscussionPoint({
  //       text: newPoint.text,
  //       type: newPoint.type
  //     });
  //     setNewPoint({ text: "", type: "discussion" });
  //   }
  // };

  if (!canAccessStandup) {
    return (
      <Layout>
        <UsageBanner />
        <FeaturePreview
          title="Standup Dashboard"
          description="Streamline your daily standups with focused PR insights and team activity summaries."
          features={[
            "Daily, weekly, and monthly PR summaries",
            "Active PR tracking with reviewer status",
            "Team performance metrics for standups",
            "Focus mode for distraction-free meetings",
            "Customizable time period filtering",
            "Team-specific standup views"
          ]}
        />
      </Layout>
    );
  }
  if (isLoading || reposLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Standup Dashboard</h1>
              <p className="text-gray-500">Track PR activity for your team standups</p>
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>

                <Skeleton className="h-60 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
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

  const { stats, activePRs } = data;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Standup Dashboard</h1>
            <p className="text-gray-500">Review recent PR activity for your team standup</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Tabs 
              value={selectedTimePeriod} 
              onValueChange={(value) => setTimePeriod(value as TimePeriod)}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select 
              value={selectedRepository || "all"} 
              onValueChange={(value) => setRepository(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
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
              <SelectTrigger className="w-full md:w-[200px]">
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

            <div className="flex items-center space-x-2">
              <Button
                variant={focusMode ? "default" : "outline"}
                size="sm"
                onClick={toggleFocusMode}
              >
                {focusMode ? "Exit Focus Mode" : "Focus Mode"}
              </Button>
            </div>
          </div>
        </div>

        {!focusMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="PRs Opened"
              value={stats.opened}
              description={`In the ${selectedTimePeriod} period`}
              icon={<GitPullRequest className="h-5 w-5" />}
            />
            <StatCard
              title="PRs Merged"
              value={stats.merged}
              description={`In the ${selectedTimePeriod} period`}
              icon={<GitMerge className="h-5 w-5" />}
            />
            <StatCard
              title="Reviews Completed"
              value={stats.reviews_completed}
              description={`${stats.reviews_pending} still pending`}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Avg Review Time"
              value={`${stats.avg_review_time_hours.toFixed(1)} hrs`}
              description={`In the ${selectedTimePeriod} period`}
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4">
            {activePRs.length} Active Pull Requests
            {selectedTimePeriod === "daily" ? " (Today)" : selectedTimePeriod === "weekly" ? " (This Week)" : " (This Month)"}
          </h2>
          {activePRs.length > 0 ? (
            <PullRequestTable 
              pullRequests={activePRs} 
              showRepo={!selectedRepository} 
            />
          ) : (
            <div className="bg-card border rounded-md p-6 text-center">
              <p className="text-muted-foreground">No active pull requests found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>
      {/* {!focusMode && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Blockers & Discussion Points</h2>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Add issues to discuss in your standup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussionPoints.length === 0 ? (
                    <p className="text-muted-foreground">No discussion points added yet.</p>
                  ) : (
                    discussionPoints.map((point) => (
                      <div 
                        key={point.id} 
                        className="flex items-start gap-2"
                      >
                        <div className={`
                          rounded-full p-2
                          ${point.type === 'blocker' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                          ${point.type === 'discussion' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${point.type === 'announcement' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        `}>
                          <XCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 bg-muted/30 dark:bg-slate-800/60 p-3 rounded-md">
                          <p>{point.text}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeDiscussionPoint(point.id)}
                          className="text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a new discussion point..."
                      value={newPoint.text}
                      onChange={(e) => setNewPoint({ ...newPoint, text: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddDiscussionPoint();
                        }
                      }}
                    />
                    <Select 
                      value={newPoint.type} 
                      onValueChange={(value) => setNewPoint({ 
                        ...newPoint, 
                        type: value as "blocker" | "discussion" | "announcement" 
                      })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blocker">Blocker</SelectItem>
                        <SelectItem value="discussion">Discussion</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddDiscussionPoint} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}
    </Layout>
  );
};

export default StandupDashboard;