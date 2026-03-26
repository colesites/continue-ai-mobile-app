export type FeedbackPostType = "feature" | "bug";

export interface FeedbackComment {
  id: string;
  body: string;
  createdAt: number;
}

export interface FeedbackPost {
  id: string;
  title: string;
  details: string;
  type: FeedbackPostType;
  score: number;
  createdAt: number;
  comments: FeedbackComment[];
  myVote?: "up" | "down" | null;
}
