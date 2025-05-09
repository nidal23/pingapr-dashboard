// src/pages/dashboard/TeamsPage.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Check, Edit, Plus, Save, Trash2, User, Users, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamsStore } from "@/lib/stores/teamsStore";
import { useAuth } from "@/lib/stores/authStore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const TeamsPage = () => {
  const { user } = useAuth();
  const { 
    teams,
    members,
    isLoading,
    error,
    fetchTeams,
    fetchMembers,
    createTeam,
    updateTeam,
    deleteTeam
  } = useTeamsStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState<any | null>(null);
  const [teamName, setTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load teams and members on mount
  useEffect(() => {
    fetchTeams();
    fetchMembers();
  }, [fetchTeams, fetchMembers]);

  // Filter members by search query
  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.github_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open dialog for creating a new team
  const handleCreateTeam = () => {
    setActiveTeam(null);
    setTeamName("");
    setSelectedMembers([]);
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing team
  const handleEditTeam = (team: any) => {
    setActiveTeam(team);
    setTeamName(team.name);
    setSelectedMembers(team.member_ids);
    setIsDialogOpen(true);
  };

  // Handle saving a team (create or update)
  const handleSaveTeam = async () => {
    if (!teamName.trim()) {
      // Show error for empty team name
      return;
    }

    try {
      if (activeTeam) {
        // Update existing team
        await updateTeam(activeTeam.id, {
          name: teamName,
          member_ids: selectedMembers
        });
      } else {
        // Create new team
        await createTeam({
          name: teamName,
          member_ids: selectedMembers
        });
      }

      setIsDialogOpen(false);
      // Refresh teams list
      fetchTeams();
    } catch (err) {
      console.error("Error saving team:", err);
    }
  };

  // Handle deleting a team
  const handleDeleteTeam = async (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(teamId);
        // Refresh teams list
        fetchTeams();
      } catch (err) {
        console.error("Error deleting team:", err);
      }
    }
  };

  // Toggle member selection for team editing
  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
            <p className="text-gray-500">Manage your teams and team members</p>
          </div>

          <Skeleton className="h-10 w-32 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-gray-500">Manage your teams and view member statuses</p>
        </div>

        <Tabs defaultValue="custom-teams">
          <TabsList className="mb-6">
            <TabsTrigger value="custom-teams">Custom Teams</TabsTrigger>
            <TabsTrigger value="all-members">All Members</TabsTrigger>
          </TabsList>

          <TabsContent value="custom-teams">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Custom Teams</h2>
              {user?.is_admin && (
                <Button onClick={handleCreateTeam} className="flex items-center gap-2">
                  <Plus size={16} />
                  Create Team
                </Button>
              )}
            </div>

            {teams.length === 0 ? (
              <div className="bg-muted/30 border rounded-lg p-8 text-center">
                <Users size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No teams created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom teams to organize your members and filter dashboards
                </p>
                {user?.is_admin && (
                  <Button onClick={handleCreateTeam}>Create Your First Team</Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <Card key={team.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        {user?.is_admin && (
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditTeam(team)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteTeam(team.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {team.members?.length || 0} members
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {team.members?.slice(0, 5).map((member: any) => (
                            <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${member.github_username}`} />
                              <AvatarFallback>{member.name?.charAt(0) || member.github_username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {(team.members?.length || 0) > 5 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                              +{(team.members?.length || 0) - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-members">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Organization Members</h2>
                <div className="relative max-w-xs">
                  <Input 
                    placeholder="Search members..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map(member => (
                  <Card key={member.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${member.github_username}`} />
                          <AvatarFallback>{member.name?.charAt(0) || member.github_username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name || "Unnamed user"}</p>
                          <p className="text-xs text-muted-foreground truncate">@{member.github_username}</p>
                          {member.email && (
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          )}
                        </div>
                        {member.is_admin && (
                          <Badge className="bg-primary/10 text-primary">Admin</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className={cn(
                          "p-2 rounded-md text-xs flex items-center gap-1.5",
                          member.github_connected
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        )}>
                          {member.github_connected ? (
                            <Check size={14} />
                          ) : (
                            <X size={14} />
                          )}
                          GitHub {member.github_connected ? "Connected" : "Disconnected"}
                        </div>
                        <div className={cn(
                          "p-2 rounded-md text-xs flex items-center gap-1.5",
                          member.slack_connected
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        )}>
                          {member.slack_connected ? (
                            <Check size={14} />
                          ) : (
                            <X size={14} />
                          )}
                          Slack {member.slack_connected ? "Connected" : "Disconnected"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="bg-muted/30 border rounded-lg p-8 text-center">
                  <User size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No members found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for creating or editing teams */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeTeam ? "Edit Team" : "Create New Team"}</DialogTitle>
            <DialogDescription>
              {activeTeam 
                ? "Update team name and members" 
                : "Create a custom team to organize members and filter dashboards"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="teamName" className="text-sm font-medium">
                Team Name
              </label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Members
              </label>
              <div className="border rounded-md max-h-60 overflow-y-auto divide-y">
                {members.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleMemberSelection(member.id)}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md border mr-3 flex items-center justify-center",
                      selectedMembers.includes(member.id) 
                        ? "bg-primary border-primary" 
                        : "border-input"
                    )}>
                      {selectedMembers.includes(member.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${member.github_username}`} />
                      <AvatarFallback>{member.name?.charAt(0) || member.github_username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name || "Unnamed user"}</p>
                      <p className="text-xs text-muted-foreground">@{member.github_username}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedMembers.length} members selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeam} className="gap-2">
              <Save size={16} />
              {activeTeam ? "Update Team" : "Create Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TeamsPage;