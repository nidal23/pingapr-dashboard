
export interface OverviewStats {
    activePRs: number;
    avgReviewTime: number;
    mergeRate: number;
    sevenDayTrend: {
      activePRs: number;
      avgReviewTime: number;
      mergeRate: number;
    };
    teamHealthScore: number;
    topContributors: {
      name: string;
      avatarUrl: string;
      score: number;
    }[];
  }
  
  export interface PullRequest {
    id: string;
    title: string;
    repositoryName: string;
    author: {
      name: string;
      avatarUrl: string;
    };
    status: "open" | "closed" | "merged";
    createdAt: string;
    updatedAt: string;
    mergedAt?: string;
    closedAt?: string;
    reviewers: {
      name: string;
      status: "pending" | "approved" | "changes_requested" | "commented";
      avatarUrl: string;
    }[];
    timeline: {
      created: string;
      firstReview?: string;
      lastReviewRequest?: string;
      lastReview?: string;
      merged?: string;
      closed?: string;
    };
    size: number;
    comments: number;
  }
  
  export interface TeamMember {
    id: string;
    name: string;
    avatarUrl: string;
    githubUsername: string;
    slackUserId: string;
    stats: {
      avgReviewTime: number;
      responseRate: number;
      commentsPerReview: number;
      prsAuthored: number;
      prsReviewed: number;
    };
  }
  
  export interface Repository {
    id: string;
    name: string;
    isActive: boolean;
    stats: {
      openPRs: number;
      avgMergeTime: number;
      prVelocity: number;
      commentFrequency: number;
      codeChurn: number;
    };
  }
  
  export interface TimeRange {
    start: Date;
    end: Date;
  }
  
  export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  }
  
  export interface DataPoint {
    x: number;
    y: number;
  }
  
  export interface ScatterData {
    datasets: {
      label: string;
      data: DataPoint[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  }