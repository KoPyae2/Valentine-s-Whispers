"use client";

import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const post = useQuery(api.posts.getPost, { id });

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-900/90 via-purple-900/90 to-slate-900/90 relative overflow-hidden pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with back button and copy link */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/">
              <Button
                variant="ghost"
                className="text-pink-200 hover:text-pink-100 hover:bg-pink-500/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              className="text-pink-200 hover:text-pink-100 hover:bg-pink-500/10"
              onClick={handleCopyLink}
            >
              <LinkIcon className="w-5 h-5 mr-2" />
              Copy Link
            </Button>
          </motion.div>
        </div>

        {/* Post content */}
        {post === undefined ? (
          <div className="animate-pulse bg-white/5 rounded-xl h-64" />
        ) : post === null ? (
          <div className="text-center py-12">
            <p className="text-pink-200/80 text-lg">Post not found 💔</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PostCard
              id={post._id}
              name={post.name}
              gender={post.gender}
              content={post.content}
              createdAt={post.createdAt}
              likes={post.likes ?? 0}
              likedBy={post.likedBy ?? []}
              commentCount={post.commentCount}
            />

            {/* Comments Section */}
            <CommentSection
              postId={post._id}
              comments={post.comments ?? []}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
} 