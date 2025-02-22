import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface PostProps {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  avatar: string;
}

export function Post({
  author,
  content,
  timestamp,
  likes: initialLikes,
  comments,
  avatar,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image src={avatar} alt={author} fill className="object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {author}
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

          <p className="mt-2 text-gray-800 dark:text-gray-200">{content}</p>

          <div className="mt-4 flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
              <span className="text-sm">{likes}</span>
            </button>

            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{comments}</span>
            </button>

            <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
