// src/components/onboarding/UserMappingStep.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Search, UserPlus, Check, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMapping } from "@/types/onboarding";
import { useOnboarding } from "@/lib/stores/onboardingStore";
import { toast } from "sonner";

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
  const [githubUsers, setGithubUsers] = useState<any[]>([]);
  const [slackUsers, setSlackUsers] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    userMappings, 
    updateUserMappings,
    fetchGithubUsers,
    fetchSlackUsers
  } = useOnboarding();

  // Load GitHub and Slack users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const [githubData, slackData] = await Promise.all([
          fetchGithubUsers(),
          fetchSlackUsers()
        ]);
        
        setGithubUsers(githubData);
        setSlackUsers(slackData);
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
    (user.username || user.login || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            slackUser => (slackUser.email || '').toLowerCase() === githubUser.email.toLowerCase()
          );
        }
        
        if (slackUser) {
          return {
            githubUsername: githubUser.username || githubUser.login,
            slackUserId: slackUser.id,
            isAdmin: false,
            avatarUrl: githubUser.avatar_url || githubUser.avatarUrl
          };
        }
        
        return null;
      }).filter(Boolean) as UserMapping[];
      
      // Save mappings
      await updateUserMappings(autoMappings);
      toast.success(`Auto-mapped ${autoMappings.length} users`);
    } catch (error) {
      console.error('Error auto-mapping users:', error);
      toast.error('Failed to auto-map users');
    } finally {
      setIsAutoMapping(false);
    }
  };

  const toggleAdmin = async (githubUsername: string) => {
    try {
      const updatedMappings = userMappings.map(mapping => {
        if (mapping.githubUsername === githubUsername) {
          return { ...mapping, isAdmin: !mapping.isAdmin };
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
              isAdmin: false,
              avatarUrl: githubUser.avatar_url || githubUser.avatarUrl
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
  
  // const getSlackNameById = (id: string) => {
  //   const user = slackUsers.find(user => user.id === id);
  //   return user ? user.name : "Unknown User";
  // };

  const getGithubUsername = (user: any) => {
    return user.username || user.login;
  };

  const getGithubAvatar = (user: any) => {
    return user.avatar_url || user.avatarUrl;
  };

  const handleNextClick = () => {
    if (userMappings.length === 0) {
      toast.error("Please map at least one user before proceeding");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Map GitHub Users to Slack</CardTitle>
          <CardDescription>
            Match your GitHub users to their Slack accounts for proper notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={30} className="animate-spin text-primary mr-2" />
              <span>Loading users...</span>
            </div>
          ) : (
            <>
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
                  className="flex-shrink-0"
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
              
              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {filteredGithubUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  filteredGithubUsers.map(githubUser => {
                    const githubUsername = getGithubUsername(githubUser);
                    const mapping = userMappings.find(m => m.githubUsername === githubUsername);
                    
                    return (
                      <div key={githubUsername} className="p-4 hover:bg-muted/50 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center flex-1 gap-3">
                          <Avatar>
                            <AvatarImage src={getGithubAvatar(githubUser)} />
                            <AvatarFallback>{githubUsername.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{githubUser.name || githubUsername}</div>
                            <div className="text-sm text-muted-foreground">@{githubUsername}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                          <div className="flex items-center">
                            <select
                              className="bg-background border rounded-md px-3 py-1.5 text-sm w-full sm:w-auto"
                              value={mapping?.slackUserId || ""}
                              onChange={(e) => assignSlackUser(githubUsername, e.target.value)}
                              disabled={isSaving}
                            >
                              <option value="">-- Select Slack User --</option>
                              {slackUsers.map(slackUser => (
                                <option key={slackUser.id} value={slackUser.id}>
                                  {slackUser.name || slackUser.id}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {mapping && (
                            <div className="flex items-center gap-2">
                              <Switch 
                                id={`admin-${githubUsername}`}
                                checked={mapping.isAdmin}
                                onCheckedChange={() => toggleAdmin(githubUsername)}
                                disabled={isSaving}
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
              
              {userMappings.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-accent/10 text-accent rounded-md">
                  <Check size={20} className="text-accent" />
                  <span>{userMappings.length} users mapped successfully</span>
                </div>
              )}
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
          disabled={isLoading || isAutoMapping || isSaving || userMappings.length === 0}
          className="gap-2"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserMappingStep;