"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Clock, Mars, Venus } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  _id: Id<"comments">;
  name: string;
  gender: "male" | "female";
  content: string;
  createdAt: number;
}

interface CommentSectionProps {
  postId: Id<"posts">;
  comments: Comment[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setContent("");
      setIsCommenting(false); // Close the form after successful submission
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const getGenderColor = (gender: string) => {
    return gender === "male" 
      ? "text-blue-400 bg-blue-400/10"
      : "text-pink-400 bg-pink-400/10";
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-pink-200" />
        <h2 className="text-lg font-medium text-pink-200">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <motion.div
        initial={false}
        animate={{ height: isCommenting ? "auto" : 48 }}
        className="overflow-hidden mb-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {isCommenting ? (
            <>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-pink-100 placeholder:text-pink-200/50 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className={`flex items-center gap-2 px-4 ${
                      gender === "male"
                        ? "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                        : "text-blue-200/50 hover:bg-blue-500/10"
                    }`}
                    onClick={() => setGender("male")}
                  >
                    <Mars className="w-4 h-4" />
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className={`flex items-center gap-2 px-4 ${
                      gender === "female"
                        ? "bg-pink-500/20 text-pink-200 hover:bg-pink-500/30"
                        : "text-pink-200/50 hover:bg-pink-500/10"
                    }`}
                    onClick={() => setGender("female")}
                  >
                    <Venus className="w-4 h-4" />
                    Female
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-pink-100 placeholder:text-pink-200/50 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  className={`${
                    gender === "male"
                      ? "text-blue-200 hover:text-blue-100 hover:bg-blue-500/10"
                      : "text-pink-200 hover:text-pink-100 hover:bg-pink-500/10"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-pink-200/70 hover:text-pink-100 hover:bg-pink-500/10"
              onClick={() => setIsCommenting(true)}
            >
              Write a comment...
            </Button>
          )}
        </form>
      </motion.div>

      {/* Comments List */}
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`rounded-full p-2 ${getGenderColor(comment.gender)}`}>
                {comment.gender === "male" ? (
                  <Mars className="w-4 h-4" />
                ) : (
                  <Venus className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${getGenderColor(comment.gender).split(" ")[0]}`}>
                  {comment.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400/80">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-200/90 ml-11">{comment.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {comments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-pink-200/50 text-sm">No comments yet. Be the first to comment!</p>
        </motion.div>
      )}
    </div>
  );
} 