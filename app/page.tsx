"use client";

import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/PostSkeleton";
import FloatingHearts from "@/components/FloatingHearts";

export default function Home() {
  const posts = useQuery(api.posts.getPosts);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-900/90 via-purple-900/90 to-slate-900/90 relative overflow-hidden">
      <FloatingHearts />
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
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
                name={post.name}
                gender={post.gender}
                content={post.content}
                createdAt={post.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
