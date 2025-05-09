// src/types/dashboard.ts

export interface PRStatusCounts {
  total_prs: number;
  open_prs: number;
  merged_prs: number;
  closed_prs: number;
}

export interface TimeMetrics {
  avg_hours_to_first_review: number;
  avg_hours_to_merge: number;
}

export interface RepositoryActivity {
  id?: string;
  github_repo_id?: number;
  github_repo_name: string;
  open_prs: number;
  merged_prs: number;
  closed_prs: number;
  total_prs: number;
}

export interface Reviewer {
  id?: string;
  name: string;
  github_username: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'commented';
  avatar_url?: string;
}

export interface RecentPR {
  id: string;
  title: string;
  github_pr_number: number;
  status: 'open' | 'merged' | 'closed';
  created_at: string;
  updated_at: string;
  github_repo_name: string;
  author_name: string;
  author_username: string;
  reviewers: Reviewer[];
}

export interface StandupStats {
  opened: number;
  merged: number;
  closed: number;
  reviews_completed: number;
  reviews_pending: number;
  avg_review_time_hours: number;
}

export interface DiscussionPoint {
  id: string;
  text: string;
  type: 'blocker' | 'discussion' | 'announcement';
  created_at: string;
}

export interface PlatformEngagement {
  source: 'github' | 'slack';
  comment_count: number;
}

export interface ReviewerConnection {
  author: string;
  reviewer: string;
  review_count: number;
}

export interface TeamMemberActivity {
  id?: string;
  name: string;
  github_username: string;
  authored_prs: number;
  open_prs: number;
  merged_prs: number;
  reviews_assigned: number;
  reviews_completed: number;
  avg_review_time_hours: number;
  avatar_url?: string;
}

export interface TeamMemberEngagement {
  name: string;
  github_comments: number;
  slack_comments: number;
  avatar_url?: string;
}

export interface WeeklyActivity {
  week: string;
  opened: number;
  merged: number;
  closed: number;
}

export interface DashboardData {
  prStatusCounts: PRStatusCounts;
  timeMetrics: TimeMetrics;
  repositoryActivity: RepositoryActivity[];
  recentPRs: RecentPR[];
  weeklyActivity: WeeklyActivity[];
}

export interface StandupDashboardData {
  stats: StandupStats;
  activePRs: RecentPR[];
  discussionPoints: DiscussionPoint[];
}

export interface AnalyticsDashboardData {
  repositoryBreakdown: RepositoryActivity[];
  prActivity: WeeklyActivity[];
  platformEngagement: PlatformEngagement[];
  reviewFulfillment: {
    total: number;
    completed: number;
    pending: number;
    avg_completion_time: number;
  };
}

export interface CollaborationDashboardData {
  reviewerNetwork: ReviewerConnection[];
  teamMembers: TeamMemberActivity[];
  teamEngagement: TeamMemberEngagement[];
}

export type TimePeriod = 'daily' | 'weekly' | 'monthly';
export type RepositoryFilter = string | null; // repo ID or null for all
export type TeamId = string | '';