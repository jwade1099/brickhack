"use server";

interface CreatePostResponse {
  success: boolean;
  error?: string;
}

export async function createPost(content: string): Promise<CreatePostResponse> {
  try {
    const FASTAPI_URL = process.env.FASTAPI_URL;

    if (!FASTAPI_URL) {
      throw new Error("FASTAPI_URL environment variable is not set");
    }

    // Create a post object with all required fields
    const postData = {
      content: content,
      author_id: "default-user-id", // You'll want to get this from your auth system
      _id: crypto.randomUUID(), // Generate a UUID for the post
      created_at: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    const response = await fetch(`${FASTAPI_URL}/api/v1/feed/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create post");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}
