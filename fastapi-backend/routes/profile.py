from fastapi import APIRouter, HTTPException
from typing import Dict

router = APIRouter()

@router.get("/profile/{user_id}")
async def get_profile(user_id: int):
    """Get user profile"""
    return {"user_id": user_id, "username": "example_user"}

@router.put("/profile/{user_id}")
async def update_profile(user_id: int, profile_data: Dict):
    """Update user profile"""
    return {"message": f"Profile {user_id} updated"}

@router.get("/profile/{user_id}/followers")
async def get_followers(user_id: int):
    """Get user followers"""
    return [] 