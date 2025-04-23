import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Github, Check, Search, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/lib/stores/onboardingStore";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Repository } from '@/types/database'

interface GithubStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const GithubStep: React.FC<GithubStepProps> = ({
  onNext,
  onPrev,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRepo, setLoadingRepo] = useState(false);
  
  const { 
    isGithubConnected, 
    selectedRepositories, 
    connectGithub,
    toggleRepository,
    fetchGithubRepositories
  } = useOnboarding();

  // Fetch repositories when component mounts or when GitHub connection status changes
  useEffect(() => {
    if (isGithubConnected) {
      fetchRepositories();
    }
  }, [isGithubConnected]);

  const fetchRepositories = async () => {
    try {
      setLoadingRepo(true);
      const repos = await fetchGithubRepositories();
      setRepositories(repos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error("Failed to load repositories. Please try again.");
    } finally {
      setLoadingRepo(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      await connectGithub();
      // Note: We're redirected to GitHub, so this won't continue execution
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error("Failed to connect to GitHub. Please try again.");
      setLoading(false);
    }
  };

  const handleToggleRepository = async (repoId: string, isChecked: boolean) => {
    try {
      await toggleRepository(repoId, isChecked);
    } catch (error) {
      console.error('Error toggling repository:', error);
      toast.error("Failed to update repository selection. Please try again.");
    }
  };

  const handleRefreshRepositories = async () => {
    await fetchRepositories();
    toast.success("Repositories refreshed successfully");
  };

  const filteredRepos = repositories.filter(repo =>
    repo.github_repo_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Connect to GitHub</CardTitle>
          <CardDescription>
            Link your GitHub repositories to track pull requests and review activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGithubConnected ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Github size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-4">Connect your GitHub account</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                PingaPR needs permission to access your repositories, issues, and pull requests.
                We'll never modify your code.
              </p>
              <Button 
                size="lg" 
                onClick={handleConnect} 
                disabled={loading} 
                className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 font-display"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github size={20} />
                    Connect GitHub
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                <Check size={20} />
                <span>Successfully connected to GitHub</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Select repositories to monitor</h3>
                  <div className="flex gap-2 items-center">
                    {selectedRepositories.length > 0 && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {selectedRepositories.length} selected
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefreshRepositories} 
                      disabled={loadingRepo}
                      className="flex items-center gap-1"
                    >
                      <Loader2 size={14} className={loadingRepo ? "animate-spin" : "rotate-0"} />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Search repositories..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto shadow-sm">
                  {loadingRepo ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 size={24} className="animate-spin text-primary mr-2" />
                      <span>Loading repositories...</span>
                    </div>
                  ) : filteredRepos.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No repositories found
                    </div>
                  ) : (
                    filteredRepos.map((repo) => (
                      <div key={repo.github_repo_id} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`repo-${repo.github_repo_id}`}
                          checked={selectedRepositories.includes(repo.github_repo_id)}
                          onCheckedChange={(checked) => handleToggleRepository(repo.github_repo_id, !!checked)}
                          className="text-primary border-primary/50"
                        />
                        <label
                          htmlFor={`repo-${repo.github_repo_id}`}
                          className="flex flex-col ml-3 cursor-pointer flex-1"
                        >
                          <span className="font-medium">{repo.github_repo_name}</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isGithubConnected || selectedRepositories.length === 0}
          className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default GithubStep;