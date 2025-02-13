"use client";

import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/PostSkeleton";
import FloatingBackgroundHearts from "@/components/FloatingBackgroundHearts";
import { Heart } from "lucide-react";

export default function HomePage() {
  const posts = useQuery(api.posts.getPosts);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-900/90 via-purple-900/90 to-slate-900/90 relative overflow-hidden pb-20">
      <FloatingBackgroundHearts />
      
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-3 md:mb-4 text-glow">
          Valentine&apos;s Whispers
          </h1>
          <p className="text-base md:text-lg text-pink-200/80">
          Share your heartfelt messages anonymously ❤️
          </p>
        </motion.div>

        <div className="mb-8 md:mb-12 sticky top-4 z-20">
          <CreatePostForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts === undefined ? (
            // Loading state
            <>
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostSkeleton />
                </motion.div>
              ))}
            </>
          ) : posts.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-pink-200/80 text-lg">
                No messages yet. Be the first to share your thoughts! 💝
              </p>
            </div>
          ) : (
            // Posts list
            posts.map((post) => (
              <PostCard
                key={post._id.toString()}
                id={post._id}
                name={post.name}
                gender={post.gender}
                content={post.content}
                createdAt={post.createdAt}
                likes={post.likes ?? 0}
                likedBy={post.likedBy ?? []}
              />
            ))
          )}
        </div>
      </div>

      {/* Enhanced footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-10"
      >
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Footer content */}
        <div className="relative px-4 py-3">
          <motion.div
            className="flex items-center justify-center gap-2 text-sm text-pink-200/80 font-medium"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span>© {new Date().getFullYear()}</span>
            <span className="mx-1">Created with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            </motion.div>
            <span>by</span>
            <a 
              href="https://t.me/CastleOfClover" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 font-semibold hover:from-pink-300 hover:to-purple-300 transition-all duration-300"
            >
              Chico
            </a>
          </motion.div>
        </div>
      </motion.footer>
    </main>
  );
} 