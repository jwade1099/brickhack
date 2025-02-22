"use client";

import { useEffect, useState } from "react";
import { getPost } from "@/app/lib/getPost";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  replies: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      const response = await getPost(params.id);
      if (response.success && response.post) {
        setPost(response.post);
      } else {
        setError(response.error || "Failed to load post");
      }
    }
    loadPost();
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-24 px-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-24 px-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <p className="text-xl text-gray-800 mb-4">{post.content}</p>
          <p className="text-sm text-gray-500">
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </motion.div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Replies</h2>
          {post.replies.map((reply) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-4 ml-8 border-l-4 border-purple-500"
            >
              <p className="text-gray-800 mb-2">{reply.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(reply.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
