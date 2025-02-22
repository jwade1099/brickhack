"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Post } from "./Post";
import { Loader2 } from "lucide-react";

interface PostType {
  _id: string;
  content: string;
  author_id: string;
  created_at: string;
  likes: number;
  comments: any[];
  topia_id?: string;
}

export function Feed({
  onWorldEvent,
}: {
  onWorldEvent?: (callback: (event: string) => void) => void;
}) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const response = await fetch(`${FASTAPI_URL}/api/v1/feed`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Enhanced infinite scroll handler with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          // For now, we'll just disable loading more since we're getting all posts
          setHasMore(false);
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

  // Update useEffect to pass handleWorldEvent to parent
  useEffect(() => {
    if (onWorldEvent) {
      onWorldEvent((event: string) => {
        // Refresh posts when a world event occurs
        fetchPosts();
      });
    }
  }, [onWorldEvent]);

  // Add this function inside the Feed component
  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const endpoint = isLiked ? 'unlike' : 'like';

      const response = await fetch(`${FASTAPI_URL}/api/v1/feed/${postId}/${endpoint}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      // Update the posts state with the new like count
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));

    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Post
              id={post._id}
              author={post.author_id}
              content={post.content}
              timestamp={post.created_at}
              likes={post.likes}
              comments={post.comments.length}
              avatar={`https://api.dicebear.com/7.x/bottts/svg?seed=${post._id}`}
              tags={post.topia_id ? `#${post.topia_id}` : ""}
              onLike={(isLiked) => handleLike(post._id, isLiked)}
            />
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
        {!hasMore && !loading && posts.length > 0 && (
          <p className="text-gray-500 text-center">
            You&apos;ve reached the end of the feed! 🎉
          </p>
        )}
        {!loading && posts.length === 0 && (
          <p className="text-gray-500 text-center">
            No posts yet. Be the first to post! 🚀
          </p>
        )}
      </div>
    </div>
  );
}
