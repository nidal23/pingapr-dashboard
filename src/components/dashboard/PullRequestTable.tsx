
import { RecentPR } from "@/types/dashboard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PullRequestTableProps {
  pullRequests: RecentPR[];
  showRepo?: boolean;
}

const PullRequestTable = ({ pullRequests, showRepo = true }: PullRequestTableProps) => {
  return (
    <div className="rounded-md border border-border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Title</TableHead>
            {showRepo && <TableHead>Repository</TableHead>}
            <TableHead>Author</TableHead>
            <TableHead>Reviewers</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pullRequests.map((pr) => (
            <TableRow key={pr.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span className="text-primary font-mono mr-2">#{pr.github_pr_number}</span>
                  <span className="truncate">{pr.title}</span>
                </div>
              </TableCell>
              {showRepo && (
                <TableCell>
                  <span className="bg-muted px-2 py-1 rounded text-xs font-medium">
                    {pr.github_repo_name}
                  </span>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage
                     src={pr.author_avatar}
                      alt={pr.author_name}
                    />
                    <AvatarFallback>{pr.author_name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{pr.author_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="avatar-stack">
                  {pr.reviewers.slice(0, 3).map((reviewer, index) => (
                    <Avatar
                      key={index}
                      className={cn(
                        "h-6 w-6 border-2",
                        reviewer.status === 'approved' && "border-emerald-500",
                        reviewer.status === 'changes_requested' && "border-red-500",
                        reviewer.status === 'commented' && "border-sky-500",
                        reviewer.status === 'pending' && "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      <AvatarImage
                        src={reviewer.avatar_url || `https://i.pravatar.cc/150?u=${reviewer.github_username}`}
                        alt={reviewer.name}
                      />
                      <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {pr.reviewers.length > 3 && (
                    <Avatar className="h-6 w-6 bg-muted text-xs">
                      <AvatarFallback>+{pr.reviewers.length - 3}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "status-badge",
                    pr.status === 'open' && "status-open",
                    pr.status === 'merged' && "status-merged",
                    pr.status === 'closed' && "status-closed"
                  )}
                >
                  {pr.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                <time title={format(new Date(pr.updated_at), "PPpp")}>
                  {formatDistanceToNow(new Date(pr.updated_at), { addSuffix: true })}
                </time>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PullRequestTable;
