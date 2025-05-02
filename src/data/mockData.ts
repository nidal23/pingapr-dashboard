
import { format, subDays, subHours, subWeeks } from 'date-fns';

// Type definitions based on the database schema
export interface Organization {
  id: string;
  name: string;
  github_org_id: number;
  github_org_name: string;
  slack_workspace_id: string;
  slack_bot_token: string;
  slack_user_token: string;
  slack_bot_id: string;
  github_installation_id: number;
  settings: string | object;
  github_connected: boolean;
  slack_connected: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  org_id: string;
  name: string;
  email: string;
  password: string;
  slack_user_id: string;
  github_username: string;
  github_access_token: string;
  github_token_expires_at: string;
  github_refresh_token: string;
  github_refresh_token_expires_at: string;
  slack_user_token: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string; // Not in schema but useful for UI
}

export interface Repository {
  id: string;
  org_id: string;
  github_repo_id: number;
  github_repo_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PullRequest {
  id: string;
  repo_id: string;
  github_pr_number: number;
  github_pr_id: number;
  title: string;
  description: string;
  author_id: string;
  slack_channel_id: string;
  status: 'open' | 'merged' | 'closed';
  reminder_sent: boolean;
  merged_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewRequest {
  id: string;
  pr_id: string;
  reviewer_id: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'commented';
  requested_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  pr_id: string;
  github_comment_id: string;
  slack_thread_ts: string;
  parent_comment_id: string | null;
  user_id: string;
  content: string;
  source: 'github' | 'slack';
  comment_type: 'pr_comment' | 'review_summary' | 'line_comment' | 'reply';
  created_at: string;
  updated_at: string;
}

// Types for aggregated data and metrics
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
  github_repo_name: string;
  open_prs: number;
  merged_prs: number;
  closed_prs: number;
  total_prs: number;
}

export interface RecentPR {
  id: string;
  title: string;
  github_pr_number: number;
  status: string;
  created_at: string;
  updated_at: string;
  github_repo_name: string;
  author_name: string;
  author_username: string;
  reviewers: {
    name: string;
    github_username: string;
    status: string;
    avatar_url?: string;
  }[];
}

export interface StandupStats {
  opened: number;
  merged: number;
  closed: number;
  reviews_completed: number;
  reviews_pending: number;
  avg_review_time_hours: number;
}

export interface PlatformEngagement {
  source: string;
  comment_count: number;
}

export interface ReviewNetwork {
  author: string;
  reviewer: string;
  review_count: number;
}

export interface TeamMemberActivity {
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

// Generate dummy data
export const generateMockData = () => {
  // Organization
  const organization: Organization = {
    id: "adfbd9f5-9aa5-4230-8099-45ec0c555e09",
    name: "Acme Technologies",
    github_org_id: 12345678,
    github_org_name: "acme-tech",
    slack_workspace_id: "T01ABCDEFG",
    slack_bot_token: "xoxb-1234567890-1234567890123-abcdefghijklmnopqrstuvwx",
    slack_user_token: "xoxp-1234567890-1234567890123-1234567890123-abcdefghijklmnopqrstuvwxyz",
    slack_bot_id: "B01ABCDEFG",
    github_installation_id: 987654321,
    settings: {
      auto_create_channels: true,
      channel_prefix: "pr-",
      notify_on_mentions: true,
      notify_on_reviews: true
    },
    github_connected: true,
    slack_connected: true,
    created_at: "2025-01-15T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z"
  };

  // Users
  const users: User[] = [
    {
      id: "b9efe585-cb0f-4844-af63-93495ef695f5",
      org_id: organization.id,
      name: "Sarah Johnson",
      email: "sarah.johnson@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0000",
      github_username: "sarahj",
      github_access_token: "gho_qae77062rhm",
      github_token_expires_at: "2025-07-01T00:00:00.000Z",
      github_refresh_token: "ghr_3x4ha6bvvz7",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-c5wb70gb",
      is_admin: true,
      created_at: "2025-01-20T00:00:00.000Z",
      updated_at: "2025-03-15T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=sarah.johnson`
    },
    {
      id: "c8faa7d9-8f76-4d25-a913-5e12cb76543a",
      org_id: organization.id,
      name: "David Chen",
      email: "david.chen@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0001",
      github_username: "dchen",
      github_access_token: "gho_ds7899xzbq1",
      github_token_expires_at: "2025-07-05T00:00:00.000Z",
      github_refresh_token: "ghr_9p2yqm45kl",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-h7jk23m4",
      is_admin: false,
      created_at: "2025-01-22T00:00:00.000Z",
      updated_at: "2025-03-18T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=david.chen`
    },
    {
      id: "d7eae128-a5df-4836-b045-7a1d2b6a9c50",
      org_id: organization.id,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0002",
      github_username: "emilyr",
      github_access_token: "gho_w6yt89pqrs",
      github_token_expires_at: "2025-07-10T00:00:00.000Z",
      github_refresh_token: "ghr_34k7m6jn2b",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-z4m9p6y7",
      is_admin: false,
      created_at: "2025-01-25T00:00:00.000Z",
      updated_at: "2025-03-20T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=emily.rodriguez`
    },
    {
      id: "e6bc47f3-d4a2-4962-89b4-1234abcdef56",
      org_id: organization.id,
      name: "Michael Smith",
      email: "michael.smith@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0003",
      github_username: "msmith",
      github_access_token: "gho_12k34jhg56",
      github_token_expires_at: "2025-07-15T00:00:00.000Z",
      github_refresh_token: "ghr_98j7h6g5f4",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-a2b3c4d5",
      is_admin: false,
      created_at: "2025-01-28T00:00:00.000Z",
      updated_at: "2025-03-22T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=michael.smith`
    },
    {
      id: "f5ad29b1-c7e4-4507-9b12-9876fedcba54",
      org_id: organization.id,
      name: "Jessica Lee",
      email: "jessica.lee@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0004",
      github_username: "jlee",
      github_access_token: "gho_j9k8l7m6n5",
      github_token_expires_at: "2025-07-20T00:00:00.000Z",
      github_refresh_token: "ghr_o2p3q4r5s6",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-t7u8v9w0",
      is_admin: false,
      created_at: "2025-01-30T00:00:00.000Z",
      updated_at: "2025-03-25T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=jessica.lee`
    },
    {
      id: "g4c38a0e-d6f2-4195-8a23-1357924680bd",
      org_id: organization.id,
      name: "Alex Turner",
      email: "alex.turner@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0005",
      github_username: "aturner",
      github_access_token: "gho_q5w6e7r8t9",
      github_token_expires_at: "2025-07-25T00:00:00.000Z",
      github_refresh_token: "ghr_y2u3i4o5p6",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-a9s8d7f6",
      is_admin: false,
      created_at: "2025-02-02T00:00:00.000Z",
      updated_at: "2025-03-28T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=alex.turner`
    },
    {
      id: "h3b27d9c-e5f4-4083-7b12-2468ace97531",
      org_id: organization.id,
      name: "Ryan Martinez",
      email: "ryan.martinez@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0006",
      github_username: "rmartinez",
      github_access_token: "gho_a2s3d4f5g6",
      github_token_expires_at: "2025-08-01T00:00:00.000Z",
      github_refresh_token: "ghr_h7j8k9l0z1",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-x2c3v4b5",
      is_admin: false,
      created_at: "2025-02-05T00:00:00.000Z",
      updated_at: "2025-04-01T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=ryan.martinez`
    },
    {
      id: "i2a16c8b-d4e3-3972-6a01-1357913579bd",
      org_id: organization.id,
      name: "Sophia Garcia",
      email: "sophia.garcia@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0007",
      github_username: "sgarcia",
      github_access_token: "gho_n2m3b4v5c6",
      github_token_expires_at: "2025-08-05T00:00:00.000Z",
      github_refresh_token: "ghr_x1z2c3v4b5",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-n6m7k8j9",
      is_admin: false,
      created_at: "2025-02-08T00:00:00.000Z",
      updated_at: "2025-04-05T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=sophia.garcia`
    },
    {
      id: "j1e05a7f-c3b2-2861-5e90-2468024681ac",
      org_id: organization.id,
      name: "Daniel Kim",
      email: "daniel.kim@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0008",
      github_username: "dkim",
      github_access_token: "gho_p2l3k4j5h6",
      github_token_expires_at: "2025-08-10T00:00:00.000Z",
      github_refresh_token: "ghr_g7f8d9s0a1",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-q9w8e7r6",
      is_admin: false,
      created_at: "2025-02-10T00:00:00.000Z",
      updated_at: "2025-04-08T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=daniel.kim`
    },
    {
      id: "k0d94e6a-b2a1-1750-4d89-1357802469ca",
      org_id: organization.id,
      name: "Olivia Wilson",
      email: "olivia.wilson@acme-tech.com",
      password: "hashed_password_here",
      slack_user_id: "U01ABC0009",
      github_username: "owilson",
      github_access_token: "gho_t5y6u7i8o9",
      github_token_expires_at: "2025-08-15T00:00:00.000Z",
      github_refresh_token: "ghr_t5r6e7w8q9",
      github_refresh_token_expires_at: "2025-12-31T00:00:00.000Z",
      slack_user_token: "xoxp-user-z2x3c4v5",
      is_admin: false,
      created_at: "2025-02-12T00:00:00.000Z",
      updated_at: "2025-04-10T00:00:00.000Z",
      avatar_url: `https://i.pravatar.cc/150?u=olivia.wilson`
    }
  ];

  // Repositories
  const repositories: Repository[] = [
    {
      id: "r1a23b45-c6d7-8e90-1f2a-3b4c5d6e7f8g",
      org_id: organization.id,
      github_repo_id: 98765432,
      github_repo_name: "acme-api",
      is_active: true,
      created_at: "2025-01-10T00:00:00.000Z",
      updated_at: "2025-01-10T00:00:00.000Z"
    },
    {
      id: "r2b34c56-d7e8-9f01-2g3a-4b5c6d7e8f9h",
      org_id: organization.id,
      github_repo_id: 98765433,
      github_repo_name: "acme-web",
      is_active: true,
      created_at: "2025-01-12T00:00:00.000Z",
      updated_at: "2025-01-12T00:00:00.000Z"
    },
    {
      id: "r3c45d67-e8f9-0g12-3h4a-5b6c7d8e9f0i",
      org_id: organization.id,
      github_repo_id: 98765434,
      github_repo_name: "acme-mobile",
      is_active: true,
      created_at: "2025-01-15T00:00:00.000Z",
      updated_at: "2025-01-15T00:00:00.000Z"
    },
    {
      id: "r4d56e78-f90g-1h23-4i5a-6b7c8d9e0f1j",
      org_id: organization.id,
      github_repo_id: 98765435,
      github_repo_name: "acme-docs",
      is_active: true,
      created_at: "2025-01-18T00:00:00.000Z",
      updated_at: "2025-01-18T00:00:00.000Z"
    },
    {
      id: "r5e67f89-0g1h-2i34-5j6a-7b8c9d0e1f2k",
      org_id: organization.id,
      github_repo_id: 98765436,
      github_repo_name: "acme-shared",
      is_active: true,
      created_at: "2025-01-20T00:00:00.000Z",
      updated_at: "2025-01-20T00:00:00.000Z"
    }
  ];

  // Create PRs
  const pullRequests: PullRequest[] = [];
  const prTitles = [
    "Fix authentication flow",
    "Add product filtering",
    "Refactor database queries",
    "Update dependencies",
    "Implement search functionality",
    "Fix CSS for mobile devices",
    "Add unit tests for auth module",
    "Optimize image loading",
    "Create new API endpoints",
    "Update documentation"
  ];
  
  // Generate 50 PRs
  for (let i = 0; i < 50; i++) {
    const createdAt = subDays(new Date(), Math.floor(Math.random() * 90)); // Within last 3 months
    const repoIndex = Math.floor(Math.random() * repositories.length);
    const authorIndex = Math.floor(Math.random() * users.length);
    const status = ['open', 'merged', 'closed'][Math.floor(Math.random() * 3)] as 'open' | 'merged' | 'closed';
    
    let mergedAt = null;
    let closedAt = null;
    
    if (status === 'merged') {
      mergedAt = format(subHours(new Date(), Math.floor(Math.random() * 24 * 60)), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    } else if (status === 'closed') {
      closedAt = format(subHours(new Date(), Math.floor(Math.random() * 24 * 30)), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    
    const title = `${prTitles[i % prTitles.length]} ${i + 1}`;
    
    pullRequests.push({
      id: `pr${i}-${Math.random().toString(36).substring(2, 11)}`,
      repo_id: repositories[repoIndex].id,
      github_pr_number: 100 + i,
      github_pr_id: 500000 + i,
      title,
      description: `This pull request implements ${title.toLowerCase()}. Please review the changes.`,
      author_id: users[authorIndex].id,
      slack_channel_id: `C01PR${i}`,
      status,
      reminder_sent: Math.random() > 0.5,
      merged_at: mergedAt,
      closed_at: closedAt,
      created_at: format(createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      updated_at: format(subHours(new Date(), Math.floor(Math.random() * 24)), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    });
  }
  
  // Generate 100+ review requests
  const reviewRequests: ReviewRequest[] = [];
  const statuses = ['pending', 'approved', 'changes_requested', 'commented'];
  
  for (const pr of pullRequests) {
    // Each PR gets 2-4 reviewers
    const numReviewers = Math.floor(Math.random() * 3) + 2;
    const reviewerIndices = new Set<number>();
    
    // Make sure we don't assign the author as a reviewer
    const authorIndex = users.findIndex(user => user.id === pr.author_id);
    
    while (reviewerIndices.size < numReviewers) {
      const reviewerIndex = Math.floor(Math.random() * users.length);
      if (reviewerIndex !== authorIndex) {
        reviewerIndices.add(reviewerIndex);
      }
    }
    
    for (const reviewerIndex of reviewerIndices) {
      const requestedAt = new Date(pr.created_at);
      // Add some random hours to the PR creation time
      requestedAt.setHours(requestedAt.getHours() + Math.floor(Math.random() * 5));
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      let completedAt = null;
      
      if (status !== 'pending') {
        // Completion time is after the request time
        const completionDate = new Date(requestedAt);
        completionDate.setHours(completionDate.getHours() + Math.floor(Math.random() * 48) + 1);
        completedAt = format(completionDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      }
      
      reviewRequests.push({
        id: `rr${Math.random().toString(36).substring(2, 11)}`,
        pr_id: pr.id,
        reviewer_id: users[reviewerIndex].id,
        status: status as 'pending' | 'approved' | 'changes_requested' | 'commented',
        requested_at: format(requestedAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        completed_at: completedAt,
        created_at: format(requestedAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updated_at: format(
          completedAt ? new Date(completedAt) : requestedAt, 
          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        )
      });
    }
  }
  
  // Generate 200+ comments
  const comments: Comment[] = [];
  const commentTypes = ['pr_comment', 'review_summary', 'line_comment', 'reply'];
  const commentSources = ['github', 'slack'];
  
  // Example comment contents
  const commentContents = [
    "LGTM! Let's merge this.",
    "Nice work on this feature!",
    "Could you explain this approach a bit more?",
    "I think this could be optimized further.",
    "Have you considered using a different approach here?",
    "This looks good to me. Approved!",
    "There's a small typo in this function name.",
    "The test cases look comprehensive.",
    "Can we add some more documentation here?",
    "This solution is very elegant!"
  ];
  
  // Generate more review comments to have realistic conversations
  for (let i = 0; i < 200; i++) {
    const prIndex = Math.floor(Math.random() * pullRequests.length);
    const userIndex = Math.floor(Math.random() * users.length);
    const commentType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
    const source = commentSources[Math.floor(Math.random() * commentSources.length)];
    const content = commentContents[Math.floor(Math.random() * commentContents.length)];
    
    const pr = pullRequests[prIndex];
    const createdAt = new Date(pr.created_at);
    // Add some random hours to the PR creation time
    createdAt.setHours(createdAt.getHours() + Math.floor(Math.random() * 72) + 1);
    
    // Randomly decide if this is a reply to another comment
    const isReply = Math.random() > 0.7;
    let parentCommentId = null;
    
    if (isReply && comments.length > 0) {
      // Find a comment from the same PR to reply to
      const prComments = comments.filter(c => c.pr_id === pr.id);
      if (prComments.length > 0) {
        const parentComment = prComments[Math.floor(Math.random() * prComments.length)];
        parentCommentId = parentComment.id;
      }
    }
    
    comments.push({
      id: `c${i}-${Math.random().toString(36).substring(2, 11)}`,
      pr_id: pr.id,
      github_comment_id: `github_${Math.random().toString(36).substring(2, 11)}`,
      slack_thread_ts: `slack_${Math.random().toString(36).substring(2, 11)}`,
      parent_comment_id: parentCommentId,
      user_id: users[userIndex].id,
      content,
      source: source as 'github' | 'slack',
      comment_type: commentType as 'pr_comment' | 'review_summary' | 'line_comment' | 'reply',
      created_at: format(createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      updated_at: format(createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    });
  }
  
  return {
    organization,
    users,
    repositories,
    pullRequests,
    reviewRequests,
    comments
  };
};

// Helper functions to calculate metrics based on the mock data
export const calculateMetrics = (mockData: ReturnType<typeof generateMockData>) => {
  const { pullRequests, reviewRequests, comments, repositories, users } = mockData;
  
  // PR Status Counts
  const prStatusCounts: PRStatusCounts = {
    total_prs: pullRequests.length,
    open_prs: pullRequests.filter(pr => pr.status === 'open').length,
    merged_prs: pullRequests.filter(pr => pr.status === 'merged').length,
    closed_prs: pullRequests.filter(pr => pr.status === 'closed').length
  };
  
  // Time-based Metrics
  let totalTimeToFirstReview = 0;
  let prWithFirstReview = 0;
  let totalTimeToMerge = 0;
  let mergedPRs = 0;
  
  pullRequests.forEach(pr => {
    // Find the earliest completed review for this PR
    const prReviewRequests = reviewRequests.filter(rr => rr.pr_id === pr.id && rr.completed_at);
    if (prReviewRequests.length > 0) {
      // Sort by completed_at and get the earliest
      prReviewRequests.sort((a, b) => {
        return new Date(a.completed_at!).getTime() - new Date(b.completed_at!).getTime();
      });
      
      const earliestReview = prReviewRequests[0];
      const prCreatedAt = new Date(pr.created_at).getTime();
      const reviewCompletedAt = new Date(earliestReview.completed_at!).getTime();
      
      const hoursToFirstReview = (reviewCompletedAt - prCreatedAt) / (1000 * 60 * 60);
      totalTimeToFirstReview += hoursToFirstReview;
      prWithFirstReview++;
    }
    
    // Calculate time to merge
    if (pr.status === 'merged' && pr.merged_at) {
      const prCreatedAt = new Date(pr.created_at).getTime();
      const prMergedAt = new Date(pr.merged_at).getTime();
      
      const hoursToMerge = (prMergedAt - prCreatedAt) / (1000 * 60 * 60);
      totalTimeToMerge += hoursToMerge;
      mergedPRs++;
    }
  });
  
  const timeMetrics: TimeMetrics = {
    avg_hours_to_first_review: prWithFirstReview > 0 ? totalTimeToFirstReview / prWithFirstReview : 0,
    avg_hours_to_merge: mergedPRs > 0 ? totalTimeToMerge / mergedPRs : 0
  };
  
  // Repository Activity
  const repositoryActivity: RepositoryActivity[] = repositories.map(repo => {
    const repoPRs = pullRequests.filter(pr => pr.repo_id === repo.id);
    
    return {
      github_repo_name: repo.github_repo_name,
      open_prs: repoPRs.filter(pr => pr.status === 'open').length,
      merged_prs: repoPRs.filter(pr => pr.status === 'merged').length,
      closed_prs: repoPRs.filter(pr => pr.status === 'closed').length,
      total_prs: repoPRs.length
    };
  });
  
  // Recent PRs with Reviewers
  const recentPRs: RecentPR[] = pullRequests
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10)
    .map(pr => {
      const repo = repositories.find(r => r.id === pr.repo_id)!;
      const author = users.find(u => u.id === pr.author_id)!;
      const prReviewRequests = reviewRequests.filter(rr => rr.pr_id === pr.id);
      
      const reviewers = prReviewRequests.map(rr => {
        const reviewer = users.find(u => u.id === rr.reviewer_id)!;
        return {
          name: reviewer.name,
          github_username: reviewer.github_username,
          status: rr.status,
          avatar_url: reviewer.avatar_url
        };
      });
      
      return {
        id: pr.id,
        title: pr.title,
        github_pr_number: pr.github_pr_number,
        status: pr.status,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        github_repo_name: repo.github_repo_name,
        author_name: author.name,
        author_username: author.github_username,
        reviewers
      };
    });
  
  // Standup Stats
  const today = new Date();
  const yesterday = subDays(today, 1);
  const yesterdayStart = new Date(yesterday);
  yesterdayStart.setHours(0, 0, 0, 0);
  
  const standupStats: StandupStats = {
    opened: pullRequests.filter(pr => new Date(pr.created_at) >= yesterdayStart).length,
    merged: pullRequests.filter(pr => pr.merged_at && new Date(pr.merged_at) >= yesterdayStart).length,
    closed: pullRequests.filter(pr => pr.closed_at && new Date(pr.closed_at) >= yesterdayStart).length,
    reviews_completed: reviewRequests.filter(rr => rr.completed_at && new Date(rr.completed_at) >= yesterdayStart).length,
    reviews_pending: reviewRequests.filter(rr => rr.status === 'pending').length,
    avg_review_time_hours: calculateAverageReviewTime(reviewRequests)
  };
  
  // Platform Engagement
  const platformEngagement: PlatformEngagement[] = [
    {
      source: 'github',
      comment_count: comments.filter(c => c.source === 'github').length
    },
    {
      source: 'slack',
      comment_count: comments.filter(c => c.source === 'slack').length
    }
  ];
  
  // Review Network
  const reviewNetworkMap = new Map<string, Map<string, number>>();
  
  reviewRequests.forEach(rr => {
    const pr = pullRequests.find(p => p.id === rr.pr_id)!;
    const author = users.find(u => u.id === pr.author_id)!;
    const reviewer = users.find(u => u.id === rr.reviewer_id)!;
    
    if (!reviewNetworkMap.has(author.name)) {
      reviewNetworkMap.set(author.name, new Map<string, number>());
    }
    
    const authorMap = reviewNetworkMap.get(author.name)!;
    authorMap.set(reviewer.name, (authorMap.get(reviewer.name) || 0) + 1);
  });
  
  const reviewNetwork: ReviewNetwork[] = [];
  
  reviewNetworkMap.forEach((reviewerMap, author) => {
    reviewerMap.forEach((count, reviewer) => {
      reviewNetwork.push({
        author,
        reviewer,
        review_count: count
      });
    });
  });
  
  // Team Member Activity
  const teamMemberActivity: TeamMemberActivity[] = users.map(user => {
    const authoredPRs = pullRequests.filter(pr => pr.author_id === user.id);
    const assignedReviews = reviewRequests.filter(rr => rr.reviewer_id === user.id);
    const completedReviews = assignedReviews.filter(rr => rr.status !== 'pending');
    
    let totalReviewTime = 0;
    let reviewsWithTime = 0;
    
    completedReviews.forEach(rr => {
      if (rr.completed_at && rr.requested_at) {
        const requestedAt = new Date(rr.requested_at).getTime();
        const completedAt = new Date(rr.completed_at).getTime();
        
        const reviewTimeHours = (completedAt - requestedAt) / (1000 * 60 * 60);
        totalReviewTime += reviewTimeHours;
        reviewsWithTime++;
      }
    });
    
    return {
      name: user.name,
      github_username: user.github_username,
      authored_prs: authoredPRs.length,
      open_prs: authoredPRs.filter(pr => pr.status === 'open').length,
      merged_prs: authoredPRs.filter(pr => pr.status === 'merged').length,
      reviews_assigned: assignedReviews.length,
      reviews_completed: completedReviews.length,
      avg_review_time_hours: reviewsWithTime > 0 ? totalReviewTime / reviewsWithTime : 0,
      avatar_url: user.avatar_url
    };
  });
  
  // Team Member Engagement
  const teamMemberEngagement: TeamMemberEngagement[] = users.map(user => {
    const userComments = comments.filter(c => c.user_id === user.id);
    
    return {
      name: user.name,
      github_comments: userComments.filter(c => c.source === 'github').length,
      slack_comments: userComments.filter(c => c.source === 'slack').length,
      avatar_url: user.avatar_url
    };
  });
  
  // Weekly PR Activity
  const weeklyActivity: WeeklyActivity[] = [];
  
  // Get the start of 12 weeks ago
  const startDate = subWeeks(today, 12);
  
  // Create a map of week start dates to activity counts
  const weeklyActivityMap = new Map<string, { opened: number; merged: number; closed: number }>();
  
  // Initialize the map with zeros for all 12 weeks
  for (let i = 0; i < 12; i++) {
    const weekStart = format(subWeeks(today, i), 'yyyy-MM-dd');
    weeklyActivityMap.set(weekStart, { opened: 0, merged: 0, closed: 0 });
  }
  
  // Count activity by week
  pullRequests.forEach(pr => {
    const createdDate = new Date(pr.created_at);
    
    if (createdDate >= startDate) {
      const weekStart = format(createdDate, 'yyyy-MM-dd');
      const week = weeklyActivityMap.get(weekStart);
      
      if (week) {
        week.opened++;
      }
    }
    
    if (pr.merged_at) {
      const mergedDate = new Date(pr.merged_at);
      
      if (mergedDate >= startDate) {
        const weekStart = format(mergedDate, 'yyyy-MM-dd');
        const week = weeklyActivityMap.get(weekStart);
        
        if (week) {
          week.merged++;
        }
      }
    }
    
    if (pr.closed_at && !pr.merged_at) {
      const closedDate = new Date(pr.closed_at);
      
      if (closedDate >= startDate) {
        const weekStart = format(closedDate, 'yyyy-MM-dd');
        const week = weeklyActivityMap.get(weekStart);
        
        if (week) {
          week.closed++;
        }
      }
    }
  });
  
  // Convert the map to an array
  weeklyActivityMap.forEach((value, key) => {
    weeklyActivity.push({
      week: key,
      opened: value.opened,
      merged: value.merged,
      closed: value.closed
    });
  });
  
  weeklyActivity.sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  
  return {
    prStatusCounts,
    timeMetrics,
    repositoryActivity,
    recentPRs,
    standupStats,
    platformEngagement,
    reviewNetwork,
    teamMemberActivity,
    teamMemberEngagement,
    weeklyActivity
  };
};

function calculateAverageReviewTime(reviewRequests: ReviewRequest[]): number {
  const completedReviews = reviewRequests.filter(rr => rr.status !== 'pending' && rr.completed_at && rr.requested_at);
  
  if (completedReviews.length === 0) {
    return 0;
  }
  
  let totalReviewTime = 0;
  
  completedReviews.forEach(rr => {
    const requestedAt = new Date(rr.requested_at).getTime();
    const completedAt = new Date(rr.completed_at!).getTime();
    
    const reviewTimeHours = (completedAt - requestedAt) / (1000 * 60 * 60);
    totalReviewTime += reviewTimeHours;
  });
  
  return totalReviewTime / completedReviews.length;
}

// Create and export a singleton instance of the data
export const mockData = generateMockData();
export const metrics = calculateMetrics(mockData);