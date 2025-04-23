// src/types/database.ts

// Organization interface
export interface Organization {
    id: string; // UUID
    name: string;
    github_org_id: string;
    slack_workspace_id: string;
    slack_bot_token: string;
    github_installation_id: string;
    settings: {
      pr_reminder_hours: number;
      channel_archive_days: number;
    };
    onboarding_completed: boolean;
    admin_users: string[]; // Array of UUIDs
    github_connected: boolean;
    slack_connected: boolean;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  
  // User interface
  export interface User {
    id: string; // UUID
    org_id: string; // UUID reference to Organization
    name?: string;
    email?: string;
    password?: string; // Note: You may not want to include this in client-side types
    slack_user_id?: string;
    github_username: string;
    github_access_token?: string;
    is_admin: boolean;
    github_token_expires_at?: string; // ISO timestamp
    github_refresh_token?: string;
    github_refresh_token_expires_at?: string; // ISO timestamp
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  
  // Repository interface
  export interface Repository {
    id: string; // UUID
    org_id: string; // UUID reference to Organization
    github_repo_id: string;
    github_repo_name: string;
    is_active: boolean;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  
  // Pull Request interface
  export interface PullRequest {
    id: string; // UUID
    repo_id: string; // UUID reference to Repository
    github_pr_id: string;
    github_pr_number: number;
    title: string;
    description?: string;
    author_id?: string; // UUID reference to User, nullable
    status: 'open' | 'closed' | 'merged'; // Enum values
    slack_channel_id?: string;
    reminder_sent: boolean;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
    merged_at?: string; // ISO timestamp, nullable
    closed_at?: string; // ISO timestamp, nullable
  }
  
  // Review Request interface
  export interface ReviewRequest {
    id: string; // UUID
    pr_id: string; // UUID reference to PullRequest
    reviewer_id: string; // UUID reference to User
    status: 'pending' | 'approved' | 'changes_requested' | 'commented'; // Enum values
    requested_at: string; // ISO timestamp
    completed_at?: string; // ISO timestamp, nullable
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  
  // Comment interface
  export interface Comment {
    id: string; // UUID
    pr_id: string; // UUID reference to PullRequest
    github_comment_id: string;
    slack_thread_ts: string;
    user_id?: string; // UUID reference to User, nullable
    content: string;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }