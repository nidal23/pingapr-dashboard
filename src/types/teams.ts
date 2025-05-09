// src/types/teams.ts

export interface Team {
  id: string;
  org_id: string;
  name: string;
  member_ids: string[];
  members?: TeamMember[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  org_id: string;
  name?: string;
  email?: string;
  github_username: string;
  slack_user_id?: string;
  is_admin: boolean;
  github_connected: boolean;
  slack_connected: boolean;
}

export interface CreateTeamInput {
  name: string;
  member_ids: string[];
}

export interface UpdateTeamInput {
  name: string;
  member_ids: string[];
}

export interface TeamsState {
  teams: Team[];
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
}