import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  commentCount?: number;
}

export default function PostCard({ 
  id, 
  name, 
  gender, 
  content, 
  createdAt, 
  likes, 
  likedBy,
}: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiking, setIsLiking] = useState(false);
  const toggleLike = useMutation(api.posts.toggleLike);
  const pathname = usePathname();
  const isDetailPage = pathname.startsWith("/posts/");

  useEffect(() => {
    // Generate or get existing session ID
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
    e.preventDefault(); // Prevent navigation when clicking like button
    if (!sessionId || isLiking) return;
    
    // Optimistic update
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
    
    // Background sync
    setIsLiking(true);
    toggleLike({ postId: id, sessionId })
      .catch(error => {
        // Revert on error
        console.error('Failed to toggle like:', error);
        setIsLiked(!newLikeState);
        setLikeCount(prev => newLikeState ? prev - 1 : prev + 1);
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    const url = `${window.location.origin}/posts/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "text-blue-400 bg-blue-400/10";
      case "female":
        return "text-pink-400 bg-pink-400/10";
      default:
        return "text-purple-400 bg-purple-400/10";
    }
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
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar with pulse effect */}
        <motion.div 
          className={`relative rounded-full p-4 ${getGenderColor(gender)} shadow-lg`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <User className="w-5 h-5" />
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
        </motion.div>

        {/* Name and Time with improved typography */}
        <div className="flex-1">
          <motion.h3 
            className={`font-medium text-base md:text-lg tracking-wide ${getGenderColor(gender).split(' ')[0]}`}
            layout
          >
            {name}
          </motion.h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400/80">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Stats: Likes and Comments */}
        <div className="flex items-center gap-4">
          {/* Like Button and Counter */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              className="relative group/heart"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart 
                className={`w-6 h-6 transition-all duration-300 ${
                  isLiked 
                    ? "text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" 
                    : "text-gray-400 group-hover/heart:text-pink-400/50"
                }`}
                fill={isLiked ? "currentColor" : "none"}
              />
              <AnimatePresence>
                {(isHovered || isLiked) && (
                  <motion.div
                    className={`absolute -inset-2 rounded-full -z-10 ${
                      isLiked ? "bg-pink-400/20" : "bg-pink-400/10"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Enhanced like animation */}
              <AnimatePresence>
                {isLiked && (
                  <motion.div
                    className="absolute -inset-4 pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, rotate: i * 60 }}
                        animate={{
                          scale: [0, 1, 0],
                          rotate: [i * 60, i * 60 + 10],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        <Heart 
                          className="w-3 h-3 text-pink-400 drop-shadow-[0_0_3px_rgba(236,72,153,0.5)]" 
                          fill="currentColor" 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* Like counter */}
            <motion.span
              key={likeCount}
              className={`text-xs font-medium ${
                isLiked 
                  ? "text-pink-400 drop-shadow-[0_0_3px_rgba(236,72,153,0.3)]" 
                  : "text-gray-400"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {likeCount}
            </motion.span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Comment Icon */}
            <motion.div
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle 
                className="w-5 h-5 text-gray-400 group-hover:text-pink-400/80 transition-colors"
              />
            </motion.div>

            {/* Share Icon */}
            <motion.button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 
                className="w-5 h-5 text-gray-400 hover:text-pink-400/80 transition-colors"
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute -inset-1 rounded-full -z-10 bg-pink-400/5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Message content with enhanced typography */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-base md:text-lg text-gray-200/90 leading-relaxed tracking-wide whitespace-pre-wrap break-words">
          {content}
        </p>
      </motion.div>
    </div>
  );

  // If we're on the detail page, just render the content without the link
  if (isDetailPage) {
    return (
      <motion.div
        className="group relative p-4 md:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-pink-200/20 shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Animated gradient background */}
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
        <CardContent />
      </motion.div>
    );
  }

  // On the main page, wrap the content in a link
  return (
    <Link href={`/posts/${id}`} className="block">
      <motion.div
        className="group relative p-4 md:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-pink-200/20 shadow-xl hover:shadow-pink-500/20 transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Animated gradient background */}
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
        <CardContent />
      </motion.div>
    </Link>
  );
} 