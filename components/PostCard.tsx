import { useState } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface PostCardProps {
  name: string;
  gender: string;
  content: string;
  createdAt: number;
}

export default function PostCard({ name, gender, content, createdAt }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "text-blue-400";
      case "female":
        return "text-pink-400";
      default:
        return "text-purple-400";
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

  return (
    <motion.div
      className="relative p-4 md:p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-pink-200/20 shadow-xl hover:shadow-pink-500/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
          <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <h3 className={`font-medium text-sm md:text-base ${getGenderColor(gender)}`}>
            {name}
          </h3>
          <p className="text-[10px] md:text-xs text-gray-400">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
      
      <p className="text-sm md:text-lg text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
        {content}
      </p>

      {isHovered && (
        <motion.div
          className="absolute -inset-px bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
} 