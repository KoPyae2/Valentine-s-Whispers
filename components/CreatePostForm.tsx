import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, Mars, Venus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Gender = "male" | "female";

export default function CreatePostForm() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const createPost = useMutation(api.posts.createPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !name.trim()) return;
    
    await createPost({ 
      name: name.trim(),
      gender,
      content: content.trim()
    });
    setContent("");
    setName("");
    setGender("male");
    setIsExpanded(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto rounded-xl bg-white/5 backdrop-blur-lg border border-pink-200/20 shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
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
                {name.length}/30
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 md:flex-none md:w-24 p-3 rounded-lg border transition-all duration-300 flex items-center justify-center gap-2 ${
                  gender === "male"
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-400"
                    : "bg-black/20 border-pink-200/20 text-gray-400 hover:border-blue-400/30"
                }`}
              >
                <Mars className="w-4 h-4" />
                <span className="text-sm">Male</span>
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 md:flex-none md:w-24 p-3 rounded-lg border transition-all duration-300 flex items-center justify-center gap-2 ${
                  gender === "female"
                    ? "bg-pink-500/20 border-pink-400/50 text-pink-400"
                    : "bg-black/20 border-pink-200/20 text-gray-400 hover:border-pink-400/30"
                }`}
              >
                <Venus className="w-4 h-4" />
                <span className="text-sm">Female</span>
              </button>
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
            <motion.button
              type="submit"
              className="p-2.5 md:p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!content.trim() || !name.trim()}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
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
          <span>{content.length}/500</span>
        </motion.div>
      </div>
    </motion.form>
  );
} 