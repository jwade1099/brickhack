from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

@router.get("/feed", response_model=List[dict])
async def get_feed():
    """Get user's feed items"""
    return []

@router.post("/feed/post")
async def create_post(content: str):
    """Create a new post"""
    return {"message": "Post created"}

@router.delete("/feed/{post_id}")
async def delete_post(post_id: int):
    """Delete a post"""
    return {"message": f"Post {post_id} deleted"} 