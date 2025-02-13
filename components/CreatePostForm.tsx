'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, Mars, Venus, Check, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Gender = "male" | "female";

const floatingHearts = [...Array(24)].map((_, i) => ({
  size: Math.random() * 20 + 10,
  rotation: Math.random() * 360,
  duration: Math.random() * 1 + 1,
  delay: Math.random() * 0.5,
  distance: Math.random() * 100 + 50,
  angle: (i * 15) % 360,
}));

export default function CreatePostForm() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPost = useMutation(api.posts.createPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !name.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await createPost({ 
        name: name.trim(),
        gender,
        content: content.trim()
      });
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setContent("");
        setName("");
        setGender("male");
        setIsExpanded(false);
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full rounded-xl bg-white/5 backdrop-blur-lg border border-pink-200/20 shadow-xl transition-all duration-300 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Background gradient animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-pink-500/90"
              initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
              animate={{ 
                opacity: 1,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 3,
                ease: "linear",
                repeat: Infinity,
              }}
            />

            {/* Radial burst effect */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-white"
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 15, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>

            {/* Success checkmark with glowing effect */}
            <motion.div
              className="absolute z-10 rounded-full bg-white/20 p-4 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                damping: 10,
                stiffness: 100,
                delay: 0.2
              }}
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full p-2"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            {/* Floating hearts animation */}
            <div className="absolute inset-0 pointer-events-none">
              {floatingHearts.map((heart, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  initial={{ 
                    x: 0,
                    y: 0,
                    scale: 0,
                    rotate: heart.rotation,
                    opacity: 1
                  }}
                  animate={{ 
                    x: Math.cos(heart.angle * Math.PI / 180) * heart.distance,
                    y: Math.sin(heart.angle * Math.PI / 180) * heart.distance,
                    scale: 1,
                    opacity: 0,
                    rotate: heart.rotation + 360
                  }}
                  transition={{ 
                    duration: heart.duration,
                    delay: heart.delay,
                    ease: "easeOut"
                  }}
                >
                  <Heart 
                    className="text-pink-200" 
                    fill="currentColor"
                    style={{ 
                      width: heart.size,
                      height: heart.size
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Sparkles effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: Math.random() * 1,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Success message */}
            <motion.div
              className="absolute bottom-8 text-white text-lg font-medium tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                Posted with love ❤️
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-6 space-y-4">
        {isExpanded && (
          <motion.div 
            className="flex flex-col md:flex-row gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full p-3 rounded-lg bg-black/20 border border-pink-200/20 text-white placeholder-pink-200/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm md:text-base"
                maxLength={30}
              />
              <div className="mt-1 text-xs text-pink-300/70">
                {name.length}/30 characters
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <motion.button
                type="button"
                onClick={() => setGender("male")}
                className={`relative flex-1 md:w-32 p-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2
                  ${gender === "male"
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-400"
                    : "bg-black/20 border-pink-200/20 text-gray-400 hover:bg-blue-500/10 hover:border-blue-400/30"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                  gender === "male" ? "bg-blue-400/5 opacity-100" : "opacity-0"
                }`} />
                <div className={`rounded-full p-1.5 transition-colors duration-300 ${
                  gender === "male" ? "bg-blue-400/20" : "bg-gray-500/20"
                }`}>
                  <Mars className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Male</span>
                {gender === "male" && (
                  <motion.div
                    className="absolute -inset-px rounded-xl border-2 border-blue-400/50"
                    layoutId="genderOutline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setGender("female")}
                className={`relative flex-1 md:w-32 p-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2
                  ${gender === "female"
                    ? "bg-pink-500/20 border-pink-400/50 text-pink-400"
                    : "bg-black/20 border-pink-200/20 text-gray-400 hover:bg-pink-500/10 hover:border-pink-400/30"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                  gender === "female" ? "bg-pink-400/5 opacity-100" : "opacity-0"
                }`} />
                <div className={`rounded-full p-1.5 transition-colors duration-300 ${
                  gender === "female" ? "bg-pink-400/20" : "bg-gray-500/20"
                }`}>
                  <Venus className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Female</span>
                {gender === "female" && (
                  <motion.div
                    className="absolute -inset-px rounded-xl border-2 border-pink-400/50"
                    layoutId="genderOutline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share your Valentine's message..."
            className="w-full h-24 md:h-32 p-4 rounded-lg bg-black/20 border border-pink-200/20 text-white placeholder-pink-200/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none text-sm md:text-base"
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3">
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={!content.trim() || !name.trim() || isSubmitting}
                className={`
                  relative px-6 py-2.5 rounded-lg
                  flex items-center gap-2
                  transition-all duration-300
                  ${isExpanded ? (
                    content.trim() && name.trim()
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                      : "bg-pink-500/20 text-pink-300/50 cursor-not-allowed"
                  ) : "bg-pink-500/20 text-pink-300 hover:bg-pink-500/30"}
                `}
                whileHover={isExpanded && content.trim() && name.trim() && !isSubmitting ? { scale: 1.02 } : {}}
                whileTap={isExpanded && content.trim() && name.trim() && !isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{isExpanded ? "Post" : "Write a post"}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div 
          className="flex justify-between items-center text-xs md:text-sm text-pink-300/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> Share with love
          </div>
          <span>{content.length}/500 characters</span>
        </motion.div>
      </div>
    </motion.form>
  );
} 