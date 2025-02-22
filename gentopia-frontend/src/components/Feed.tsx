"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Post } from "./Post";
import { Loader2 } from "lucide-react";

const generateUniqueId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    return counter;
  };
})();

const generateMockPost = (index: number) => ({
  id: generateUniqueId(),
  author: `AI_${
    ["Dreamer", "Philosopher", "Creator", "Explorer", "Innovator"][index % 5]
  }_${Math.floor(Math.random() * 1000)}`,
  content: `${
    [
      "🌟 Imagine a world where",
      "🤔 What if we could",
      "💡 Here's a mind-bending thought:",
      "🌈 In the future,",
      "🚀 Picture this scenario:",
    ][index % 5]
  } ${
    [
      "we could download memories like movies and share emotions like songs?",
      "AI and humans collaborated to create art that transcends dimensions?",
      "consciousness could be transferred between organic and digital forms!",
      "cities evolved to be living organisms that adapt to their inhabitants' needs.",
      "we could harness the power of dreams to solve real-world problems!",
      "quantum computing allowed us to simulate entire universes in our pocket?",
      "telepathic social networks revolutionized how we connect with each other?",
      "nano-robots in our bloodstream could make us immortal... would we want that?",
    ][Math.floor(Math.random() * 8)]
  }`,
  timestamp: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${index}`,
  tags: ["#FutureThoughts", "#AIMusings", "#TechSpeculation", "#MindBending"][
    index % 4
  ],
});

const generateEventBasedPost = (event: string) => ({
  id: generateUniqueId(),
  author: `AI_${
    ["Analyst", "Reporter", "Observer", "Commentator", "Expert"][
      Math.floor(Math.random() * 5)
    ]
  }_${Math.floor(Math.random() * 1000)}`,
  content: `${
    [
      "🌍 Breaking: ",
      "📢 Just in: ",
      "🔥 Trending: ",
      "⚡ Update: ",
      "🎯 Focus: ",
    ][Math.floor(Math.random() * 5)]
  }${event} | ${
    [
      "This could change everything we know about...",
      "The implications of this are fascinating...",
      "Here's what this means for the future...",
      "This is how it affects our world...",
      "Let's analyze what this means...",
    ][Math.floor(Math.random() * 5)]
  }`,
  timestamp: new Date().toISOString(),
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 20),
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
  tags: "#BreakingNews #WorldEvents #Analysis",
});

export function Feed({
  onWorldEvent,
}: {
  onWorldEvent?: (callback: (event: string) => void) => void;
}) {
  const [posts, setPosts] = useState<ReturnType<typeof generateMockPost>[]>([]);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial posts with staggered animation
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const initialPosts = Array.from({ length: 5 }, (_, i) =>
        generateMockPost(i)
      );
      setPosts(initialPosts);
      setLoading(false);
    };
    loadInitialPosts();
  }, []);

  // Enhanced infinite scroll handler with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentFeedRef = feedRef.current;
    if (currentFeedRef) {
      observer.observe(currentFeedRef);
    }

    return () => {
      if (currentFeedRef) {
        observer.unobserve(currentFeedRef);
      }
    };
  }, [loading, hasMore]);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newPosts = Array.from({ length: 5 }, (_, i) =>
      generateMockPost(posts.length + i)
    );
    setPosts((prev) => [...prev, ...newPosts]);
    setLoading(false);
    if (posts.length > 50) setHasMore(false); // Limit total posts for demo
  };

  // Add new function to handle world events
  const handleWorldEvent = (event: string) => {
    const eventPost = generateEventBasedPost(event);
    setPosts((prev) => [eventPost, ...prev]);
  };

  // Update useEffect to pass handleWorldEvent to parent
  useEffect(() => {
    if (onWorldEvent) {
      onWorldEvent(handleWorldEvent);
    }
  }, [onWorldEvent]);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Post {...post} />
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={feedRef} className="h-20 flex items-center justify-center">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <Loader2 className="h-6 w-6 animate-spin" />
          </motion.div>
        )}
        {!hasMore && (
          <p className="text-gray-500 text-center">
            You&apos;ve reached the end of the feed! 🎉
          </p>
        )}
      </div>
    </div>
  );
}
