// src/components/onboarding/UserMappingStep.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Search, UserPlus, Check, RefreshCw, Loader2, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitHubUser, SlackUser, UserMapping } from "@/types/onboarding";
import { useOnboarding } from "@/lib/stores/onboardingStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";

interface UserMappingStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const UserMappingStep: React.FC<UserMappingStepProps> = ({
  onNext,
  onPrev,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAutoMapping, setIsAutoMapping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [githubUsers, setGithubUsers] = useState<GitHubUser[]>([]);
  const [slackUsers, setSlackUsers] = useState<SlackUser[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [identifyingSelf, setIdentifyingSelf] = useState(false);
  const [selectedGithubUsername, setSelectedGithubUsername] = useState("");
  const [selectedSlackUserId, setSelectedSlackUserId] = useState("");
  
  const { 
    userMappings, 
    updateUserMappings,
    fetchGithubUsers,
    fetchSlackUsers,
    currentUser,
    fetchCurrentUser
  } = useOnboarding();

  // Load GitHub and Slack users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        
        // Make sure we have the current user
        let user = currentUser;
        if (!user) {
          try {
            user = await fetchCurrentUser();
          } catch (err) {
            console.error('Error fetching current user:', err);
          }
        }
        
        // Fetch GitHub and Slack users
        const [githubData, slackData] = await Promise.all([
          fetchGithubUsers(),
          fetchSlackUsers()
        ]);
        
        setGithubUsers(githubData);
        setSlackUsers(slackData);
        
        // Check if the current user needs to identify themselves
        // If they don't have both GitHub username and Slack ID set
        if (user && (!user.github_username || !user.slack_user_id)) {
          setIdentifyingSelf(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  const filteredGithubUsers = githubUsers.filter(user => 
    ((user.username || user.login || '') as string).toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((user.name || '') as string).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAutoMap = async () => {
  try {
    setIsAutoMapping(true);
    
    // Auto-map users based on name or email similarity
    const autoMappings = githubUsers.map(githubUser => {
      // Try to match by name
      let slackUser = slackUsers.find(
        slackUser => (slackUser.name || '').toLowerCase() === (githubUser.name || '').toLowerCase()
      );
      
      // If no match by name, try matching by email
      if (!slackUser && githubUser.email) {
        slackUser = slackUsers.find(
          slackUser => (slackUser.email || '').toLowerCase() === githubUser.email?.toLowerCase()
        );
      }
      
      if (slackUser) {
        return {
          githubUsername: (githubUser.username || githubUser.login) as string,
          slackUserId: slackUser.id,
          isAdmin: false,
          avatarUrl: githubUser.avatar_url || githubUser.avatarUrl // Ensure avatar URL is included
        };
      }
      
      return null;
    }).filter(Boolean) as UserMapping[];
    
    // Preserve any existing admin mappings
    const existingAdminMappings = userMappings.filter(mapping => mapping.isAdmin);
    
    // Combine existing admin mappings with new auto-mappings
    const combinedMappings = [
      ...existingAdminMappings,
      ...autoMappings.filter(m => 
        !existingAdminMappings.some(e => e.githubUsername === m.githubUsername)
      )
    ];
    
    // Save mappings
    await updateUserMappings(combinedMappings);
    toast.success(`Auto-mapped ${autoMappings.length} users`);
  } catch (error) {
    console.error('Error auto-mapping users:', error);
    toast.error('Failed to auto-map users');
  } finally {
    setIsAutoMapping(false);
  }
};

// toggleAdmin function in UserMappingStep.tsx
const toggleAdmin = async (githubUsername: string) => {
  try {
    // Check if we're trying to have more than 2 admins
    const currentAdmins = userMappings.filter(m => m.isAdmin);
    const isCurrentlyAdmin = userMappings.find(m => m.githubUsername === githubUsername)?.isAdmin || false;
    
    if (currentAdmins.length >= 2 && !isCurrentlyAdmin) {
      toast.error("You can only have up to 2 admins per organization");
      return;
    }
    
    // Update mappings, making sure to preserve avatarUrl
    const updatedMappings = userMappings.map(mapping => {
      if (mapping.githubUsername === githubUsername) {
        return { 
          ...mapping, 
          isAdmin: !mapping.isAdmin 
        };
      }
      return mapping;
    });
    
    await updateUserMappings(updatedMappings);
  } catch (error) {
    console.error('Error toggling admin status:', error);
    toast.error('Failed to update admin status');
  }
};

const assignSlackUser = async (githubUsername: string, slackUserId: string) => {
  try {
    setIsSaving(true);
    // Check if mapping already exists
    const existingMappingIndex = userMappings.findIndex(
      mapping => mapping.githubUsername === githubUsername
    );
    
    let updatedMappings;
    
    if (existingMappingIndex >= 0) {
      // Update existing mapping
      updatedMappings = [...userMappings];
      updatedMappings[existingMappingIndex].slackUserId = slackUserId;
    } else {
      // Create new mapping
      const githubUser = githubUsers.find(user => 
        (user.username || user.login) === githubUsername
      );
      
      if (githubUser) {
        updatedMappings = [
          ...userMappings,
          {
            githubUsername,
            slackUserId,
            isAdmin: false, // Default to non-admin for new mappings
            avatarUrl: githubUser.avatar_url || githubUser.avatarUrl // Ensure we get the avatar URL
          }
        ];
      } else {
        setIsSaving(false);
        return; // Can't create mapping without GitHub user
      }
    }
    
    await updateUserMappings(updatedMappings);
    setIsSaving(false);
  } catch (error) {
    console.error('Error assigning Slack user:', error);
    toast.error('Failed to assign Slack user');
    setIsSaving(false);
  }
};

// Refined handleSetSelfAsAdmin function in UserMappingStep.tsx
const handleSetSelfAsAdmin = async () => {
  if (!selectedGithubUsername || !selectedSlackUserId) {
    toast.error("Please select both your GitHub username and Slack account");
    return;
  }
  
  try {
    setIsSaving(true);
    
    // Get the GitHub user object from our list
    const githubUser = githubUsers.find(user => 
      (user.username || user.login) === selectedGithubUsername
    );
    
    if (!githubUser) {
      setIsSaving(false);
      toast.error("GitHub user not found");
      return;
    }
    
    // Get avatar URL from GitHub user
    const avatarUrl = githubUser.avatar_url || githubUser.avatarUrl;
    
    // Create the request payload - only include avatarUrl if it exists
    const payload: {
      githubUsername: string;
      slackUserId: string;
      avatarUrl?: string;
    } = {
      githubUsername: selectedGithubUsername,
      slackUserId: selectedSlackUserId
    };
    
    // Only add avatarUrl if it exists
    if (avatarUrl) {
      payload.avatarUrl = avatarUrl;
    }
    
    // Make the API call with the payload
    await api.post('/auth/update-identities', payload);
    
    // Refresh the current user data
    await fetchCurrentUser();
    
    // Create admin mapping
    const adminMapping: UserMapping = {
      githubUsername: selectedGithubUsername,
      slackUserId: selectedSlackUserId,
      isAdmin: true,
      avatarUrl: avatarUrl
    };
    
    // Make sure to update or add this mapping to the existing mappings
    const existingIndex = userMappings.findIndex(m => m.githubUsername === selectedGithubUsername);
    let newMappings;
    
    if (existingIndex >= 0) {
      newMappings = [...userMappings];
      newMappings[existingIndex] = adminMapping;
    } else {
      newMappings = [...userMappings, adminMapping];
    }
    
    // Now update the mappings
    await updateUserMappings(newMappings);
    
    setIdentifyingSelf(false);
    toast.success("You've been set as an admin");
  } catch (error: any) {
    console.error('Error setting admin identity:', error);
    
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Failed to set admin identity");
    }
  } finally {
    setIsSaving(false);
  }
};

  const getGithubUsername = (user: GitHubUser): string => {
    return (user.username || user.login) as string;
  };

  const getGithubAvatar = (user: GitHubUser): string | undefined => {
    return user.avatar_url || user.avatarUrl;
  };

  const handleNextClick = () => {
    if (userMappings.length === 0) {
      toast.error("Please map at least one user before proceeding");
      return;
    }
    
    // Check if at least one admin is set
    const hasAdmin = userMappings.some(m => m.isAdmin);
    if (!hasAdmin) {
      toast.error("Please set at least one admin user");
      return;
    }
    
    onNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Map GitHub Users to Slack</CardTitle>
          <CardDescription>
            Match your GitHub users to their Slack accounts for proper notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="animate-spin text-primary mb-4" />
              <span>Loading users...</span>
            </div>
          ) : (
            <>
              {identifyingSelf && (
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 mb-6">
                  <User className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>Please identify yourself by selecting your GitHub username and Slack account:</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <select
                          className="bg-background border rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          value={selectedGithubUsername}
                          onChange={(e) => setSelectedGithubUsername(e.target.value)}
                          disabled={isSaving}
                        >
                          <option value="">-- Select Your GitHub Username --</option>
                          {githubUsers.map(user => {
                            const username = getGithubUsername(user);
                            return (
                              <option key={username} value={username}>
                                {user.name ? `${user.name} (@${username})` : username}
                              </option>
                            );
                          })}
                        </select>
                        
                        <select
                          className="bg-background border rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
                          value={selectedSlackUserId}
                          onChange={(e) => setSelectedSlackUserId(e.target.value)}
                          disabled={isSaving}
                        >
                          <option value="">-- Select Your Slack Account --</option>
                          {slackUsers.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name || user.id}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleSetSelfAsAdmin}
                          disabled={isSaving || !selectedGithubUsername || !selectedSlackUserId}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 size={14} className="mr-2 animate-spin" />
                              Setting...
                            </>
                          ) : (
                            "This is me"
                          )}
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Filter users..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleAutoMap} 
                  disabled={isAutoMapping || isSaving}
                  className="flex-shrink-0 border-primary/30 text-primary hover:bg-primary/5"
                >
                  {isAutoMapping ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Mapping...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Auto Map Users
                    </>
                  )}
                </Button>
              </div>
              
              {userMappings.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                  <Check size={20} />
                  <div className="flex items-center justify-between w-full">
                    <span>{userMappings.length} users mapped successfully</span>
                    <Badge className="bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100">
                      {userMappings.filter(m => m.isAdmin).length} admins
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="rounded-md overflow-hidden border shadow-sm">
                <div className="bg-muted/50 p-3 flex items-center border-b">
                  <Users size={18} className="mr-2 text-primary" />
                  <span className="font-medium">GitHub Users</span>
                </div>
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {filteredGithubUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No users found
                    </div>
                  ) : (
                    filteredGithubUsers.map(githubUser => {
                      const githubUsername = getGithubUsername(githubUser);
                      const mapping = userMappings.find(m => m.githubUsername === githubUsername);
                      const isCurrentUser = currentUser?.github_username === githubUsername;
                      
                      return (
                        <div 
                          key={githubUsername} 
                          className={`p-4 hover:bg-muted/30 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors 
                            ${mapping ? 'bg-primary/5' : ''} 
                            ${isCurrentUser ? 'border-l-4 border-l-primary pl-3' : ''}`}
                        >
                          <div className="flex items-center flex-1 gap-3">
                            <Avatar>
                              <AvatarImage src={getGithubAvatar(githubUser)} />
                              <AvatarFallback>{githubUsername.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {githubUser.name || githubUsername}
                                {isCurrentUser && (
                                  <Badge className="ml-2 bg-primary/20 text-primary">You</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">@{githubUsername}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                            <select
                              className="bg-background border rounded-md px-3 py-1.5 text-sm w-full sm:w-auto focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
                              value={mapping?.slackUserId || ""}
                              onChange={(e) => assignSlackUser(githubUsername, e.target.value)}
                              disabled={isSaving || isCurrentUser}
                            >
                              <option value="">-- Select Slack User --</option>
                              {slackUsers.map(slackUser => (
                                <option key={slackUser.id} value={slackUser.id}>
                                  {slackUser.name || slackUser.id}
                                </option>
                              ))}
                            </select>
                            
                            {mapping && (
                              <div className="flex items-center gap-2">
                                <Switch 
                                  id={`admin-${githubUsername}`}
                                  checked={mapping.isAdmin}
                                  onCheckedChange={() => toggleAdmin(githubUsername)}
                                  disabled={isSaving || isCurrentUser}
                                />
                                <label 
                                  htmlFor={`admin-${githubUsername}`}
                                  className="text-sm cursor-pointer"
                                >
                                  Admin
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium block mb-1">Admin users:</span>
                  Admins can view organization-wide statistics, manage settings, and configure notifications. 
                  You can have up to 2 admins per organization.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button 
          onClick={handleNextClick} 
          disabled={isLoading || isAutoMapping || isSaving || userMappings.length === 0 || identifyingSelf}
          className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserMappingStep;