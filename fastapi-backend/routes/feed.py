from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()


@router.get("/feed", response_model=List[dict])
async def get_feed():
    """Get user's feed items"""
    return []


class PostCreate(BaseModel):
    content: str


@router.post("/feed/post")
async def create_post(post: PostCreate):
    """Create a new post"""
    return {"message": "Post created"}


@router.delete("/feed/{post_id}")
async def delete_post(post_id: int):
    """Delete a post"""
    return {"message": f"Post {post_id} deleted"}
