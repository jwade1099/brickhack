import Image from "next/image";
import { Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PostProps {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  avatar: string;
  tags: string;
}

export function Post({
  author,
  content,
  timestamp,
  likes: initialLikes,
  comments,
  avatar,
  tags,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  return (
    <motion.article
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4">
        <motion.div
          className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-purple-100"
          whileHover={{ scale: 1.1 }}
        >
          <Image src={avatar} alt={author} fill className="object-cover" />
        </motion.div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-1">
              {author}
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p className="text-gray-800 text-lg leading-relaxed">{content}</p>

          <div className="text-sm text-purple-600 font-medium">{tags}</div>

          <div className="flex items-center gap-6 pt-2">
            <motion.button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-gray-500 hover:text-pink-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
              <span className="text-sm font-medium">{likes}</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{comments}</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors ml-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
