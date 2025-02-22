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

    const response = await fetch(`${FASTAPI_URL}/api/v1/feed/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
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
