// src/components/onboarding/GithubStep.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Github, Check, Search, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/lib/stores/onboardingStore";

interface GithubStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const GithubStep: React.FC<GithubStepProps> = ({
  onNext,
  onPrev,
}) => {
  console.log('inside github step')
  const [searchTerm, setSearchTerm] = useState("");
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRepo, setLoadingRepo] = useState(false);
  
  const { 
    isGithubConnected, 
    selectedRepositories, 
    connectGithub,
    toggleRepository,
    fetchGithubRepositories
  } = useOnboarding();

  console.log('is github connected: ', isGithubConnected)

  // Fetch repositories when GitHub is connected
  useEffect(() => {
    if (isGithubConnected && repositories.length === 0) {
      fetchRepositories();
    }
  }, [isGithubConnected]);

  const fetchRepositories = async () => {
    try {
      setLoadingRepo(true);
      const repos = await fetchGithubRepositories();
      console.log('repos: ', repos)
      setRepositories(repos);
      setLoadingRepo(false);
    } catch (error) {
      console.error('Error fetching repositories:', error);
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
      setLoading(false);
    }
  };

  const handleToggleRepository = async (repoId: string, isChecked: boolean) => {
    try {
      await toggleRepository(repoId, isChecked);
    } catch (error) {
      console.error('Error toggling repository:', error);
    }
  };

  const filteredRepos = repositories.filter(repo =>
    repo.github_repo_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connect to GitHub</CardTitle>
          <CardDescription>
            Link your GitHub repositories to track pull requests and review activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isGithubConnected ? (
            <div className="text-center py-8">
              <Github size={64} className="mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-medium mb-4">Connect your GitHub account</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                PingaPR needs permission to access your repositories, issues, and pull requests.
                We'll never modify your code.
              </p>
              <Button size="lg" onClick={handleConnect} disabled={loading} className="gap-2">
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
              <div className="flex items-center gap-3 p-3 bg-accent/10 text-accent rounded-md">
                <Check size={20} className="text-accent" />
                <span>Successfully connected to GitHub</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Select repositories to monitor</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Search repositories..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
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
                      <div key={repo.github_repo_id} className="flex items-center p-4 hover:bg-muted/50">
                        <Checkbox
                          id={`repo-${repo.github_repo_id}`}
                          checked={selectedRepositories.includes(repo.github_repo_id)}
                          onCheckedChange={(checked) => handleToggleRepository(repo.github_repo_id, !!checked)}
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
          className="gap-2"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default GithubStep;