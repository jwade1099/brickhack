import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { createPost } from "@/app/lib/createPost";
import { toast } from "sonner";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export function PostModal({ isOpen, onClose, userId = "default-user-id" }: PostModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await createPost(content);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Post created successfully!");
      setContent("");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-xl bg-white rounded-xl shadow-xl z-10 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Post
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6 text-gray-500" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-black placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>

              <div className="flex justify-end pt-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!content.trim() || isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Post
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
