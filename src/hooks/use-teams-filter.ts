// src/hooks/use-teams-filter.ts
import { useState, useEffect } from 'react';
import { useTeamsStore } from '@/lib/stores/teamsStore';
import { Team } from '@/types/teams';

interface UseTeamsFilterResult {
  selectedTeam: Team | null;
  teams: Team[];
  isLoading: boolean;
  selectTeam: (teamId: string | null) => void;
  teamMemberIds: string[];
  filterByTeam: <T extends { author_id?: string }>(items: T[]) => T[];
}

/**
 * Custom hook for filtering data by team
 */
export function useTeamsFilter(): UseTeamsFilterResult {
  const { teams: storeTeams, isLoading, fetchTeams } = useTeamsStore();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Convert store teams to the correct Team type
  const teams: Team[] = storeTeams.map(team => ({
    id: team.id,
    org_id: team.org_id,
    name: team.name,
    member_ids: team.member_ids,
    members: team.members?.map(member => ({
      id: member.id,
      org_id: member.org_id || '', // Provide a default value if org_id is missing
      name: member.name,
      email: member.email,
      github_username: member.github_username,
      slack_user_id: member.slack_user_id,
      is_admin: member.is_admin,
      github_connected: !!member.github_username,
      slack_connected: !!member.slack_user_id,
      avatar_url: member.avatar_url
    })),
    created_at: team.created_at,
    updated_at: team.updated_at
  }));

  // Find the selected team object
  const selectedTeam = teams.find(team => team.id === selectedTeamId) || null;

  // Get member IDs of selected team
  const teamMemberIds = selectedTeam?.member_ids || [];

  /**
   * Filter items by team members
   * This works on any array of objects that have an author_id property
   */
  const filterByTeam = <T extends { author_id?: string }>(items: T[]): T[] => {
    // If no team is selected or "All Teams" is selected, return all items
    if (!selectedTeam) {
      return items;
    }

    // Filter items by team member IDs
    return items.filter(item => 
      item.author_id && teamMemberIds.includes(item.author_id)
    );
  };

  return {
    selectedTeam,
    teams,
    isLoading,
    selectTeam: setSelectedTeamId,
    teamMemberIds,
    filterByTeam
  };
}