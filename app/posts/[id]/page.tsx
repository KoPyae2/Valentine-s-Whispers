"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Link as LinkIcon, Heart, Clock, Mars, Venus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const post = useQuery(api.posts.getPost, { id });
  const [isHovered, setIsHovered] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const toggleLike = useMutation(api.posts.toggleLike);

  useEffect(() => {
    const existingId = localStorage.getItem("sessionId");
    if (existingId) {
      setSessionId(existingId);
    } else {
      const newId = Math.random().toString(36).substring(2);
      localStorage.setItem("sessionId", newId);
      setSessionId(newId);
    }
  }, []);

  useEffect(() => {
    if (post) {
      setIsLiked((post.likedBy ?? []).includes(sessionId));
      setLikeCount(post.likes ?? 0);
    }
  }, [post, sessionId]);

  const handleLike = async () => {
    if (!sessionId || isLiking || !post) return;
    
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
    
    setIsLiking(true);
    try {
      await toggleLike({ postId: post._id, sessionId });
    } catch {
      setIsLiked(!newLikeState);
      setLikeCount(prev => newLikeState ? prev - 1 : prev + 1);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const getGenderColor = (gender: string) => {
    return gender === "male" 
      ? "text-blue-400 bg-blue-400/10"
      : gender === "female"
      ? "text-pink-400 bg-pink-400/10"
      : "text-purple-400 bg-purple-400/10";
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
    <main className="min-h-screen bg-gradient-to-b from-rose-900/90 via-purple-900/90 to-slate-900/90 relative overflow-hidden pb-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header with back button and copy link */}
        <motion.div 
          className="sticky top-4 z-20 backdrop-blur-md bg-black/20 rounded-xl p-4 mb-8 border border-pink-200/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-pink-200 hover:text-pink-100 hover:bg-pink-500/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="text-pink-200 hover:text-pink-100 hover:bg-pink-500/10"
              onClick={handleCopyLink}
            >
              <LinkIcon className="w-5 h-5 mr-2" />
              Copy Link
            </Button>
          </div>
        </motion.div>

        {/* Post content */}
        {post === undefined ? (
          <div className="space-y-6">
            <div className="animate-pulse bg-white/5 rounded-xl h-64" />
            <div className="animate-pulse bg-white/5 rounded-xl h-40" />
          </div>
        ) : post === null ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-pink-200/80 text-lg">Post not found 💔</p>
            <Link href="/" className="mt-4 inline-block">
              <Button
                variant="ghost"
                className="text-pink-200 hover:text-pink-100 hover:bg-pink-500/10"
              >
                Return Home
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Detailed Post View */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Post Header */}
              <div className="bg-white/5 backdrop-blur-sm rounded-t-xl p-6 border border-pink-200/20">
                <div className="flex items-center gap-4">
                  <div className={`relative rounded-full p-5 ${getGenderColor(post.gender)} shadow-lg`}>
                    {post.gender === "male" ? (
                      <Mars className="w-6 h-6" />
                    ) : (
                      <Venus className="w-6 h-6" />
                    )}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-current"
                      initial={{ opacity: 0.2 }}
                      animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className={`text-xl font-medium ${getGenderColor(post.gender).split(" ")[0]}`}>
                      {post.name}
                    </h1>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400/80">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <motion.button
                    className="relative"
                    onClick={handleLike}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLiking}
                  >
                    <Heart 
                      className={`w-7 h-7 transition-all duration-300 ${
                        isLiked 
                          ? "text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" 
                          : "text-gray-400"
                      }`}
                      fill={isLiked ? "currentColor" : "none"}
                    />
                    <motion.span
                      key={likeCount}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {likeCount}
                    </motion.span>
                  </motion.button>
                </div>
              </div>

              {/* Post Content */}
              <div className="bg-white/5 backdrop-blur-sm rounded-b-xl p-6 border-x border-b border-pink-200/20">
                <p className="text-lg text-gray-200/90 leading-relaxed tracking-wide whitespace-pre-wrap break-words">
                  {post.content}
                </p>
              </div>

              {/* Animated Background */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    background: [
                      "linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))",
                      "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))",
                      "linear-gradient(to right, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1))",
                    ]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>

            {/* Comments Section */}
            <CommentSection
              postId={post._id}
              comments={post.comments ?? []}
            />
          </div>
        )}
      </div>
    </main>
  );
} 