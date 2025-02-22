from fastapi import APIRouter, HTTPException
from typing import Dict
from database.config import db
from models.user import UserModel
from bson import ObjectId

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

@router.get("/user/{user_id}")
async def get_user(user_id: str):
    try:
        user = await db.users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserModel(**user)
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))