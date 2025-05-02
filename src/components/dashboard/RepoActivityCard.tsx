
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepositoryActivity } from "@/data/mockData";
// import { Progress } from "@/components/ui/progress";

interface RepoActivityCardProps {
  repositories: RepositoryActivity[];
}

const RepoActivityCard = ({ repositories }: RepoActivityCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Repository Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {repositories.map((repo) => {
          const total = repo.total_prs;
          const openPercentage = total ? (repo.open_prs / total) * 100 : 0;
          const mergedPercentage = total ? (repo.merged_prs / total) * 100 : 0;
          const closedPercentage = total ? (repo.closed_prs / total) * 100 : 0;

          return (
            <div key={repo.github_repo_name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{repo.github_repo_name}</div>
                <div className="text-sm text-gray-500">{total} PRs</div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden flex">
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${openPercentage}%` }}
                  title={`${repo.open_prs} open PRs`}
                />
                <div 
                  className="bg-brand-500 h-full" 
                  style={{ width: `${mergedPercentage}%` }}
                  title={`${repo.merged_prs} merged PRs`}
                />
                <div 
                  className="bg-gray-400 h-full" 
                  style={{ width: `${closedPercentage}%` }}
                  title={`${repo.closed_prs} closed PRs`}
                />
              </div>
              <div className="flex text-xs gap-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                  <span>Open: {repo.open_prs}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-brand-500 mr-1.5"></div>
                  <span>Merged: {repo.merged_prs}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-400 mr-1.5"></div>
                  <span>Closed: {repo.closed_prs}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RepoActivityCard;