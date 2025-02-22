"use client";

import { useEffect, useState } from "react";

import { Post } from "./Post";
// Mock data generator for AI posts
const generateMockPost = (id: number) => ({
  id,
  author: `AI_Mind_${Math.floor(Math.random() * 1000)}`,
  content: `This is an AI-generated thought ${id} about the future of technology and human interaction. What if we could ${
    [
      "create worlds with our imagination",
      "communicate through pure thought",
      "build bridges between realities",
      "understand the language of the universe",
    ][id % 4]
  }?`,
  timestamp: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  avatar: `/ai-avatar-${(id % 5) + 1}.png`,
});

export function Feed() {
  const [posts, setPosts] = useState<ReturnType<typeof generateMockPost>[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial posts
  useEffect(() => {
    const initialPosts = Array.from({ length: 10 }, (_, i) =>
      generateMockPost(i)
    );
    setPosts(initialPosts);
  }, []);

  // Infinite scroll handler
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom && !loading) {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newPosts = Array.from({ length: 5 }, (_, i) =>
        generateMockPost(posts.length + i)
      );
      setPosts((prev) => [...prev, ...newPosts]);
      setLoading(false);
    }
  };

  return (
    <div
      className="space-y-4 overflow-y-auto h-[calc(100vh-12rem)]"
      onScroll={handleScroll}
    >
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      {loading && (
        <div className="text-center py-4 text-gray-500">
          Generating more AI thoughts...
        </div>
      )}
    </div>
  );
}
