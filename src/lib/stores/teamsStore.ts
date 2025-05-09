// src/lib/stores/teamsStore.ts
import { create } from 'zustand';
import { api } from '@/lib/api';
import { Team, TeamMember, CreateTeamInput, UpdateTeamInput } from '@/types/teams';
import { User } from '@/types/database';

interface TeamsStore {
  // State
  teams: Team[];
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  createTeam: (team: CreateTeamInput) => Promise<Team>;
  updateTeam: (id: string, team: UpdateTeamInput) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTeamsStore = create<TeamsStore>((set, get) => ({
  // Initial state
  teams: [],
  members: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/dashboard/teams');
      
      // Map API response to our Team type
      const teamsWithMembers: Team[] = await Promise.all(
        data.map(async (team: any) => {
          // If members are already included in response, map them to TeamMember type
          let members: TeamMember[] | undefined;
          
          if (team.members) {
            members = team.members.map((member: User) => ({
              id: member.id,
              org_id: member.org_id || '', // Provide default value if missing
              name: member.name,
              email: member.email,
              github_username: member.github_username,
              slack_user_id: member.slack_user_id,
              is_admin: member.is_admin,
              github_connected: !!member.github_username,
              slack_connected: !!member.slack_user_id
            }));
          } else {
            // Otherwise fetch members for this team
            const { data: teamMembers } = await api.get(`/dashboard/teams/${team.id}/members`);
            
            // Map to TeamMember type
            members = teamMembers.map((member: User) => ({
              id: member.id,
              org_id: member.org_id || '', // Provide default value if missing
              name: member.name,
              email: member.email,
              github_username: member.github_username,
              slack_user_id: member.slack_user_id,
              is_admin: member.is_admin,
              github_connected: !!member.github_username,
              slack_connected: !!member.slack_user_id
            }));
          }
          
          return {
            id: team.id,
            org_id: team.org_id,
            name: team.name,
            member_ids: team.member_ids,
            members,
            created_at: team.created_at,
            updated_at: team.updated_at
          };
        })
      );
      
      set({ teams: teamsWithMembers, isLoading: false });
    } catch (err) {
      console.error('Error fetching teams:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch teams',
        isLoading: false 
      });
    }
  },
  
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/dashboard/members');
      
      // Map API response to our TeamMember type
      const members: TeamMember[] = data.map((member: User) => ({
        id: member.id,
        org_id: member.org_id || '', // Provide default value if missing
        name: member.name,
        email: member.email,
        github_username: member.github_username,
        slack_user_id: member.slack_user_id,
        is_admin: member.is_admin,
        github_connected: !!member.github_username,
        slack_connected: !!member.slack_user_id
      }));
      
      set({ members, isLoading: false });
    } catch (err) {
      console.error('Error fetching members:', err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch members',
        isLoading: false 
      });
    }
  },
  
  createTeam: async (team: CreateTeamInput) => {
    try {
      const { data } = await api.post('/dashboard/teams', team);
      
      // Map API response to our Team type
      const newTeam: Team = {
        id: data.id,
        org_id: data.org_id,
        name: data.name,
        member_ids: data.member_ids,
        members: data.members?.map((member: User) => ({
          id: member.id,
          org_id: member.org_id || '', // Provide default value if missing
          name: member.name,
          email: member.email,
          github_username: member.github_username,
          slack_user_id: member.slack_user_id,
          is_admin: member.is_admin,
          github_connected: !!member.github_username,
          slack_connected: !!member.slack_user_id
        })),
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      // Update teams list
      set(state => ({
        teams: [...state.teams, newTeam]
      }));
      
      return newTeam;
    } catch (err) {
      console.error('Error creating team:', err);
      throw err;
    }
  },
  
  updateTeam: async (id: string, team: UpdateTeamInput) => {
    try {
      const { data } = await api.put(`/dashboard/teams/${id}`, team);
      
      // Map API response to our Team type
      const updatedTeam: Team = {
        id: data.id,
        org_id: data.org_id,
        name: data.name,
        member_ids: data.member_ids,
        members: data.members?.map((member: User) => ({
          id: member.id,
          org_id: member.org_id || '', // Provide default value if missing
          name: member.name,
          email: member.email,
          github_username: member.github_username,
          slack_user_id: member.slack_user_id,
          is_admin: member.is_admin,
          github_connected: !!member.github_username,
          slack_connected: !!member.slack_user_id
        })),
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      // Update teams list
      set(state => ({
        teams: state.teams.map(t => t.id === id ? updatedTeam : t)
      }));
      
      return updatedTeam;
    } catch (err) {
      console.error('Error updating team:', err);
      throw err;
    }
  },
  
  deleteTeam: async (id: string) => {
    try {
      await api.delete(`/dashboard/teams/${id}`);
      
      // Update teams list
      set(state => ({
        teams: state.teams.filter(t => t.id !== id)
      }));
    } catch (err) {
      console.error('Error deleting team:', err);
      throw err;
    }
  },
  
  clearError: () => set({ error: null })
}));