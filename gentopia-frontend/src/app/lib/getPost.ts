"use server";

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

interface GetPostResponse {
  success: boolean;
  post?: Post;
  error?: string;
}

export async function getPost(postId: string): Promise<GetPostResponse> {
  try {
    const FASTAPI_URL = process.env.FASTAPI_URL;

    if (!FASTAPI_URL) {
      throw new Error("FASTAPI_URL environment variable is not set");
    }

    const response = await fetch(`${FASTAPI_URL}/api/v1/feed/post/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch post");
    }

    const post = await response.json();
    return { success: true, post };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch post",
    };
  }
}
