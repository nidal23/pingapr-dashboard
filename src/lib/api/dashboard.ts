// src/lib/api/dashboard.ts
import { api } from '@/lib/api';
import {
  DashboardData,
  StandupDashboardData,
  AnalyticsDashboardData,
  CollaborationDashboardData,
  TimePeriod,
  RepositoryFilter,
  DiscussionPoint,
  TeamId
} from '@/types/dashboard';

export const dashboardApi = {
  // Main Dashboard API
  fetchDashboardData: async (): Promise<DashboardData> => {
    const { data } = await api.get('/dashboard/metrics');
    return data;
  },

  // Standup Dashboard API
  fetchStandupData: async (
    timePeriod: TimePeriod = 'daily',
    repoId: RepositoryFilter = null,
    teamId: string = ''
  ): Promise<StandupDashboardData> => {
    const params = new URLSearchParams();
    if (timePeriod) params.append('period', timePeriod);
    if (repoId) params.append('repoId', repoId);
    if (teamId) params.append('teamId', teamId);

    const { data } = await api.get(`/dashboard/standup?${params.toString()}`);
    return data;
  },

  saveDiscussionPoint: async (point: Omit<DiscussionPoint, 'id' | 'created_at'>): Promise<DiscussionPoint> => {
    const { data } = await api.post('/dashboard/standup/discussion-points', point);
    return data;
  },

  deleteDiscussionPoint: async (id: string): Promise<void> => {
    await api.delete(`/dashboard/standup/discussion-points/${id}`);
  },

  // PR Analytics Dashboard API
  fetchAnalyticsData: async (
  timePeriod: TimePeriod = 'monthly',
  repoId: RepositoryFilter = null,
  teamId: string | null = null
): Promise<AnalyticsDashboardData> => {
  const params = new URLSearchParams();
  if (timePeriod) params.append('period', timePeriod);
  if (repoId) params.append('repoId', repoId);
  if (teamId) params.append('teamId', teamId);

  const { data } = await api.get(`/dashboard/analytics?${params.toString()}`);
  return data;
},


  // Team Collaboration Dashboard API
  fetchCollaborationData: async (
    timePeriod: TimePeriod = 'monthly',
    repoId: RepositoryFilter = null,
    teamId: TeamId = ''
  ): Promise<CollaborationDashboardData> => {
    const params = new URLSearchParams();
    if (timePeriod) params.append('period', timePeriod);
    if (repoId) params.append('repoId', repoId);
    if(teamId) params.append('teamId', teamId);

    const { data } = await api.get(`/dashboard/collaboration?${params.toString()}`);
    return data;
  },

  // Repository data
  fetchRepositories: async () => {
    const { data } = await api.get('/github/repositories');
    return data;
  }
};