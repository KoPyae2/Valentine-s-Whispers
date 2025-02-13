"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Heart, Clock, MessageCircle, Share2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface PostCardProps {
  id: Id<"posts">;
  name: string;
  gender: string;
  content: string;
  createdAt: number;
  likes: number;
  likedBy: string[];
  commentCount: number;
}

export default function PostCard({ 
  id, 
  name, 
  gender, 
  content, 
  createdAt, 
  likes, 
  likedBy,
  commentCount = 0,
}: PostCardProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);
  const toggleLike = useMutation(api.posts.toggleLike);
  const pathname = usePathname();
  const isDetailPage = pathname.startsWith("/posts/");

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
    setIsLiked(likedBy.includes(sessionId));
    setLikeCount(likes);
  }, [likedBy, sessionId, likes]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!sessionId || isLiking) return;
    
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
    
    setIsLiking(true);
    toggleLike({ postId: id, sessionId })
      .catch(error => {
        console.error('Failed to toggle like:', error);
        setIsLiked(!newLikeState);
        setLikeCount(prev => newLikeState ? prev - 1 : prev + 1);
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/posts/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const getGenderColor = (gender: string) => {
    return gender === "male" 
      ? "text-blue-400"
      : "text-pink-400";
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

  const CardContent = () => (
    <div className="relative">
      <div className="flex items-center gap-3 mb-3">
        <div className={`relative rounded-full p-3 bg-white/5 ${getGenderColor(gender)}`}>
          <User className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${getGenderColor(gender)}`}>
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400/80">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-base text-gray-200/90 leading-relaxed tracking-wide whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-gray-400/80 hover:text-pink-400 transition-colors"
          disabled={isLiking}
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? "text-pink-400 fill-pink-400" : ""}`}
          />
          <span className="text-sm">{likeCount}</span>
        </button>

        <button
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-1 text-gray-400/80 hover:text-pink-400 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{commentCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="text-gray-400/80 hover:text-pink-400 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const cardClasses = `
    group relative p-4 rounded-xl
    bg-white/5 backdrop-blur-sm
    border border-pink-200/10
    transition-all duration-300
    ${!isDetailPage ? "hover:border-pink-200/20 hover:bg-white/10" : ""}
  `;

  if (isDetailPage) {
    return (
      <div className={cardClasses}>
        <CardContent />
      </div>
    );
  }

  return (
    <Link href={`/posts/${id}`} className="block">
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
      >
        <CardContent />
      </motion.div>
    </Link>
  );
} 