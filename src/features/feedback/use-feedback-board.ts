import { useMemo, useState } from "react";
import { useAppState } from "@/contexts/app-state-context";
import type { FeedbackPostType } from "@/features/feedback/types";

export function useFeedbackBoard() {
  const { feedbackPosts, createFeedbackPost, voteFeedbackPost, addFeedbackComment } = useAppState();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [type, setType] = useState<FeedbackPostType>("feature");

  const topPosts = useMemo(
    () => [...feedbackPosts].sort((a, b) => (b.score === a.score ? b.createdAt - a.createdAt : b.score - a.score)),
    [feedbackPosts],
  );

  const newPosts = useMemo(() => [...feedbackPosts].sort((a, b) => b.createdAt - a.createdAt), [feedbackPosts]);

  const publish = () => {
    const success = createFeedbackPost({ title, details, type });
    if (success) {
      setTitle("");
      setDetails("");
      setType("feature");
    }
    return success;
  };

  return {
    title,
    setTitle,
    details,
    setDetails,
    type,
    setType,
    topPosts,
    newPosts,
    publish,
    voteFeedbackPost,
    addFeedbackComment,
  };
}
